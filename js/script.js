playerDB = [
    {name: "Cecile",
    powerUpRadius: 1},
    {name: "Regis",
    powerUpRadius: 4},
    {name: "Helen",
    powerUpRadius: 5},
    {name: "Filippo",
    powerUpRadius: 3},
    {name: "Fareaha",
    powerUpRadius: 7},
    {name: "Niccolo",
    powerUpRadius: 4},
    {name: "Amine",
    powerUpRadius: 2},
    {name: "Adele",
    powerUpRadius: 1},
    {name: "Antoine",
    powerUpRadius: 1},
    {name: "Pryihanka",
    powerUpRadius: 8},
    {name: "Harnit",
    powerUpRadius: 10},
    {name: "Jean-Nicolas",
    powerUpRadius: 6},
    {name: "Mathis",
    powerUpRadius: 2},
    {name: "Laura",
    powerUpRadius: 1},
    {name: "Chloe",
    powerUpRadius: 1},
    {name: "Mehdi",
    powerUpRadius: 1},
    {name: "Geoffrey",
    powerUpRadius: 1},
    {name: "Heather",
    powerUpRadius: 1},
    {name: "Nicolas",
    powerUpRadius: 3},
    {name: "Abi",
    powerUpRadius: 1},
    {name: "Marie",
    powerUpRadius: 1},
    {name: "Paul",
    powerUpRadius: 1},
    {name: "Nizar",
    powerUpRadius: 1},
]

// CLASSES

class Player {
    constructor(playerName, playerX, playerY, playerRadius){
        this.name = playerName;
        this.x = playerX;
        this.y = playerY;
        this.r = playerRadius;
        this.area = getArea(this.r);
        this.score = 0;
        this.screenX;
        this.screenY;
        this.speed = 20;
        this.moveTreshold = 20;
        this.playerInGame = false;
    }
    drawMe(){
        // DRAWING A CIRCLE
        // start a path (custom drawing needed for circles)
        ctx.beginPath();
        // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
        ctx.arc(this.screenX, this.screenY, this.r, 0, 2*Math.PI);
        // stroke the circle
        ctx.lineWidth = 6;
        ctx.strokeStyle = "black";
        ctx.stroke();
        // fill the circle
        ctx.fillStyle = "tomato";
        ctx.fill();
        // end the path
        ctx.closePath();
    }
    updatePlayerPosition(width, height){
        this.screenX = width/2;
        this.screenY = height/2;
    }
}

class Board {
    constructor(gridSizeX, gridSizeY){
        this.sizeX = gridSizeX;
        this.sizeY = gridSizeY;
        this.scale = 1;
    }

    drawMe(){

        var relPosition = positionToRelative(0, 0);

        // color ALL the next strokes with a color
        ctx.strokeStyle = "black";
        ctx.lineWidth = 10;
        // draw a rectangle outline (x, y, width, height)
        ctx.strokeRect(relPosition.x, relPosition.y, this.sizeX, this.sizeY);

        ctx.fillStyle = "white";
        ctx.fillRect(relPosition.x, relPosition.y, this.sizeX, this.sizeY);
    }

    // drawMeGrid(){
    //     var margin = 20;
    
    //     for (var x = -1000; x <= canvas.width + 1000; x += 40) {
    //         ctx.moveTo(0.5 + x + margin, margin);
    //         ctx.lineTo(0.5 + x + margin, canvas.height + margin);
    //     }
    
    
    //     for (var y = -1000; y <= canvas.height + 1000; y += 40) {
    //         ctx.moveTo(margin, 0.5 + y + margin);
    //         ctx.lineTo(canvas.width + margin, 0.5 + y + margin);
    //     }
    
    //     ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    //     ctx.stroke();
    // }
}

class FoodCell {
    constructor(gridSizeX, gridSizeY){
        this.name = "food";
        this.x = Math.floor(Math.random()*gridSizeX);
        this.y = Math.floor(Math.random()*gridSizeY);
        this.r = 5;
        this.area = getArea(this.r);
        this.color = "rgb(" +
        [256, 256, 256].map(el => Math.floor(Math.random()*el)).join(", ") +
        ")";
    }

    drawMe(){
        // DRAWING A CIRCLE
        var relPosition = positionToRelative(this.x, this.y);
        var onScreen = relPosition.x>=-offScreenTolerance && relPosition.x<=canvas.width+offScreenTolerance &&
            relPosition.y>=-offScreenTolerance && relPosition.y<=canvas.height+offScreenTolerance
        if (onScreen){
            // start a path (custom drawing needed for circles)
            ctx.beginPath();
            // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
            ctx.arc(relPosition.x, relPosition.y, this.r, 0, 2*Math.PI);
            // stroke the circle
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(0, 0, 0, 0)";
            ctx.stroke();
            // fill the circle
            ctx.fillStyle = this.color;
            ctx.fill();
            // end the path
            ctx.closePath();
        }        
    }
}

