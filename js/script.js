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
    {name: "Priyanka",
    powerUpRadius: 6},
    {name: "Harnit",
    powerUpRadius: 6},
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
    {name: "Geoffroy",
    powerUpRadius: 8},
    {name: "Heather",
    powerUpRadius: 1},
    {name: "Nicolas",
    powerUpRadius: 3},
    {name: "Abi",
    powerUpRadius: 1},
    {name: "Marie",
    powerUpRadius: 1},
    {name: "Paul",
    powerUpRadius: 2},
    {name: "Nizar",
    powerUpRadius: 4},
];

playerDB = playerDB.slice(0,playerDB.length);


// CLASSES

class Player {
    constructor(playerName, playerX, playerY, playerRadius){
        this.name = playerName;
        this.x = playerX;
        this.y = playerY;
        this.r = playerRadius;
        this.area = getArea(this.r);
        this.score = Math.floor(this.area*SCORE_MULTIPLIER);
        this.color = "tomato";
        this.screenX;
        this.screenY;
        this.topSpeed;
        this.playerInGame = false;
        this.history = [];
        calculateSpeed(this);
    }
    drawMe(){
        // DRAWING A CIRCLE
        // start a path (custom drawing needed for circles)
        ctx.beginPath();
        // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
        ctx.arc(this.screenX, this.screenY, this.r*board.scale, 0, 2*Math.PI);
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
    updatePlayerPosition(width, height){
        this.screenX = width/2;
        this.screenY = height/2;
    }
}

class Board {
    constructor(gridSizeX, gridSizeY, theme){
        this.sizeX = gridSizeX;
        this.sizeY = gridSizeY;
        this.scale = 1;
        this.theme = theme;
    }

    drawMe(){

        var relPosition = positionToRelative(0, 0);

        // color ALL the next strokes with a color
        ctx.strokeStyle = "black";
        ctx.lineWidth = 10;
        // draw a rectangle outline (x, y, width, height)
        ctx.strokeRect(relPosition.x, relPosition.y, this.sizeX*board.scale, this.sizeY*board.scale);

        ctx.fillStyle = this.theme === "night" ? "rgb(100, 100, 100)" : "white";
        ctx.fillRect(relPosition.x, relPosition.y, this.sizeX*board.scale, this.sizeY*board.scale);
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
        [256, 256, 256].map(channel => Math.floor(Math.random()*channel)).join(", ") +
        ")";
    }

