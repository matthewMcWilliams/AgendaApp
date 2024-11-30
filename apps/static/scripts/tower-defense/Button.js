const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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


export default class Button {
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