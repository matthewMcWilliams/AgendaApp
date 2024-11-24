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

    emit(
        'td-place_building',
        {'map': 'host' if isHost else 'client', 'x': x_, 'y': y_, 'tower':tower},
        room=f'game_{room}'
    )

@socketio.on('td-spawn_balloon')
def spawn_balloon(data):
    isHost = data['isHost']
    balloonData = data['balloonData']
    room = data['room']
    
    emit(
        'td-spawn_balloon',
        {
            'map': 'host' if isHost else 'client',
            'data': balloonData
        },
        room=f'game_{room}'
    )


@socketio.on('td-balloon_target_change')
def balloon_target_change(data):
    balloonIndex = data['balloon']
    positionIndex = data['position']
    room = data['room']
    _map = data['map']

    emit('td-balloon_target_change',
         {
             'map':_map,
             'balloonIndex':balloonIndex,
             'positionIndex':positionIndex
         },
         room=f'game_{room}')


@socketio.on('td-pop_balloon')
def pop_balloon(data):
    emit('td-pop_balloon', data, room=f'game_{data['room']}')


@socketio.on('td-update_health')
def update_health(data):
    emit('td-update_health', data, room=f'game_{data['room']}')

@socketio.on('td-update_wave')
def update_wave(data):
    emit('td-update_wave', data, room=f'game_{data['room']}')

@socketio.on('td-add_coins')
def update_wave(data):
    emit('td-add_coins', data, room=f'game_{data['room']}')

