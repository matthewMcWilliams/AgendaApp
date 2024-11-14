const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io()


let playerID
let frame = 0


const States = Object.freeze({
    DEFAULT: 'default',
    PLACE: 'place'
})

let state = States.DEFAULT
let selectedTower




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


class MapButton extends Button {
    constructor(x, y, width, height, fill='blue', id) {
        super(x,y,width,height,fill)

        this.id = id
    }
}




let towers = [
    {
        color: 'blue',
        cost: 1
    },

    {
        color: 'red',
        cost: 3
    },

    {
        color: 'purple',
        cost: 10
    },

    {
        color: 'pink',
        cost: 30
    }
]


let i = 0

towers.forEach(tower => {
    tower.button = new Button(620 + 90*(i%2),
        80 + 90*Math.floor(i/2),
        70, 70, tower.color)
    tower.index = i
    i++
});





let map1 = [
    [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [ -2, -3, -4, -5, -6, -7, -8, -9, -1, -1],
    [ -1, -1, -1, -1, -1, -1, -1,-10, -1, -1],
    [ -1, -1, -1, -1, -1, -1, -1,-11, -1, -1],
    [-19,-18,-17,-16,-15,-14,-13,-12, -1, -1],
    [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
]    

let map2 = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1,  3, -1, -1],
    [-2, -2, -2, -2, -2, -2, -2, -2, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -2, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -2, -1, -1],
    [-2, -2, -2, -2, -2, -2, -2, -2, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1,  0, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
]    


coins = 100


offsetX = 0

function compileMap(map, offsetX) {
    let out = []
    for (let i = 0; i < map.length; i++) {
        const rowData = map[i];
        let row = []
        for (let j = 0; j < rowData.length; j++) {
            const id = rowData[j];
            let color
            switch (true) {
                case (id == -1):
                    color = 'green';
                    break;
                case (id < -1):
                    color = 'yellow'
                    break
                default:
                    color = towers[id].color
                    break;
            }    
            
            row.push(
                new MapButton(
                    25*j+25+offsetX,
                    25*i+75,
                    25, 25, color, id
                )    
            )    
        }    

        out.push(row)
    }    
    return out
}            


let mapButtons1 = compileMap(map1, 0)
let mapButtons2 = compileMap(map2, 300)


function renderMap(map, text, offsetX) {

    
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            
            
            map[y][x].render()
            
            if (map[y][x].clicked && selectedTower && map[y][x].id==-1 && selectedTower.cost <= coins) {
                socket.emit('place_building', {'building':selectedTower.index, 'x': x, 'y': y})
                coins -= selectedTower.cost
                selectedTower = null
                setCursorNormal()
            }
            
        }
        
    }
    ctx.fillStyle = 'black'
    ctx.fillText(text, offsetX + 150, 50)
}

    
function renderLayout() {
    ctx.lineWidth = 4;      // Border thickness
    ctx.strokeStyle = 'black'; // Border color
    ctx.strokeRect(0, 0, 300, canvas.height); // (x, y, width, height)
    ctx.strokeRect(300, 0, 300, canvas.height); // (x, y, width, height)
    ctx.strokeRect(600, 0, 200, canvas.height); // (x, y, width, height)
}


function renderTowerPurchaseSection(towers) {
    // Set font style and size
    ctx.font = 'bold 24px Arial';

    ctx.textAlign = 'center'; // Horizontally center

    // Draw filled text
    ctx.fillStyle = 'black';
    ctx.fillText('Get A Tower', 700, 50); // (text, x, y)
    ctx.fillStyle = 'gold'
    ctx.fillText('Coins: ' + coins, 700, 350)

    let i = 0

    towers.forEach(tower => {
        tower.button.render()

        if (tower.button.clicked && selectedTower !== tower) {
            console.log(tower.color)
            selectedTower = tower
            setCursorPointer()
        }
    });
}

function draw() {

    // Clear the canvas each time the function runs
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    renderLayout()

    renderMap(mapButtons1, "opponent", 0)
    renderMap(mapButtons2, "you", 300)

    renderTowerPurchaseSection(towers)
}



function animate() {
    draw();       // Call your draw function
    requestAnimationFrame(animate);  // Loop the function
}

animate();  // Start the animation



socket.on('game_state', ({ map1, map2 }) => {  // Destructure map1 and map2 from the received object
    mapButtons1 = compileMap(map1, 0);
    mapButtons2 = compileMap(map2, 300);
});

socket.on('player_id', ({id}) => {
    playerID = id
})

socket.emit('start_game')