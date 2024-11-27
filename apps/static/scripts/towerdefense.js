const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io()

const clamp = (x, a, b) => Math.max(a, Math.min(x, b))


const urlParams = new URLSearchParams(window.location.search);

const urlCode = urlParams.get("code");
const nickname = urlParams.get('nickname')



const State = Object.freeze({
    LOBBY: 'lobby',
    GAME: 'game'
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

let hostMap, clientMap, myMap

socket.on('start_game', () => {
    state = State.GAME

    hostMap = new Map()
    clientMap = new Map()

    myMap = isHost ? hostMap : clientMap
})


const Section = Object.freeze({
    Build:'build',
    Upgrade:'upgrade',
    Attack:'attack',
    Questions:'questions'
})

let section = Section.Build


let mouseX, mouseY
let mouseDown = false
let mouseClick = 0

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseX = x
    mouseY = y
});

canvas.addEventListener('touchmove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseX = x
    mouseY = y
})


canvas.addEventListener('mousedown', (event) => {
    mouseDown = true;
    mouseClick = 2;
});

canvas.addEventListener('touchstart', (event) => {
    mouseDown = true;
    mouseClick = 2;
})


canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});

canvas.addEventListener('touchend', () => {
    mouseDown = false;
})



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

function drawCircleOutline(x, y, radius, color = 'black', lineWidth = 2) {
    ctx.beginPath(); // Start a new path
    ctx.arc(x, y, radius, 0, 2 * Math.PI); // Draw a circle (full 360°)
    ctx.strokeStyle = color; // Set the outline color
    ctx.lineWidth = lineWidth; // Set the outline thickness
    ctx.stroke(); // Draw the outline
}

function drawLine(x1, y1, x2, y2, color = 'black', lineWidth = 2) {
    ctx.beginPath(); // Start a new path
    ctx.moveTo(x1, y1); // Starting point of the line
    ctx.lineTo(x2, y2); // Ending point of the line
    ctx.strokeStyle = color; // Set the line color
    ctx.lineWidth = lineWidth; // Set the line thickness
    ctx.stroke(); // Draw the line
}


let coins = 30


