const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io()



const urlParams = new URLSearchParams(window.location.search);

const urlCode = urlParams.get("code");
const nickname = urlParams.get('nickname')



const State = Object.freeze({
    LOBBY: 'lobby',
    GAME: "game"
});

let state = State.LOBBY



socket.emit('create_lobby', {
    'mode':'tower-defense',
    'deck-id':deckId,
    'code': urlCode ?? -1,
    'nickname': nickname ?? my_username
})

let gameCode = 'WAITING'
let playerList = []


socket.on('room_update', ({ _mode, players, code, _deckId }) => {
    gameCode = code;
    playerList = players;
}); 


socket.on('start_game', () => {
    console.log('starting game.')
    state = State.GAME
})



let mouseX, mouseY
let mouseDown = false

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseX = x
    mouseY = y
});

canvas.addEventListener('mousedown', (event) => {
    mouseDown = true;
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});



function setCursorPointer() {
    canvas.classList.add('cursor-pointer')
}

function setCursorNormal() {
    canvas.classList.remove('cursor-pointer')
}

function drawCircle(x, y, r, c) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2*Math.PI)
    ctx.fill()
}



class Button {
    constructor(x, y, width, height, fill='blue') {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.fill = fill
    }

    render() {
        ctx.fillStyle = this.fill
        ctx.fillRect(this.x, this.y, this.width, this.height)

        ctx.strokeStyle = 'black'
        ctx.lineWidth = 0.15
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }

    get clicked() {
        return (
            mouseDown &&
            mouseX < this.x + this.width && mouseX > this.x &&
            mouseY < this.y + this.height && mouseY > this.y
        )
    }


}


class Map {
    constructor() {
        this.map = [
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    }
}


let myMap = new Map()
let hisMap = new Map()


const startGameButton = new Button(canvas.width/3, canvas.height*2/3, canvas.width/3, 40, 'red')


function drawLobby() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center'; // Horizontally center

    ctx.fillStyle = 'black';
    ctx.fillText('Game Code:  ' + gameCode, canvas.width / 2, canvas.height / 4);

    nicknameList = playerList.map(x => Object.values(x)[0]);
    for (let i = 0; i < nicknameList.length; i++) {
        const player = nicknameList[i];
        ctx.fillText(player, canvas.width / 4, canvas.height / 2 + i * 24)
    }

    startGameButton.render()

    ctx.fillStyle = 'white'
    ctx.fillText('Start Game ➡', canvas.width/2, canvas.height*2/3+30)

    if (isHost && startGameButton.clicked) {
        socket.emit('td-start_game', gameCode)
    }
}


function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Outline
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    
    // Render purchase section
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'
    ctx.strokeRect(0, canvas.height*3/4, canvas.width, canvas.height/4)

    // Render left half
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'
    ctx.strokeRect(0, 0, canvas.width/2-20, canvas.height*3/4)
    renderMap(myMap, 1)
    
    // Render right half
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'
    ctx.strokeRect(canvas.width/2+20, 0, canvas.width/2-20, canvas.height*3/4)
    renderMap(oppMap, 2)
}


function draw() {

    switch (state) {
        case State.LOBBY:
            drawLobby()
            break
        
        case State.GAME:
            drawGame()
            break
    
        default:
            break
    }


    requestAnimationFrame(draw)
}

draw()