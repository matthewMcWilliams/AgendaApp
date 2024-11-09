// Get the canvas element by ID
const canvas = document.getElementById('gameCanvas');

// Get the "2d" context, which allows for 2D drawing operations
const ctx = canvas.getContext('2d');


let frame = 0

const States = Object.freeze({
    DEFAULT: 'default',
    PLACE: 'place'
})



let map1 = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-2, -2, -2, -2, -2, -2, -2, -2, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -2, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -2, -1, -1],
    [-2, -2, -2, -2, -2, -2, -2, -2, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
]

let map2 = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-2, -2, -2, -2, -2, -2, -2, -2, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -2, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -2, -1, -1],
    [-2, -2, -2, -2, -2, -2, -2, -2, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1,  0, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
]


let towers = [
    {
        color: 'blue'
    },

    {
        color: 'red'
    },

    {
        color: 'purple'
    },

    {
        color: 'pink'
    }
]



function renderMap(offsetX, map) {
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {

            
            // Draw the border
            ctx.lineWidth = 0.2;      // Border thickness
            ctx.strokeStyle = 'black'; // Border color
            ctx.strokeRect(25*x+25+offsetX, 25*y+25, 25, 25); // (x, y, width, height)

            switch (map[y][x]) {
                case -1:
                    ctx.fillStyle = 'green';
                    break;
                case -2:
                    ctx.fillStyle = 'yellow'
                    break
                default:
                    ctx.fillStyle = towers[map[y][x]].color
                    break;
            }

            ctx.fillRect(25*x+25+offsetX, 25*y+25, 25, 25)


        }
        
    }
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

    let i = 0

    towers.forEach(tower => {
        ctx.fillStyle = tower.color
        ctx.fillRect(620 + 90*(i%2), 80 + 90*Math.floor(i/2), 70, 70)
        i++
    });
}

function draw() {

    // Clear the canvas each time the function runs
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    renderLayout()

    renderMap(0, map1)
    renderMap(300, map2)

    renderTowerPurchaseSection(towers)
}



function animate() {
    draw();       // Call your draw function
    requestAnimationFrame(animate);  // Loop the function
}

animate();  // Start the animation
