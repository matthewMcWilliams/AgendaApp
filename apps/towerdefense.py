from flask import Blueprint, render_template, request
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


@socketio.on('td-place_building')
def place_building(x_, y_, player_list, tower, room):
    player_sids = [[k for k in player.keys()][0] for player in player_list]

    isHost = player_sids[0]==request.sid

    print(isHost)

    emit(
        'td-place_building',
        {'map': 'host' if isHost else 'client', 'x': x_, 'y': y_, 'tower':tower},
        room=f'game_{room}'
    )