    drawMe(){
        // DRAWING A CIRCLE
        var relPosition = positionToRelative(this.x, this.y);
        var onScreen = relPosition.x>=-offScreenTolerance/2 && relPosition.x<=canvas.width+offScreenTolerance/2 &&
            relPosition.y>=-offScreenTolerance/2 && relPosition.y<=canvas.height+offScreenTolerance/2
        if (onScreen){
            // start a path (custom drawing needed for circles)
            ctx.beginPath();
            // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
            ctx.arc(relPosition.x, relPosition.y, this.r*board.scale, 0, 2*Math.PI);
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
        this.score = Math.floor(this.area*SCORE_MULTIPLIER);
        this.topSpeed;
        this.color = "rgb(" +
        [256, 256, 256].map(el => Math.floor(Math.random()*el)).join(", ") +
        ")";
        this.history = [];
        calculateSpeed(this);
    }

    drawMe(){
        var relPosition = positionToRelative(this.x, this.y);
        var distance = Math.sqrt((relPosition.x - canvas.width/2)**2 + (relPosition.y - canvas.height/2)**2) - this.r*board.scale;
        var screenHalfDiagonal = Math.sqrt(player.screenX**2 + player.screenY**2);
        var onScreen = distance < screenHalfDiagonal;

        if (onScreen){
            // DRAWING A CIRCLE
            // start a path (custom drawing needed for circles)
            ctx.beginPath();
            // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
            // console.log(relPosition);
            ctx.arc(relPosition.x, relPosition.y, this.r*board.scale, 0, 2*Math.PI);
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
    constructor(gridSizeX, gridSizeY){
        this.name = "trap";
        this.x = Math.floor(Math.random()*gridSizeX);
        this.y = Math.floor(Math.random()*gridSizeY);
        this.r = 60;
        this.color = "green";
    }

    drawMe(){
        // DRAWING A CIRCLE
        var relPosition = positionToRelative(this.x, this.y);
        var onScreen = relPosition.x>=-offScreenTolerance && relPosition.x<=canvas.width+offScreenTolerance &&
            relPosition.y>=-offScreenTolerance && relPosition.y<=canvas.height+offScreenTolerance;
        
        if (onScreen){
            // start a path (custom drawing needed for circles)
            ctx.beginPath();
            // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
            ctx.arc(relPosition.x, relPosition.y, this.r*board.scale, 0, 2*Math.PI);
            // stroke the circle
            ctx.lineWidth = 2;
            ctx.strokeStyle = "green";
            ctx.stroke();
            // fill the circle
            ctx.fillStyle = this.color;
            ctx.fill();
            // end the path
            ctx.closePath();
        }        
    }
}

class FreeMass {
    constructor(parentCell, ejectedMass, direction){
        this.name = "mass";
        this.initialOffset = 30;
        this.x = parentCell.x + (parentCell.r + this.initialOffset)*direction.signX*direction.scalarX;
        this.y = parentCell.y + (parentCell.r + this.initialOffset)*direction.signY*direction.scalarY;
        this.r = ejectedMass.radius;
        this.area = getArea(this.r);
        this.topSpeed = ejectedMass.speed;
        this.direction = direction;
        this.color = parentCell.color;
    }

    drawMe(){
        var relPosition = positionToRelative(this.x, this.y);
        var onScreen = relPosition.x>=-offScreenTolerance && relPosition.x<=canvas.width+offScreenTolerance &&
            relPosition.y>=-offScreenTolerance && relPosition.y<=canvas.height+offScreenTolerance;
        if (onScreen){
            // DRAWING A CIRCLE
            // start a path (custom drawing needed for circles)
            ctx.beginPath();
            // draw a cricle, or portion of it (x, y, radius, startAngle, endAngle)
            ctx.arc(relPosition.x, relPosition.y, this.r*board.scale, 0, 2*Math.PI);
            // fill the circle
            ctx.fillStyle = this.color;
            ctx.fill();
            // end the path
            ctx.closePath();
        }
    }

    dragMass(){        
        var x = this.x + (this.topSpeed)*this.direction.signX*this.direction.scalarX;
        var y = this.y + (this.topSpeed)*this.direction.signY*this.direction.scalarY;
        // enforce outer boundaries
        if (x>BOARD_SIZE.width){
            this.x = BOARD_SIZE.width;
        } else if (x<0){
            this.x = 0;
        } else {
            this.x = x;
        }
        if (y>BOARD_SIZE.height){
            this.y = BOARD_SIZE.height;
        } else if (y<0){
            this.y = 0;
        } else {
            this.y = y;
        }
        this.topSpeed *= 0.8;
    }
}

// CANVAS SETUP

var canvas = document.querySelector(".game-canvas");
var ctx = canvas.getContext("2d");
var offScreenTolerance = 40;

// PLAYERS' MOVEMENT
setMouseMoveListener();
var mouseX = 0;
var mouseY = 0;

function setMouseMoveListener(){
    window.onmousemove = mouseMove;
    setInterval(function(){
        if (!gamePaused){
            // move main player
            movePlayer(player);
            // move randomly each enemy
            enemyPlayers.forEach(function(enemy){
                moveOneEnemy(enemy);
            });
        }        
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
    var mouseOffsetX = Math.abs(player.screenX - mouseX);
    var mouseOffsetY = Math.abs(player.screenY - mouseY);

    if (mouseOffsetX>SPEED_PARAMS.moveTreshold){
        var speedRatioX = mouseSpeedProfile(mouseOffsetX, SPEED_PARAMS.moveTreshold, SPEED_PARAMS.moveTopSpeedTreshold);
        
        if (player.screenX > mouseX) {
            player.x = Math.max(player.x -= speedRatioX*player.topSpeed, 0);
        } else {
            player.x = Math.min(player.x += speedRatioX*player.topSpeed, board.sizeX);
        }    }
    if (mouseOffsetY>SPEED_PARAMS.moveTreshold){
        var speedRatioY = mouseSpeedProfile(mouseOffsetY, SPEED_PARAMS.moveTreshold, SPEED_PARAMS.moveTopSpeedTreshold);
        
        if (player.screenY > mouseY) {
            player.y = Math.max(player.y -= speedRatioY*player.topSpeed, 0);
        } else {
            player.y = Math.min(player.y += speedRatioY*player.topSpeed, board.sizeY);
        }
    }
}

function mouseSpeedProfile(distance, lowerTreshold, upperTreshold){
    return Math.min((distance/(upperTreshold - lowerTreshold))**2, 1);
}


// DEFINE CONSTANTS AND PARAMETERS

const BOARD_SIZE = {
    width: 4320,
    height: 2160,
};

const FOOD_COUNT = 800;

const TRAPS_COUNT = 10;

const SPEED_PARAMS = {
    maxSpeed: 30,
    minSpeed: 10,
    sizeForReduction: 30,
    reductionInverseSlope: 50,
    moveTreshold: 20,
    moveTopSpeedTreshold: 150,
}

const SCORE_MULTIPLIER = 10**-1;

var gamePaused = false;


// CREATE INSTANCES OF CLASSES

var board = new Board(BOARD_SIZE.width, BOARD_SIZE.height, "light");

var foodCells = generateFoodCells(FOOD_COUNT, board);

var traps = generateTraps(TRAPS_COUNT, board);

function generateFoodCells(numberOfCells, board){
    var arrayOfCells = [];
    for (var i=0; i<numberOfCells; i++){
        arrayOfCells.push(new FoodCell(board.sizeX, board.sizeY));
    }
    return arrayOfCells;
}

function generateTraps(numberOfTraps, board){
    var arrayOfTraps = [];
    for (var i=0; i<numberOfTraps; i++){
        arrayOfTraps.push(new Trap (board.sizeX, board.sizeY));
    }
    return arrayOfTraps;
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
var freeMassArray = [];
playerDB.forEach(function(enemyPlayer){
    spawnEnemy(enemyPlayer);
});
randomDirection(enemyPlayers);

// RUN FUNCTIONS

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
var leaderboardList = document.querySelector('.leaderboard-list');
var playButton = document.querySelector('#start-game');
var themeButton = document.querySelector('#night-theme');
var userInputName = document.querySelector('#player-name');
var mainScreen = document.querySelector('.main-screen');
var pauseScreen = document.querySelector('.main-pause');
var playerScoreDisplay = document.querySelector(".score-disp");

playButton.onclick = function (){
    startGame(userInputName);
};

themeButton.onclick = function (){
    board.theme = board.theme==="light" ? "night" : "light";
};

player = createPlayer("Player");
resizeCanvas();
animationLoop();

function startGame(userInputName){
    player.name = userInputName.value;
    spawnPlayer(player.name);
}

// DRAWING LOOP

function animationLoop(){
    requestAnimationFrame(function (){
        // set up a recursive loop (the drawingLoop function calls itself)
        animationLoop();
    });

    // Pause functionality
    if (gamePaused){
        return;
    }

    // --- Drawing elements ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // drawBoard();
    board.drawMe();

    foodCells.forEach(function(cell){
        cell.drawMe();
    });

    freeMassArray.forEach(function(mass){
        mass.drawMe();
    })
    
    // sort enemies from smallest to largest
    enemyPlayers.sort((playerOne, playerTwo) => playerOne.r - playerTwo.r);
    
    // update offscreen tolerance value for rendering
    offScreenTolerance = Math.ceil(enemyPlayers[enemyPlayers.length-1].r*board.scale);

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
        // player eats free mass
        freeMassArray = eatSomething(freeMassArray, player);
        // player eats enemies
        enemyPlayers = eatSomething(enemyPlayers, player);
        // player is eaten
        eatPlayer(player, enemyPlayers);

        // user triggers trap
        trapTrigger(player);

    } else {
        // draw only enemies
        enemyPlayers.forEach(enemy => enemy.drawMe());
    }

    // draw traps
    traps.forEach(function(trap){
        trap.drawMe();
    });

    // Enemy's behaviour
    // enemy eats food and mass
    enemyPlayers.forEach(function(enemy){
        foodCells = eatSomething(foodCells, enemy);
        freeMassArray = eatSomething(freeMassArray, enemy);
    });
    // enemy eats enemy
    enemyPlayers.forEach(function(enemy){
        enemyPlayers = eatSomething(enemyPlayers, enemy);
    });

    // enemy triggers trap
    enemyPlayers.forEach(function(oneEnemy){
        trapTrigger(oneEnemy);
    });
    
    // no more enemies
    if (enemyPlayers.length===0){
        player.playerInGame = false;
    }

    // Replenish food stock
    if (foodCells.length<=0.7*FOOD_COUNT){
        foodCells = foodCells.concat(generateFoodCells(FOOD_COUNT-foodCells.length, board));
    }

    freeMassArray.forEach(function(oneMass){
        oneMass.dragMass();
    })
}


// --- GAME LOGIC ---

function createPlayer(playerName){
    var randX = Math.floor(Math.random()*board.sizeX);
    var randY = Math.floor(Math.random()*board.sizeY);
    player = new Player(playerName, randX, randY, 60);
    player.playerInGame = false;
    return player;
}

function spawnPlayer(userInputName){
    if (player.r === 0){
        createPlayer(userInputName)
    }
    player.updatePlayerPosition(canvas.width, canvas.height);
    player.playerInGame = true;
    mainScreen.style.display = "none";
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
        if (prey.name==="mass"&&detectOverlapping(prey, predator, -1)) {
            updateAfterLunch(prey, predator);            
            preyArray.splice(index, 1);
            return;
        }   
        if (prey.r >= predator.r){
            return;
        }
        if (prey.name === predator.name){
            return;
        }
        if (detectOverlapping(prey, predator, 0)
        && sizeTolerance(prey, predator)) {
            updateAfterLunch(prey, predator);            
            preyArray.splice(index, 1);
            if (prey.name !== 'food'){
                deadEnemies.push(playerDB.find(player => player.name===prey.name));                
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
        if (detectOverlapping(prey, predator, 0)
        && sizeTolerance(prey, predator)) {
            updateAfterLunch(prey, predator);
            gameOver();
        }        
    });
}

function gameOver(){
    player.playerInGame = false;
    player.r = 0;
    player.score = 0;
    mainScreen.style.display = "flex";
}

function updateAfterLunch(prey, predator){
    predator.area += prey.area;
    predator.r = getRadius(predator.area);
    updateStats(predator);
}

function updateStats(someone){
    someone.score = Math.floor(someone.area*SCORE_MULTIPLIER);
    calculateSpeed(someone);
}

function calculateSpeed(someone){
    var params = SPEED_PARAMS;
    someone.topSpeed = (params.maxSpeed - params.minSpeed)
        * Math.exp(-(someone.r - params.sizeForReduction)/params.reductionInverseSlope)
        + params.minSpeed;
}


// PLAYER AI
setInterval("randomDirection(enemyPlayers)",4000);
setInterval("respawnEnemies()",5000);

function randomDirection(enemyArray){
    if (!gamePaused){
        enemyArray.forEach(function(onePlayer){
            moveRandom(onePlayer);
        });
    }
}

function moveRandom(onePlayer){
    onePlayer.deltaX = Math.floor(Math.random()*201) - 100;
    onePlayer.deltaY = Math.floor(Math.random()*201) - 100;
}

function moveOneEnemy(oneEnemy){
    if (Math.abs(oneEnemy.deltaX)>SPEED_PARAMS.moveTreshold){
        if (oneEnemy.deltaX < 0) {
            oneEnemy.x = Math.max(oneEnemy.x -= oneEnemy.topSpeed, 0);
        } else {
            oneEnemy.x = Math.min(oneEnemy.x += oneEnemy.topSpeed, board.sizeX);
        }    }
    if (Math.abs(oneEnemy.deltaY)>SPEED_PARAMS.moveTreshold){
        if (oneEnemy.deltaY < 0) {
            oneEnemy.y = Math.max(oneEnemy.y -= oneEnemy.topSpeed, 0);
        } else {
            oneEnemy.y = Math.min(oneEnemy.y += oneEnemy.topSpeed, board.sizeY);
        }
    }
}

function respawnEnemies(){
    if (!gamePaused){
        enemiesToSpwan = deadEnemies;
        deadEnemies = [];
        enemiesToSpwan.forEach(enemy => spawnEnemy(enemy));
    }
}


// OTHER FUNCTIONALITIES

function positionToRelative(absX, absY){
    return {
        x: board.scale * absX - board.scale * player.x + (canvas.width)/2,
        y: board.scale * absY - board.scale * player.y + (canvas.height)/2
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
}

function sizeTolerance(cellOne, cellTwo){
    var areas = [cellOne.area, cellTwo.area];
    var majorArea = Math.max(...areas);
    var minorArea = Math.min(...areas);
    return (majorArea-minorArea)/majorArea > 0.05;
}


// RESIZE WINDOW EVENT LISTENER

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    player.updatePlayerPosition(canvas.width, canvas.height);
}

// UI

var uiHud = document.querySelectorAll('.hud');
var leaderboardList = document.querySelector('.leaderboard-list');

function listLeaderboard(playersList, player, numberListed){
    if (player.playerInGame){
        playersList = playersList.concat(player);
    }
    // sort in descending order
    leaderboardList.innerHTML = 
    playersList.sort((playerOne, playerTwo) => 
    (playerTwo.score - playerOne.score !== 0) ? playerTwo.score - playerOne.score : playerOne.name - playerOne.name)
    .slice(0,numberListed)
    .reduce(function(htmlList, player){
        return htmlList + '<div class="disp-leader" ><li><strong>' + player.name + '</strong></li><span>' + 
        player.score + '</span></div>';
    }, "");
}

function updatePlayerScoreDisplay(){
    playerScoreDisplay.innerHTML = player.playerInGame ? player.score : "";
}

// update leaderboard
listLeaderboard(enemyPlayers, player, 20);
setInterval("listLeaderboard(enemyPlayers, player, 20)",1000);
setInterval("updatePlayerScoreDisplay()",1000);

// KEY PRESSES EVENT LISTENER
// keydown event handler (when user presses down on any key)

document.onkeydown = function(event){
    // In pause controls
    if (gamePaused){
        switch (event.keyCode) {
            case 27: // escape key
                gamePaused = !gamePaused;
                pauseScreen.style.display = "none";
                break;
        }
        return
    }

    switch (event.keyCode) {
        case 49: // 1 key - zoom out  
            zoomOut();
            break;
        case 50: // 2 key - zoom in
            zoomIn();
            break;
        case 51: // 3 key
            board.scale = 1;
            break;
        case 85: // U key
            uiHud.forEach(uiItem => uiItem.style.display = (uiItem.style.display === 'none') ? '' : 'none');
            break;
        case 84: // T key
            board.theme = board.theme==="light" ? "night" : "light";
            break;
        case 32: // space bar
            ejectMass(player, 20, 60, "user");
            break;
        case 27: // escape key
            gamePaused = !gamePaused;
            pauseScreen.style.display = "flex";
            break;
    }

    // only out of game commands
    if(player.playerInGame){
        return
    }
    switch (event.keyCode) {
        case 13: // return key
            startGame(userInputName);
            break;
    }
};

function zoomIn(){
    board.scale = Math.min(board.scale += 0.1, 4);
}

function zoomOut(){
    board.scale = Math.max(board.scale -= 0.1, 0.1);
}

// MouseEvent.wheel

window.addEventListener("mousewheel", MouseWheelHandler, false);
function MouseWheelHandler(event) {
    if (!gamePaused){
        event.wheelDelta>0 ? zoomIn() : zoomOut();
    }
}


// TESTING
function ejectMass(cell, radius, speed, trigger){
    if (trigger==='user' && cell.r > 40){
        var ejectedMass = {
            radius: radius,
            speed: speed,
        }
        cell.area -= getArea(ejectedMass.radius);
        cell.r = getRadius(cell.area);
        var directionVector = getDirectionCoeff("user");
        freeMassArray.push(new FreeMass(cell, ejectedMass, directionVector));
    } else if(trigger==='trap' && cell.r > 20){ // trap triggers ejection of mass
        var ejectedMass = {
            radius: radius,
            speed: speed,
        }
        cell.area -= getArea(ejectedMass.radius);
        cell.r = getRadius(cell.area);
        var directionVector = getDirectionCoeff("random");
        freeMassArray.push(new FreeMass(cell, ejectedMass, directionVector));
    }
}


function getDirectionCoeff(input){
    if (input==="user"){
        var offX = mouseX - player.screenX;
        var offY = mouseY - player.screenY;
    } else {
        var offX = Math.floor(Math.random()*201) - 100;
        var offY = Math.floor(Math.random()*201) - 100;
    }    
    var ratioYX = Math.abs(offY/offX);
    return {
        ratioYX: Math.abs(offY/offX),
        signX: offX/Math.abs(offX),
        scalarX : 1/Math.sqrt(1+ratioYX**2),
        signY: offY/Math.abs(offY),
        scalarY: 1/Math.sqrt(1+ratioYX**2)*ratioYX,
    }
}

function trapTrigger(prey){
    traps.forEach(function(trap){
        if (prey.r > 50 && detectOverlapping(prey, trap, -1)){
            var bitsRadius = 20;
            var oneBit = {
                radius: bitsRadius,
                area: getArea(bitsRadius),
            }
            var numberOfBits = Math.floor(prey.area/oneBit.area) - 1;
            // prey.area -= numberOfBits*oneBit.area;
            for (var i = numberOfBits; i>0; i--){
                ejectMass(prey, oneBit.radius, 50, "trap");
            }            
        }
    });
}