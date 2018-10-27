// CLASSES

class Player {
    constructor(playerName, playerX, playerY, playerRadius){
        this.name = playerName;
        this.x = playerX;
        this.y = playerY;
        this.r = playerRadius;
        this.area = Math.PI*this.r**2;
        this.score = 0;
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

class FoodCell {
    constructor(gridSizeX, gridSizeY){
        this.x = Math.floor(Math.random()*gridSizeX);
        this.y = Math.floor(Math.random()*gridSizeY);
        this.r = 5;
        this.area = Math.PI*this.r**2;
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
        this.area = Math.PI*this.r**2;
        this.score = 0;
        this.speed = 20;
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

class Trap {

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

var board = new Board(2000, 2000);

var foodCells = generateFoodCells(800, board);
function generateFoodCells(numberOfCells, board){
    var arrayOfCells = [];
    for (var i=0; i<numberOfCells; i++){
        arrayOfCells.push(new FoodCell(board.sizeX, board.sizeY));
    }
    return arrayOfCells;
}

var enemyPlayers = [
    new Enemy("enemy1", 300, 200, 10),
    new Enemy("enemy2", 600, 400, 30),
    new Enemy("enemy3", 900, 700, 100),
];

var player = new Player("player", 100, 100, 20);

// RUN FUNCTIONS
// resizeCanvas();
player.updatePlayerPosition(canvas.width, canvas.height);
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

    enemyPlayers.filter(enemy => enemy.r <= player.r).forEach(function(enemy){
        enemy.drawMe();
    });

    player.drawMe();

    enemyPlayers.filter(enemy => enemy.r > player.r).forEach(function(enemy){
        enemy.drawMe();
    });


    // --- Game logic ---
    // foodCells.forEach(function (foodCell, index){
    //     if (detectOverlapping(foodCell, player, 0.5)) {
    //         player.area += foodCell.area;
    //         player.r = getRadius(player.area);
    //         foodCells.splice(index, 1);
    //     }
    // });

    foodCells = eatSomething(foodCells, player);
    enemyPlayers = eatSomething(enemyPlayers, player);
    // player = eatSomething(player, enemyPlayers);

    function eatSomething(preyArray, predator) {
        if (preyArray.length===undefined){
            preyArray = [preyArray];
        }
        preyArray.forEach(function (foodCell, index){
            if (detectOverlapping(foodCell, predator, 0.5)) {
                predator.area += foodCell.area;
                predator.r = getRadius(predator.area);
                preyArray.splice(index, 1);
            }
        });
        return preyArray;
    }

    // function eatSomething(preyArray, predator) {
    //     preyArray.filter(function (onePrey){
    //         if (detectOverlapping(onePrey, predator, 1)) {
    //             predator.area += onePrey.area;
    //             predator.r = getRadius(predator.area);
    
    //             return false;
    //         }
    //         return true;
    //     });
    //     return preyArray;
    // }

    requestAnimationFrame(function (){
        // set up a recursive loop (the drawingLoop function calls itself)
        animationLoop();
    });
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

// window.addEventListener('resize', resizeCanvas, false);
// function resizeCanvas() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     player.updatePlayerPosition(canvas.width, canvas.height);
// }


// TESTING