class Enemy {
    constructor(playerName, playerX, playerY, playerRadius){
        this.name = playerName;
        this.x = playerX;
        this.y = playerY;
        this.r = playerRadius;
        this.area = getArea(this.r);
        this.deltaX = 0;
        this.deltaY = 0;
        this.score = 0;
        this.speed = 20;
        this.moveTreshold = 20;
        this.color = "rgb(" +
        [256, 256, 256].map(el => Math.floor(Math.random()*el)).join(", ") +
        ")";
    }

    drawMe(){
        var relPosition = positionToRelative(this.x, this.y);
        var onScreen = relPosition.x>=-offScreenTolerance && relPosition.x<=canvas.width+offScreenTolerance &&
            relPosition.y>=-offScreenTolerance && relPosition.y<=canvas.height+offScreenTolerance
        if (onScreen){
            // DRAWING A CIRCLE
            // start a path (custom drawing needed for circles)
            ctx.beginPath();
            // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
            // console.log(relPosition);
            ctx.arc(relPosition.x, relPosition.y, this.r, 0, 2*Math.PI);
            // stroke the circle
            ctx.lineWidth = 6;
            ctx.strokeStyle = "black";
            ctx.stroke();
            // fill the circle
            ctx.fillStyle = this.color;
            ctx.fill();
            // end the path
            ctx.closePath();
        }
    }
}

class Trap {

}

// CANVAS SETUP

var canvas = document.querySelector(".game-canvas");
var ctx = canvas.getContext("2d");
var offScreenTolerance = 200;

// PLAYER'S MOVEMENT
setMouseMoveListener();
var mouseX = 0;
var mouseY = 0;

function setMouseMoveListener(){
    window.onmousemove = mouseMove;
    setInterval(function(){
        movePlayer(player);
        enemyPlayers.forEach(function(enemy){
            moveOneEnemy(enemy);
        });
    },100);
}

function mouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function movePlayer(player){
    if (!player.playerInGame){
        return
    }
    if (Math.abs(player.screenX - mouseX)>player.moveTreshold){
        if (player.screenX > mouseX) {
            player.x = Math.max(player.x -= player.speed, 0);
        } else {
            player.x = Math.min(player.x += player.speed, board.sizeX);
        }    }
    if (Math.abs(player.screenY - mouseY)>player.moveTreshold){
        if (player.screenY > mouseY) {
            player.y = Math.max(player.y -= player.speed, 0);
        } else {
            player.y = Math.min(player.y += player.speed, board.sizeY);
        }
    }
    // console.log("Player's position: " + player.x + ", " + player.y);
}


// CREATE INSTANCES OF CLASSES

let boardSize = {
    width: 4320,
    height: 2160,
};

let foodCount = 800;

var board = new Board(boardSize.width, boardSize.height);

var foodCells = generateFoodCells(foodCount, board);

function generateFoodCells(numberOfCells, board){
    var arrayOfCells = [];
    for (var i=0; i<numberOfCells; i++){
        arrayOfCells.push(new FoodCell(board.sizeX, board.sizeY));
    }
    return arrayOfCells;
}

// var enemyPlayers = [
//     new Enemy("enemy1", 300, 200, 10),
//     new Enemy("enemy2", 300, 400, 30),
//     new Enemy("enemy3", 300, 700, 100),
//     new Enemy("enemy4", 1600, 700, 50),
//     new Enemy("enemy5", 300, 1700, 70),
//     new Enemy("enemy6", 300, 900, 200),
//     new Enemy("enemy7", 1300, 700, 100),
// ];
var enemyPlayers = [];
var deadEnemies = [];
playerDB.forEach(function(enemyPlayer){
    spawnEnemy(enemyPlayer);
});
randomDirection(enemyPlayers);

// RUN FUNCTIONS

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

player = createPlayer("playerName");
resizeCanvas();
animationLoop();



// DRAWING LOOP

function animationLoop(){

    // --- Drawing elements ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // drawBoard();
    board.drawMe();

    foodCells.forEach(function(cell){
        cell.drawMe();
    });

    // sort enemies from smallest to largest
    enemyPlayers.sort((a,b) => a.r - b.r);
    // update offscreen tolerance value for rendering
    offScreenTolerance = Math.ceil(enemyPlayers[enemyPlayers.length-1].r);
    // Player in game
    if (player.playerInGame){
        // draw player and enemies
        enemyPlayers.filter(enemy => enemy.r <= player.r).forEach(function(enemy){
            enemy.drawMe();
        });

        player.drawMe();

        enemyPlayers.filter(enemy => enemy.r > player.r).forEach(function(enemy){
            enemy.drawMe();
        });

        // player eats food
        foodCells = eatSomething(foodCells, player);
        // player eats enemies
        enemyPlayers = eatSomething(enemyPlayers, player);
        // player is eaten
        eatPlayer(player, enemyPlayers);
    } else {
        // draw only enemies
        enemyPlayers.forEach(enemy => enemy.drawMe());
    }

    // Enemy's behaviour
    // enemy eats food
    enemyPlayers.forEach(function(enemy){
        foodCells = eatSomething(foodCells, enemy);
    });
    // enemy eats enemy
    enemyPlayers.forEach(function(enemy){
        enemyPlayers = eatSomething(enemyPlayers, enemy);
    });
    
    // no more enemies
    if (enemyPlayers.length===0){
        player.playerInGame = false;
    }

    // Replenish food stock
    if (foodCells.length<=0.7*foodCount){
        foodCells = foodCells.concat(generateFoodCells(foodCount-foodCells.length, board));
        console.log(foodCells.length);
    }

    requestAnimationFrame(function (){
        // set up a recursive loop (the drawingLoop function calls itself)
        animationLoop();
    });
}


