const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function drawCircle(x, y, r, c) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2*Math.PI)
    ctx.fill()
}

function distance(x_1, y_1, x_2, y_2) {
    return Math.sqrt((x_1-x_2)*(x_1-x_2)+(y_1-y_2)*(y_1-y_2))
}

function drawLine(x1, y1, x2, y2, color = 'black', lineWidth = 2) {
    ctx.beginPath(); // Start a new path
    ctx.moveTo(x1, y1); // Starting point of the line
    ctx.lineTo(x2, y2); // Ending point of the line
    ctx.strokeStyle = color; // Set the line color
    ctx.lineWidth = lineWidth; // Set the line thickness
    ctx.stroke(); // Draw the line
}

export class Building {
    constructor(x, y) {
        if(this.constructor == Building) {
            throw new Error("Class is of abstract type and can't be instantiated");
        };

        this.x = x
        this.y = y
        this.upgradeLevel = 0
    }

    update() {
        this.cooldownTimer -= 1/60
    }

    shoot() {
        this.cooldownTimer = this.cooldown
    }
}

export class Thorny extends Building {
    constructor(x, y) {
        super(x, y);

        this.name = 'Thorny';
        this.color = 'blue';
        this.range = 2;
        this.cooldown = 1.5;
        this.cooldownTimer = this.cooldown;
        this.damage = 7;
    }

    shoot(leadBalloon, map) {
        super.shoot();
        map.balloons.forEach(balloon => {
            if (distance(balloon.x, balloon.y, this.x, this.y) < this.range) {
                balloon.health -= this.damage;
            }
        });
    }

    renderAttack(leadBalloon, map) {
        if (this.cooldownTimer > this.cooldown - 0.1) {
            drawCircle(
                map.x_0 + this.x * map.s / 10 + 14,
                map.y_0 + this.y * map.s / 10 + 14,
                this.range * 28,
                this.color
            );
        }
    }
}


export class MagnifiedLaser extends Building {
    constructor(x, y) {
        super(x, y)

        this.name = 'Magnified Laser'
        this.color = 'red'
        this.range = 3
        this.cooldown = 0.06
        this.cooldownTimer = this.cooldown
        this.damage = 0.35
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
            map.x_0 + this.x * map.s / 10 + 14,
            map.y_0 + this.y * map.s / 10 + 14,
            map.x_0 + leadBalloon.x * map.s / 10 + 14,
            map.y_0 + leadBalloon.y * map.s / 10 + 14,
            this.color,
            4
        )
    }
}

export class Railgun extends Building {
    constructor(x, y) {
        super(x, y)

        this.name = 'Railgun'
        this.color = 'grey'
        this.range = 7
        this.cooldown = 4
        this.cooldownTimer = this.cooldown
        this.damage = 30
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
            drawCircle(map.x_0 + this.previous_x * map.s / 10 + 14, map.y_0 + this.previous_y * map.s / 10 + 14, this.splashRange * 28, this.color)
        }

        if (leadBalloon == null) {
            return
        }

        drawLine(
            map.x_0 + this.x * map.s / 10 + 14,
            map.y_0 + this.y * map.s / 10 + 14,
            map.x_0 + leadBalloon.x * map.s / 10 + 14,
            map.y_0 + leadBalloon.y * map.s / 10 + 14,
            this.color,
            4
        )
    }
}

// New towers

export class SlowTower extends Building {
    constructor(x, y) {
        super(x, y)

        this.name = 'Slow Tower'
        this.color = 'cyan'
        this.range = 3
        this.cooldown = 0.5
        this.cooldownTimer = this.cooldown
        this.slowEffect = 0.5 // Slow balloons by 50%
    }

    shoot(leadBalloon, map) {
        super.shoot()
        map.balloons.forEach(balloon => {
            balloon.speedMultiplier = balloon.speedMultiplier + (1 - balloon.speedMultiplier) / 3
            if (distance(balloon.x, balloon.y, this.x, this.y) < this.range) {
                balloon.speedMultiplier = (1 - this.slowEffect) // Slow the balloon speed
            }
        })
    }

