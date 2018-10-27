// CLASSES

class Player {
    constructor(playerName, playerX, playerY, playerRadius){
        this.name = playerName;
        this.x = playerX;
        this.y = playerY;
        this.r = playerRadius;
        this.score = 100;
        this.screenX;
        this.screenY;
        this.speed = 20;
        this.moveTreshold = 20;
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

class Food {
    constructor(gridSizeX, gridSizeY){
        this.x = Math.floor(Math.random()*gridSizeX);
        this.y = Math.floor(Math.random()*gridSizeY);
        this.r = 5;
        this.color = "rgb(" +
        [256, 256, 256].map(el => Math.floor(Math.random()*el)).join(", ") +
        ")";
    }

    drawMe(){
        // DRAWING A CIRCLE
        // start a path (custom drawing needed for circles)
        ctx.beginPath();
        // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
        var relPosition = positionToRelative(this.x, this.y);
        // console.log(relPosition);
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

class Enemy {
    constructor(playerName, playerX, playerY, playerRadius){
        this.name = playerName;
        this.x = playerX;
        this.y = playerY;
        this.r = playerRadius;
        this.score = 100;
        this.speed = 20;
        this.moveTreshold = 20;
        this.color = "rgb(" +
        [256, 256, 256].map(el => Math.floor(Math.random()*el)).join(", ") +
        ")";
    }

    drawMe(){
        // DRAWING A CIRCLE
        // start a path (custom drawing needed for circles)
        ctx.beginPath();
        // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
        var relPosition = positionToRelative(this.x, this.y);
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


// CANVAS SETUP

var canvas = document.querySelector(".game-canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// PLAYER'S MOVEMENT
var mouseX = 0;
var mouseY = 0;
setMouseMoveListener();

function setMouseMoveListener(){
    window.onmousemove = mouseMove;
    setInterval("movePlayer()",100);
}

function mouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function movePlayer(){
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
            player.y = Math.min(player.y += player.speed, board.sizeX);
        }
    }
    // console.log("Player's position: " + player.x + ", " + player.y);
}


// CREATE INSTANCES OF CLASSES

var player = new Player("player", 100, 100, 10);
var board = new Board(2000, 2000);

var foodCells = generateFoodCells(50, board);
function generateFoodCells(numberOfCells, board){
    var arrayOfCells = [];
    for (var i=0; i<numberOfCells; i++){
        arrayOfCells.push(new Food(board.sizeX, board.sizeY));
    }
    return arrayOfCells;
}

var enemyPlayers = [
    new Enemy("enemy1", 300, 200, 10),
    new Enemy("enemy2", 600, 400, 20),
    new Enemy("enemy3", 900, 700, 100),
];


// RUN FUNCTIONS
// resizeCanvas();
player.updatePlayerPosition(canvas.width, canvas.height);
drawingLoop();


// DRAWING LOOP

function drawingLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // drawBoard();
    board.drawMe();

    foodCells.forEach(function(cell){
        cell.drawMe();
    });

    enemyPlayers.forEach(function(enemy){
        enemy.drawMe();
    });
    // drawTestEnemy();

    player.drawMe();


    requestAnimationFrame(function (){
        // set up a recursive loop (the drawingLoop function calls itself)
        drawingLoop();
    });
}


// RESIZE WINDOW EVENT LISTENER

// window.addEventListener('resize', resizeCanvas, false);
// function resizeCanvas() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     player.updatePlayerPosition(canvas.width, canvas.height);
// }


// TESTING

// function drawTestEnemy(){
//     // DRAWING A CIRCLE
//     // start a path (custom drawing needed for circles)
//     ctx.beginPath();
//     // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
//     var absX = 200;
//     var absY = 100;
//     var relPosition = positionToRelative(absX, absY);
//     console.log(relPosition);
//     ctx.arc(relPosition.x, relPosition.y, 10, 0, 2*Math.PI);
//     // stroke the circle
//     ctx.lineWidth = 6;
//     ctx.strokeStyle = "tomato";
//     ctx.stroke();
//     // fill the circle
//     ctx.fillStyle = "black";
//     ctx.fill();
//     // end the path
//     ctx.closePath();
// }

function positionToRelative(absX, absY){
    // console.log(absX);
    // console.log(player.x);
    // console.log((canvas.width)/2);
    return {
        x: absX - player.x + (canvas.width)/2,
        y: absY - player.y + (canvas.height)/2
    };
}