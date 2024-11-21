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

let isHost = false

socket.on('room_update', ({ _mode, players, code, _deckId }) => {
    gameCode = code;
    playerList = players;
}); 

socket.on('set_host', () => {
    isHost = true
})


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
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 1, 1, 1, 1],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]

        this.buildings = [
            {'type':'turret','color':'blue','x':3,'y':5}
        ]
    }

    render(x_0, y_0, w, h) {
        for (let i = 0; i < this.map.length; i++) {
            const list = this.map[i];
            for (let j = 0; j < list.length; j++) {
                const tileID = list[j];
                
                // get color
                switch (tileID) {
                    case 0:
                        ctx.fillStyle = 'green'
                        break;
                    case 1:
                        ctx.fillStyle = 'yellow'
                    default:
                        break;
                }
                ctx.strokeStyle = 'black'
                ctx.lineWidth = 0.2

                // draw rect
                let x = x_0 + j * w/10
                let y = y_0 + i * w/10
                ctx.fillRect(x, y, w/10, h/10)
                ctx.strokeRect(x, y, w/10, h/10)
            }
        }

        this.buildings.forEach(({type, color, x, y}) => {
            drawCircle(x_0+x*w/10+w/20, y_0+y*w/10+w/20, w/20, color)
        })
    }
}



const towers = [
    {
        name:'turbit',
        cost: 2,
        color: 'blue',
        button: new Button(1,2,3,4,'blue')
    },
    {
        name: 'magnified laser',
        cost: 6,
        color: 'red',
        button: new Button(1,2,3,4,'red')
    },
    {
        name: 'railgun',
        cost: 10,
        color: 'grey',
        button: new Button(1,2,3,4,'grey')
    }
]

let selectedTower = null

let hostMap = new Map()
let clientMap = new Map()


const startGameButton = new Button(canvas.width/3, canvas.height*2/3, canvas.width/3, 40, 'red')


function drawLayout() {
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
    
    // Render right half
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'
    ctx.strokeRect(canvas.width/2+20, 0, canvas.width/2-20, canvas.height*3/4)
}


function drawPurchaseArea() {

    for (let i = 0; i < towers.length; i++) {
        const tower = towers[i];
        
        drawCircle(200+i*100, canvas.height-50, 35, tower.color)

        tower.button.x = 200 + i * 100 - 35
        tower.button.y = canvas.height - 50 - 35
        tower.button.width = 70
        tower.button.height = 70

        if (tower.button.clicked) {
            selectedTower = tower
        }

        if (selectedTower == tower) {
            ctx.font = 'bold 12px Arial'
            ctx.textAlign = 'center'

            ctx.fillStyle = 'black'
            ctx.fillText(tower.name, 700, 330)
            ctx.fillText(`Cost: ${tower.cost} coins`, 700, 360)
        }
    }

}


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
    
    if (isHost) {
        startGameButton.render()

        ctx.fillStyle = 'white'
        ctx.fillText('Start Game ➡', canvas.width/2, canvas.height*2/3+30)
    }


    if (isHost && startGameButton.clicked) {
        socket.emit('td-start_game', gameCode)
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawLayout()

    hostMap.render(45, 10, canvas.height*3/4-20, canvas.height*3/4-20)

    clientMap.render(canvas.width/2+20+45, 10, canvas.height*3/4-20, canvas.height*3/4-20)

    drawPurchaseArea()
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