// --- GAME LOGIC ---

function createPlayer(playerName){
    var randX = Math.floor(Math.random()*board.sizeX);
    var randY = Math.floor(Math.random()*board.sizeY);
    player = new Player(playerName, randX, randY, 40);
    player.playerInGame = false;
    return player;
}

function spawnPlayer(){
    if (player.r === 0){
        createPlayer("playerName")
    }
    player.updatePlayerPosition(canvas.width, canvas.height);
    player.playerInGame = true;
}

function spawnEnemy(enemyPlayer){
    var randX = Math.floor(Math.random()*board.sizeX);
    var randY = Math.floor(Math.random()*board.sizeY);
    var radius = 10 * enemyPlayer.powerUpRadius;
    enemyPlayers.push(new Enemy(enemyPlayer.name, randX, randY, radius));
}

function eatSomething(preyArray, predator) {
    if (preyArray.length===undefined){
        preyArray = [preyArray];
    }
    preyArray.forEach(function (prey, index){
        if (prey.r >= predator.r){
            return
        }
        if (prey.name === predator.name){
            return;
        }
        if (detectOverlapping(prey, predator, 0)) {
            predator.area += prey.area;
            predator.r = getRadius(predator.area);
            preyArray.splice(index, 1);
            if (prey.name !== 'food'){
                deadEnemies.push(playerDB.find(el => el.name===prey.name));                
            }
        }
    });
    return preyArray;
}

function eatPlayer(prey, predatorArray){
    predatorArray.forEach(function (predator){
        if (prey.r >= predator.r){
            return
        }
        if (detectOverlapping(prey, predator, 0)) {
            predator.area += prey.area;
            predator.r = getRadius(predator.area);
            prey.playerInGame = false;
            prey.r = 0;
        }
    });
}

// PLAYER AI
setInterval("randomDirection(enemyPlayers)",4000);
setInterval("respawnEnemies()",5000);

function randomDirection(enemyArray){
    enemyArray.forEach(function(onePlayer){
        moveRandom(onePlayer);
    });
}

function moveRandom(onePlayer){
    onePlayer.deltaX = Math.floor(Math.random()*201) - 100;
    onePlayer.deltaY = Math.floor(Math.random()*201) - 100;
}

function moveOneEnemy(oneEnemy){
    if (Math.abs(oneEnemy.deltaX)>oneEnemy.moveTreshold){
        if (oneEnemy.deltaX < 0) {
            oneEnemy.x = Math.max(oneEnemy.x -= oneEnemy.speed, 0);
        } else {
            oneEnemy.x = Math.min(oneEnemy.x += oneEnemy.speed, board.sizeX);
        }    }
    if (Math.abs(oneEnemy.deltaY)>oneEnemy.moveTreshold){
        if (oneEnemy.deltaY < 0) {
            oneEnemy.y = Math.max(oneEnemy.y -= oneEnemy.speed, 0);
        } else {
            oneEnemy.y = Math.min(oneEnemy.y += oneEnemy.speed, board.sizeY);
        }
    }
}

function respawnEnemies(){
    enemiesToSpwan = deadEnemies;
    deadEnemies = [];
    enemiesToSpwan.forEach(enemy => spawnEnemy(enemy));
    console.log(enemyPlayers);
}


// OTHER FUNCTIONALITIES

function positionToRelative(absX, absY){
    return {
        x: absX - player.x + (canvas.width)/2,
        y: absY - player.y + (canvas.height)/2
    };
}

function getRadius(area){
    return Math.sqrt(area/Math.PI);
}

function getArea(radius){
    return Math.PI*radius**2;
}

function detectOverlapping(cellOne, cellTwo, overlapRatio){
    // overlapRatio ([-1; 1]) states the multiplier for the smallest item's radius.
    // This is defined in order to define overlapping rules
    // 1: whole prey cell must be overlapped to be eaten
    // 0: half prey must be overlapped
    // -1: tangency is enough
    var distance = Math.sqrt((cellOne.x - cellTwo.x)**2 + (cellOne.y - cellTwo.y)**2);
    return (distance <= Math.max(cellOne.r, cellTwo.r) - overlapRatio * Math.min(cellOne.r, cellTwo.r));
};


// RESIZE WINDOW EVENT LISTENER

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    player.updatePlayerPosition(canvas.width, canvas.height);
}


// KEY PRESSES EVENT LISTENER
// keydown event handler (when user presses down on any key)

document.onkeydown = function(event){
    if(player.playerInGame){
        return
    }
    switch (event.keyCode) {
        case 13: // left arrow
            spawnPlayer();
            break;
    }
};


// TESTING