from flask import Blueprint, render_template, request, redirect, url_for
from apps.database import db, StudyDeck, StudyCard, CardTracker
from flask_login import login_required, current_user

study_bp = Blueprint('study', __name__)

@study_bp.route('/study', methods=['GET'])
@login_required
def study():
    user_decks = db.session.execute(db.select(StudyDeck).filter_by(user_id=current_user.id)).scalars()
    return render_template('study.html', decks=user_decks)

@study_bp.route('/study/new_deck', methods=['GET', 'POST'])
@login_required
def new_deck():
    if request.method == 'POST':
        name = request.form['title']
        color = request.form['color']
        data = request.form['data']

        new_deck = StudyDeck(user_id=current_user.id, name=name, color=color)
        db.session.add(new_deck)
        db.session.commit()

        processed_data = [[j.strip() for j in i.split(',')] for i in data.splitlines()]

        for card in processed_data:
            new_card = StudyCard(deck_id=new_deck.id, term=card[0], definition=card[1])
            db.session.add(new_card)

        db.session.commit()

        if True:
            return redirect(url_for('study.study'))
        else:
            flash('Invalid username or password.')

    return render_template('study/new.html')

@study_bp.route('/study/decks/<int:id>', methods=['GET'])
@login_required
def deck_view(id):
    deck = db.session.execute(db.select(StudyDeck).filter_by(id=id)).scalar()
    return render_template('study/deck.html', deck=deck)


@study_bp.route('/study/remove_deck', methods=['POST'])
@login_required
def remove_deck():    
    deck_id = int(request.form['deck_id'])

    deck = db.session.get(StudyDeck, deck_id)
    for card in deck.cards:
        db.session.delete(card)
    db.session.delete(deck)

    db.session.commit()
    
    return redirect(url_for('study.study'))

@study_bp.route('/study/decks/<int:id>/flashcards', methods=['GET'])
@login_required
def flashcards(id):
    deck = db.session.execute(db.select(StudyDeck).filter_by(id=id)).scalar()
    cards = '[' + ','.join([f'[{"'"+card.term+"'"}, {"'"+card.definition+"'"}]' for card in deck.cards]) + ']'
    return render_template(f'study/flashcards.html', deck=deck, cards=cards)

@study_bp.route('/study/decks/<int:id>/learn', methods=['GET'])
@login_required
def learn(id):
    deck = db.session.execute(db.select(StudyDeck).filter_by(id=id)).scalar()

    out = '['
    for card in deck.cards:
        tracker = db.session.execute(db.select(CardTracker).filter_by(card_id=card.id).filter_by(user_id=current_user.id)).scalar_one_or_none()
        mastery_level = 0
        if mastery_level is not None:
            mastery_level = tracker.mastery_level
        out += f'{{"id":{card.id},"term":"{card.term}","definition":"{card.definition}","mastery":{mastery_level}}},'
        pass
    out = out[:-1]
    out += ']'

    cards = out

    return render_template(f'study/learn.html', deck=deck, cards=cards)

@study_bp.route('/study/decks/<int:id>/learn/save', methods=['POST'])
@login_required
def save_learn(id):
    for i in range(int(request.form['length'])):
        card_id = int(request.form[f"{i}-id"])
        card = db.session.get(StudyCard, card_id)

        mastery = request.form[f'{i}-mastery']
        
        card_trackers = db.session.execute(db.select(CardTracker).filter_by(user=current_user, card=card)).scalar()
        if not card_trackers:
            new_tracker = CardTracker(user_id=current_user.id, card_id = card.id, mastery_level=mastery)
            db.session.add(new_tracker)
        else:
            card_trackers.mastery_level = mastery
    
    db.session.commit()
    return redirect(f'/study/decks/{id}/learn')


@study_bp.route('/study/decks/<int:id>/learn/reset', methods=['POST'])
@login_required
def reset_learn(id):
    cards = db.session.execute(db.select(StudyCard).filter_by(deck_id=id)).scalars().all()
    for card in cards:
        card_tracker = db.session.execute(db.select(CardTracker).filter_by(user=current_user, card=card)).scalar()
        card_tracker.mastery_level = 0
    db.session.commit()
    return redirect(f'/study/decks/{id}/learn')


@study_bp.route('/study/decks/<int:id>/play', methods=['GET'])
@login_required
def play(id):
    deck = db.session.execute(db.select(StudyDeck).filter_by(id=id)).scalar()

    out = '['
    for card in deck.cards:
        mastery_level = 0
        out += f'{{"id":{card.id},"term":"{card.term}","definition":"{card.definition}","mastery":{mastery_level}}},'
        pass
    out = out[:-1]
    out += ']'

    cards = out

    return render_template(f'study/play/play.html', deck=deck, cards=cards)