function distance(x_1, y_1, x_2, y_2) {
    return Math.sqrt((x_1-x_2)*(x_1-x_2)+(y_1-y_2)*(y_1-y_2))
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
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 0
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 1
            [0, 1, 0, 0, 0, 1, 1, 1, 1, 1], // 2
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0], // 3
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0], // 4
            [0, 1, 0, 0, 0, 1, 1, 1, 1, 0], // 5
            [0, 1, 0, 0, 0, 0, 0, 0, 1, 0], // 6
            [0, 1, 0, 0, 0, 0, 0, 0, 1, 0], // 7
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0], // 8
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // 9
        ]

        this.buildings = []

        this.balloonPath = [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 1, y: 3 },
            { x: 1, y: 4 },
            { x: 1, y: 5 },
            { x: 1, y: 6 },
            { x: 1, y: 7 },
            { x: 1, y: 8 },
            { x: 2, y: 8 },
            { x: 3, y: 8 },
            { x: 4, y: 8 },
            { x: 5, y: 8 },
            { x: 6, y: 8 },
            { x: 7, y: 8 },
            { x: 8, y: 8 },
            { x: 8, y: 7 },
            { x: 8, y: 6 },
            { x: 8, y: 5 },
            { x: 7, y: 5 },
            { x: 6, y: 5 },
            { x: 5, y: 5 },
            { x: 5, y: 4 },
            { x: 5, y: 3 },
            { x: 5, y: 2 },
            { x: 6, y: 2 },
            { x: 7, y: 2 },
            { x: 8, y: 2 },
            { x: 9, y: 2 }
        ];

        this.balloons = []

        this.towerHealth = 100
        
    }

    render(x_0, y_0, s) {
        this.x_0 = x_0
        this.y_0 = y_0
        this.s = s

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
                let x = x_0 + j * s/10
                let y = y_0 + i * s/10
                ctx.fillRect(x, y, s/10, s/10)
                ctx.strokeRect(x, y, s/10, s/10)
            }
        }

        // display health
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        
        ctx.fillStyle = 'black'
        ctx.fillText(this.towerHealth, x_0 + 10 * s/10, y_0 + 2 * s/10) // Hardcoded for now, need to change later

        this.buildings.forEach((building) => {
            drawCircle(x_0+building.x*s/10+s/20, y_0+building.y*s/10+s/20, s/20, building.color)
        })

        this.balloons.forEach((balloon) => {
            drawCircle(
                x_0+balloon.x*s/10+s/20, 
                y_0+balloon.y*s/10+s/20, 
                s/20 * balloon.adaptableParameters.size/100, 
                balloon.adaptableParameters.color
            )
        })
    }


    clicked(x_0, y_0, s) {

        let x_block = Math.floor((mouseX - x_0) / (s/10))
        let y_block = Math.floor((mouseY - y_0) / (s/10))

        return (
            mouseDown &&
            mouseX < x_0 + s && mouseX > x_0 &&
            mouseY < y_0 + s && mouseY > y_0
        ) ? [x_block, y_block] : false

    }


    moveBalloons() {
        for (let i = 0; i < this.balloons.length; i++) {
            const balloon = this.balloons[i];

            if (isHost && (balloon.target >= this.balloonPath.length || balloon.health <= 0)) {
                socket.emit(
                    'td-pop_balloon', 
                    {
                        map:this==hostMap?'host':'client',
                        balloonIndex:balloon.id, 
                        room:gameCode
                    }
                )
                
                if (balloon.health > 0) {
                    socket.emit(
                        'td-update_health',
                        {
                            map: this == hostMap?'host':'client',
                            newHealth: this.towerHealth - Math.ceil(balloon.health),
                            room: gameCode
                        }
                    )
                }

                balloon.target = this.balloonPath.length - 1
                continue

            } else if (balloon.target >= this.balloonPath.length) {
                // Client
                balloon.target = this.balloonPath.length - 1
                
            }

            let dirX = this.balloonPath[balloon.target].x - balloon.x
            let dirY = this.balloonPath[balloon.target].y - balloon.y
            
            const speed = balloon.adaptableParameters.speed
            balloon.x += clamp(dirX, -1/60*speed, 1/60*speed)
            balloon.y += clamp(dirY, -1/60*speed, 1/60*speed)
    
            if (Math.abs(dirX) < 1/60*speed 
                    && Math.abs(dirY) < 1/60*speed) {
                balloon.target++
                if (isHost && balloon.target < this.balloonPath.length-1) {
                    socket.emit('td-balloon_target_change', {balloon:i, position: balloon.target-1, room:gameCode, map:this==hostMap?'host':'client'})
                }
            }
        }
    }
}


class WaveManager {
    constructor(...waves) {
        this.waves = waves.map(x => x.balloons)
        this.coinBonuses = waves.map(x => x.coinBonus)

        this.queue = this.waves[0]

        this.waveCount = 0
    }

    update() {

        const noBalloons = hostMap.balloons.length == 0 && clientMap.balloons.length == 0

        if (this.queue.length == 0 && noBalloons) {
            if (this.coinBonuses.length > 0) {
                socket.emit('td-add_coins', {count:this.coinBonuses[0],room:gameCode})
                this.coinBonuses.shift()
            }
            if (this.waves.length > 1) {
                this.queue = this.waves[1]
                this.waves.shift()
                socket.emit('td-update_wave', {wave:this.waveCount+1, room:gameCode})
            } else {
                // console.log('Wave finished. No more waves.')
            }
            return
        } else if (this.queue.length <= 0) {
            return
        }

        this.queue[0].time -= 1

        if (this.queue[0].time <= 0) {
            socket.emit(
                'td-spawn_balloon',
                {
                    mapIsHost:false,
                    health:balloonData[this.queue[0].balloonIndex].health,
                    room:gameCode
                }
            )

            socket.emit(
                'td-spawn_balloon',
                {
                    mapIsHost:true,
                    health:balloonData[this.queue[0].balloonIndex].health,
                    room:gameCode
                }
            )
            
            this.queue.shift()
        }
    }

    render() {
        ctx.fillStyle = 'white'; // Fill color
        ctx.fillRect(canvas.width/2-30, canvas.height/2-30, 60, 60); // Fill the rectangle (x, y, width, height)
        ctx.lineWidth = 4; // Border thickness
        ctx.strokeStyle = 'black'; // Border color
        ctx.strokeRect(canvas.width/2-30, canvas.height/2-30, 60, 60); // Draw the border


        ctx.font = 'bold 24px Arial'; // Bold text
        ctx.textAlign = 'center'; // Center horizontally
        ctx.textBaseline = 'middle'; // Center vertically
        ctx.fillStyle = 'blue'; // Text color
        ctx.fillText(this.waveCount, canvas.width / 2, canvas.height / 2); // Draw text at center

    }
}



