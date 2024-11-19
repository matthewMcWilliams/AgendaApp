from apps import db
from flask_login import UserMixin
import math




class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    tasks = db.relationship('Task', backref='owner', lazy=True)
    decks = db.relationship('StudyDeck', backref='owner', lazy=True)
    cardTrackers = db.relationship('CardTracker', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'



class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    status = db.Column(db.Boolean, default=False)
    priority = db.Column(db.Integer, default=math.inf)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    deck_id = db.Column(db.Integer, db.ForeignKey('study_deck.id'), nullable=True)



class StudyDeck(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(70), nullable=False)
    color = db.Column(db.String(9))

    tasks = db.relationship('Task', backref='deck', lazy=True)
    cards = db.relationship('StudyCard', backref='deck', lazy=True)

    def get_display_name(self):
        return self.name.replace(' ','-')




class StudyCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    term = db.Column(db.String(200), nullable=False)
    definition = db.Column(db.String(500), nullable=False)

    deck_id = db.Column(db.Integer, db.ForeignKey('study_deck.id'), nullable=False)
    
    trackers = db.relationship('CardTracker', backref='card', lazy=True)

    

class CardTracker(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    card_id = db.Column(db.Integer, db.ForeignKey('study_card.id'), nullable=False)

    mastery_level = db.Column(db.Integer, nullable=False)

