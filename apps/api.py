from flask import Blueprint, request, jsonify
from apps.database import db, StudyDeck, StudyCard, CardTracker

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/deck/<int:id>', methods=['GET'])
def get_deck_data(id):
    # body = request.get_json()
    # deck_id = body.get('id', None)
    deck_id = id

    deck = db.session.execute(db.select(StudyDeck).filter_by(id=deck_id)).scalar_one_or_none()
    
    return jsonify({
        'cards': [
            {
                'term': card.term,
                'definition': card.definition
            } for card in deck.cards]
    })