class Building {
    constructor(x, y) {
        if(this.constructor == Building) {
            throw new Error("Class is of abstract type and can't be instantiated");
        };

        this.x = x
        this.y = y
    }

    update() {
        this.cooldownTimer -= 1/60
    }

    shoot() {
        this.cooldownTimer = this.cooldown
    }
}

class Thorny extends Building {
    constructor(x, y) {
        super(x, y)

        this.name = 'Thorny'
        this.color = 'blue'
        this.range = 2
        this.cooldown = 2
        this.cooldownTimer = this.cooldown
        this.damage = 4
    }

    shoot(leadBalloon, map) {
        super.shoot()
        map.balloons.forEach(balloon => {
            if (distance(balloon.x, balloon.y, this.x, this.y) < this.range) {
                balloon.health -= this.damage
            }
        })
    }

    renderAttack(leadBalloon, map) {
        if (this.cooldownTimer > this.cooldown - 0.1) {
            console.log('yo')
            drawCircle(map.x_0+this.x*map.s/10+14, map.y_0+this.y*map.s/10+14, this.range*28, this.color)
        }
    }
}

class MagnifiedLaser extends Building {
    constructor(x, y) {
        super(x, y)

        this.name = 'magnified laser'
        this.color = 'red'
        this.range = 3
        this.cooldown = 0.06
        this.cooldownTimer = this.cooldown
        this.damage = 0.2
    }

    shoot(leadBalloon, map) {
        super.shoot()
        leadBalloon.health -= this.damage
    }

    renderAttack(leadBalloon, map) {
        if (leadBalloon == null) {
            return
        }
        drawLine(
            map.x_0+this.x*map.s/10+14, 
            map.y_0+this.y*map.s/10+14,
            map.x_0+leadBalloon.x*map.s/10+14,
            map.y_0+leadBalloon.y*map.s/10+14,
            this.color,
            4
        )
    }
}



class Railgun extends Building {
    constructor(x, y) {
        super(x, y)

        this.name = 'railgun'
        this.color = 'grey'
        this.range = 7
        this.cooldown = 4
        this.cooldownTimer = this.cooldown
        this.damage = 10
        this.splashRange = 1

        this.previous_x = null
        this.previous_y = null
    }

    shoot(leadBalloon, map) {
        super.shoot()
        map.balloons.forEach(balloon => {
            if (distance(balloon.x, balloon.y, leadBalloon.x, leadBalloon.y) < this.splashRange) {
                balloon.health -= this.damage
            }
        })
        this.previous_x = leadBalloon.x
        this.previous_y = leadBalloon.y
    }

    renderAttack(leadBalloon, map) {
        if (this.cooldownTimer > this.cooldown - 0.25) {
            console.log('yo')
            drawCircle(map.x_0+this.previous_x*map.s/10+14, map.y_0+this.previous_y*map.s/10+14, this.splashRange*28, this.color)
        }

        if (leadBalloon == null) {
            return
        }

        drawLine(
            map.x_0+this.x*map.s/10+14, 
            map.y_0+this.y*map.s/10+14,
            map.x_0+leadBalloon.x*map.s/10+14,
            map.y_0+leadBalloon.y*map.s/10+14,
            this.color,
            4
        )
    }
}




class Balloon {
    static idTracker = 0
    constructor(health) {
        this.health = health
        this.x = 1
        this.y = 0
        this.target = 1
        this.id = Balloon.idTracker

        Balloon.idTracker += 1
    }

    get adaptableParameters() {

        if (this.health <= 1) {
            return {
                color: 'black',
                size: 35,
                speed: 5
            }
        } else {
            return {
                color: 'red',
                size: 50,
                speed: 3
            }
        }
    }
}


const buildingData = [
    {
        name:'Thorny',
        cost: 4,
        color: 'blue',
        button: new Button(1,2,3,4,'blue'),
        index: 0,
        range: 2
    },
    {
        name: 'magnified laser',
        cost: 6,
        color: 'red',
        button: new Button(1,2,3,4,'red'),
        index: 1,
        range: 3
    },
    {
        name: 'railgun',
        cost: 10,
        color: 'grey',
        button: new Button(1,2,3,4,'grey'),
        index: 2,
        range: 7
    }
]