    renderAttack(leadBalloon, map) {
        if (this.cooldownTimer > this.cooldown - 0.1) {
            drawCircle(map.x_0 + this.x * map.s / 10 + 14, map.y_0 + this.y * map.s / 10 + 14, this.range * 28, this.color)
        }
    }
}

export class SplashCannon extends Building {
    constructor(x, y) {
        super(x, y)

        this.name = 'Splash Cannon'
        this.color = 'yellow'
        this.range = 3
        this.cooldown = 2
        this.cooldownTimer = this.cooldown
        this.damage = 5
        this.splashRange = 1.5
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
        if (this.cooldownTimer > this.cooldown - 0.1) {
            drawCircle(map.x_0 + this.x * map.s / 10 + 14, map.y_0 + this.y * map.s / 10 + 14, this.splashRange * 28, this.color)
        }
    }
}

export class LightningTower extends Building {
    constructor(x, y) {
        super(x, y)

        this.name = 'Chain Lightning Tower'
        this.color = 'purple'
        this.range = 5
        this.cooldown = 0.1
        this.cooldownTimer = this.cooldown
        this.damage = 0.6
        this.chainRange = 3 // Chain to nearby balloons
    }

    shoot(leadBalloon, map) {
        super.shoot()
        map.balloons.forEach(balloon => {
            if (distance(balloon.x, balloon.y, this.x, this.y) < this.range) {
                balloon.health -= this.damage
                // Chain to nearby balloons
                map.balloons.forEach(chainBalloon => {
                    if (distance(chainBalloon.x, chainBalloon.y, balloon.x, balloon.y) < this.chainRange) {
                        chainBalloon.health -= this.damage
                    }
                })
            }
        })
    }

    renderAttack(leadBalloon, map) {    
        // Check if there are balloons within range to be hit by lightning
        map.balloons.forEach(balloon => {
            if (distance(balloon.x, balloon.y, this.x, this.y) < this.range) {
                // Draw a yellow line from the tower to the balloon
                drawLine(
                    map.x_0 + this.x * map.s / 10 + 14, // Tower's x position
                    map.y_0 + this.y * map.s / 10 + 14, // Tower's y position
                    map.x_0 + balloon.x * map.s / 10 + 14, // Balloon's x position
                    map.y_0 + balloon.y * map.s / 10 + 14, // Balloon's y position
                    'yellow', // Lightning color
                    2 // Line width
                );
    
                // Now, handle the chaining to other nearby balloons
                map.balloons.forEach(chainBalloon => {
                    if (distance(chainBalloon.x, chainBalloon.y, balloon.x, balloon.y) < this.chainRange) {
                        // Draw a yellow line from the first balloon to the chained balloon
                        drawLine(
                            map.x_0 + balloon.x * map.s / 10 + 14, // First balloon's x
                            map.y_0 + balloon.y * map.s / 10 + 14, // First balloon's y
                            map.x_0 + chainBalloon.x * map.s / 10 + 14, // Chained balloon's x
                            map.y_0 + chainBalloon.y * map.s / 10 + 14, // Chained balloon's y
                            'yellow', // Lightning color
                            2 // Line width
                        );
                    }
                });
            }
        });
    }
    
}

export class SniperTower extends Building {
    constructor(x, y) {
        super(x, y)

        this.name = 'Sniper Tower'
        this.color = 'green'
        this.range = 7
        this.cooldown = 1
        this.cooldownTimer = this.cooldown
        this.damage = 10
        this.critChance = 0.2
    }

    shoot(leadBalloon, map) {
        super.shoot()
        let crit = Math.random() < this.critChance
        let damage = crit ? this.damage * 2 : this.damage
        leadBalloon.health -= damage
    }

    renderAttack(leadBalloon, map) {
        if (this.cooldownTimer > this.cooldown - 0.1) {
            drawCircle(map.x_0 + this.x * map.s / 10 + 14, map.y_0 + this.y * map.s / 10 + 14, this.range * 28, this.color)
        }
    }
}

export const buildingClassList = [
    Thorny,
    MagnifiedLaser,
    Railgun,
    SplashCannon,
    SlowTower,
    SniperTower,
    LightningTower
]
