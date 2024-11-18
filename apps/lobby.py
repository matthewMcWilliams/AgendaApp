from apps import socketio
from flask import Blueprint, render_template, request, flash
from flask_socketio import emit, join_room, leave_room
from flask_login import current_user

lobby_bp = Blueprint('lobby', __name__)





lobbies = []





@lobby_bp.route('/join')
def join():
    return render_template('/study/play/lobby.html')



@socketio.on('connect')
def handle_connect():
    pass



@socketio.on('disconnect')
def handle_disconnect():
    pass



@socketio.on('create_lobby')
def create_lobby(data):
    # if the user came from join lobby screen
    code = int(data['code'])
    if code >= 0:
        lobby = join_lobby({'code':code, 'nickname':data['nickname']})
        lobby['players'].append({request.sid:data['nickname']})
    
    else:

        import random  # Ensure random is imported if it isn't already
        code = random.randint(0, 99999)
        while code in [lobby['code'] for lobby in lobbies]:
            code = random.randint(0, 99999)

        lobby = {
            'mode': data['mode'],
            'players': [{request.sid:data['nickname']}],
            'code': code,
            'deck-id': data['deck-id']
        }

        lobbies.append(lobby)

    room = f'game_{code}'
    join_room(room)
    emit('room_update', lobby, room=room)



@socketio.on('join_lobby')
def join_lobby(data):
    code = data['code']
    nickname = data['nickname']

    try:
        code = int(code)
    except (ValueError, TypeError):
        code = -1
    
    lobby = next((n for n in lobbies if n['code']==int(code)), None)
    
    if lobby is not None:
        emit('joined_room', {'deckId': lobby['deck-id'], 'gameCode': code}, to=request.sid)
    else:
        flash('Lobby does not exist') 

    return lobby