const buildingClassList = [
    Thorny,
    MagnifiedLaser,
    Railgun
]


const balloonData = [
    {
        name: 'basic',
        cost: 2,
        color: 'black',
        size: 30,
        health: 1,
        button: new Button(1,2,3,4,'black')
    },
    {
        name: 'standard',
        cost: 4,
        color: 'red',
        size: 40,
        health: 6,
        button: new Button(1,2,3,4,'red')
    }
]


let selectedBuilding = null

let waveManager = new WaveManager(
    {
        balloons:[
            {time:30,balloonIndex:0},
            {time:30,balloonIndex:1},
            {time:30,balloonIndex:1},
            {time:60,balloonIndex:1},
            {time:60,balloonIndex:0},
            {time:30,balloonIndex:0},
            {time:30,balloonIndex:0}
        ],
        coinBonus:10
    },
    {
        balloons:[
            {time:20,balloonIndex:1},
            {time:20,balloonIndex:1},
            {time:20,balloonIndex:1},
            {time:20,balloonIndex:1},
            {time:20,balloonIndex:1},
            {time:20,balloonIndex:1},
            {time:20,balloonIndex:1}
        ],
        coinBonus:20
    }
)

const startGameButton = new Button(canvas.width/3, canvas.height*2/3, canvas.width/3, 40, 'red')

socket.on('td-add_coins', ({count}) => {
    coins += count
})

socket.on('td-update_wave', ({wave}) => {
    waveManager.waveCount = wave
})


socket.on('td-pop_balloon', ({map, balloonIndex}) => {
    targetMap = map == 'host' ? hostMap : clientMap
    targetMap.balloons = targetMap.balloons.filter(balloon => balloon.id != balloonIndex)
})


socket.on('td-update_health', ({map, newHealth}) => {
    targetMap = map == 'host' ? hostMap : clientMap
    targetMap.towerHealth = newHealth
})


socket.on('td-balloon_target_change', ({map, balloonIndex, positionIndex}) => {
    if (isHost) {
        return
    }

    if (targetMap.balloons.length <= balloonIndex) {
        return
    }
    targetMap = map == 'host' ? hostMap : clientMap
    targetBalloon = targetMap.balloons[balloonIndex]

    targetBalloon.x = targetMap.balloonPath[positionIndex].x
    targetBalloon.y = targetMap.balloonPath[positionIndex].y

    targetBalloon.target = positionIndex + 1
})


socket.on('td-place_building', ({isForHost, x, y, index, room}) => {
    targetMap = isForHost ? hostMap : clientMap
    targetMap.buildings.push(
        new buildingClassList[index](x, y)
    )
})


socket.on('td-spawn_balloon', ({mapIsHost, health}) => {
    targetMap = mapIsHost ? hostMap : clientMap

    targetMap.balloons.push(new Balloon(health))
})


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


function drawSectionBuild() {
    for (let i = 0; i < buildingData.length; i++) {
        const building = buildingData[i];
        
        drawCircle(200+i*100, canvas.height-50, 35, building.color)

        building.button.x = 200 + i * 100 - 35
        building.button.y = canvas.height - 50 - 35
        building.button.width = 70
        building.button.height = 70

        if (building.button.clicked && coins >= building.cost) {
            selectedBuilding = building
        }

        if (selectedBuilding == building) {
            ctx.font = 'bold 12px Arial'
            ctx.textAlign = 'center'

            ctx.fillStyle = 'black'
            ctx.fillText(selectedBuilding.name, 700, 330)
            ctx.fillText(`Cost: ${selectedBuilding.cost} coins`, 700, 360)

            drawCircle(mouseX, mouseY, 10, building.color)
            drawCircleOutline(mouseX, mouseY, selectedBuilding.range*28, 'black', 2)
        }
    }
}

function drawSectionAttack() {
    for (let i = 0; i < balloonData.length; i++) {
        const balloon = balloonData[i];
        drawCircle(150+60*i, canvas.height*7/8, 55*balloon.size/100, balloon.color)

        balloon.button.x = 150+60*i-55*balloon.size/100
        balloon.button.y = canvas.height*7/8-55*balloon.size/100
        balloon.button.width = 55*balloon.size/100*2
        balloon.button.height = 55*balloon.size/100*2

        if (balloon.button.clicked && coins >= balloon.cost && mouseClick == 1) {
            if (isHost) {
                socket.emit(
                    'td-spawn_balloon',
                    {
                        mapIsHost:false,
                        health:balloon.health,
                        room:gameCode
                    }
                )
            } else {
                socket.emit(
                    'td-spawn_balloon',
                    {
                        mapIsHost:true,
                        health:balloon.health,
                        room:gameCode
                    }
                )
            }
            coins -= balloon.cost
        }
    }
}


