from flask import Blueprint, render_template
from flask_login import login_required, current_user
from apps.lobby import socketio, emit



towerdefense_bp = Blueprint('towerdefense', __name__)


@towerdefense_bp.route('/study/decks/<int:id>/play/tower-defense')
@login_required
def tower_defense(id):
    return render_template('study/play/tower-defense.html', deckId=id, username=current_user.username)



@socketio.on('td-start_game')
def start_game(room):
    emit('start_game', room=f'game_{room}')