let buildButton = new Button(20, canvas.height*3/4+20-5,30,30,'navy')
let attackButton = new Button(60, canvas.height*3/4+20-5,30,30,'navy')
let upgradeButton = new Button(20, canvas.height*3/4+60-5,30,30,'navy')
let questionButton = new Button(60, canvas.height*3/4+60-5,30,30,'navy')


function drawPurchaseArea() {

    buildButton.render()
    if (buildButton.clicked) { section = Section.Build }
    attackButton.render()
    if (attackButton.clicked) { section = Section.Attack }
    upgradeButton.render()
    if (upgradeButton.clicked) { console.log('Upgrade feature not built yet.')}
    questionButton.render()
    if (questionButton.clicked) { console.log('Question feature not built yet.')}

    switch (section) {
        case Section.Build:
            drawSectionBuild()
            break;
        
        case Section.Attack:
            drawSectionAttack()
            break;
    
        default:
            break;
    }

    ctx.font = 'bold 24px Arial'; // Bold text
    ctx.textAlign = 'center'; // Center horizontally
    ctx.textBaseline = 'middle'; // Center vertically
    ctx.fillStyle = 'gold'; // Text color
    ctx.fillText(coins, canvas.width / 2, canvas.height / 2 + 60); // Draw text at center
    ctx.lineWidth = 0.5; // Border thickness
    ctx.strokeStyle = 'black'; // Border color
    ctx.strokeText(coins, canvas.width / 2, canvas.height / 2 + 60); // Draw the border



}


function checkPlaceBuilding() {
    mclick = myMap.clicked(isHost?45:canvas.width/2+20+45, 10, canvas.height*3/4-20)

    if (mclick == false || selectedBuilding == null) {
        return
    }

    let spotEmpty = !myMap.buildings.map(building => building.x == mclick[0] && building.y == mclick[1]).includes(true)
    let mapIsGrass = myMap.map[mclick[1]][mclick[0]] == 0
    let hasCoins = selectedBuilding.cost <= coins
    
    if (
        mapIsGrass
        && spotEmpty
        && hasCoins
    ) {
        socket.emit('td-place_building', {
            isForHost:isHost,
            x:mclick[0],
            y:mclick[1],
            index:selectedBuilding.index,
            room:gameCode
        })
        coins -= selectedBuilding.cost
        selectedBuilding = null
    }
}



function handleBalloons() {
    if (isHost) {
        waveManager.update()
    }

    waveManager.render()

    hostMap.moveBalloons()
    clientMap.moveBalloons()
}


function handleBuildingShoot() {

    const loopFunction = ((theMap, building) => {
        building.update()
        let farthestBalloon = null
        let farthestBalloonTarget = -1  // Arbritrarily High Number
        theMap.balloons.forEach(balloon => {
            const d = distance(building.x, building.y, balloon.x, balloon.y)
            if (d < building.range && balloon.target > farthestBalloonTarget) {
                farthestBalloon = balloon
                farthestBalloonTarget = balloon.target
            }
        })
        building.renderAttack(farthestBalloon, theMap)
        if (farthestBalloon != null) {
            if (building.cooldownTimer > 0) {
                return
            }
            building.shoot(farthestBalloon, theMap)
        }
    })

    hostMap.buildings.forEach(building => loopFunction(hostMap, building));
    clientMap.buildings.forEach(building => loopFunction(clientMap, building));
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

    hostMap.render(45, 10, canvas.height*3/4-20)

    clientMap.render(canvas.width/2+20+45, 10, canvas.height*3/4-20)

    drawPurchaseArea()

    checkPlaceBuilding()

    handleBalloons()

    handleBuildingShoot()
}


let msPrev = window.performance.now()
const fps = 40
const msPerFrame = 1000 / fps



function draw() {

    window.requestAnimationFrame(draw)

    const msNow = window.performance.now()
    const msPassed = msNow - msPrev
  
    if (msPassed < msPerFrame) return

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

    mouseClick -= 1

    const excessTime = msPassed % msPerFrame
    msPrev = msNow - excessTime
  }

draw()