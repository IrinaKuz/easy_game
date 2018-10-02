var myGameArea;
var myGamePiece;
var targets = [];
const numTargets = 10;
var myTime;
var myScore;

var marginTop = 50;
var mainDiv = document.getElementById('main');
var style = window.getComputedStyle(mainDiv);
var marginLeft = parseInt(style.getPropertyValue('margin-left'),10);

// gets x and y coordinates for window object
function getCoordinates(e) {
	e.preventDefault();
    myGamePiece.x = e.clientX - marginLeft;
    myGamePiece.y = e.clientY - marginTop;
}
// function checks if myGamePiece overlaps a target
function checkOverlap(target){
	if(myGamePiece.x > target.x - target.radius &&
       myGamePiece.x < target.x + target.radius &&
       myGamePiece.y > target.y - target.radius &&
       myGamePiece.y < target.y + target.radius) {
       	return true;
    }
}

// function iterates through targets array to check each target if it overlaps 
// with myGamePiece. If it does, the target is deleted from targets array
// If the last target is deleted from the array, the function calls 
// myGameArea.stop() function.
function checkTargets(e) {
	e.preventDefault();
    myGameArea.clicks++; // count on number of clicks the user does
    for (var i = 0; i < targets.length; i++) {
        if(checkOverlap(targets[i])){
        	targets.splice(i, 1);
            if(targets.length === 0) {
                myGameArea.stop();
                document.getElementById('restart').style.display = 'block';
                return;
            }
            return;
        }
    }
}
// function initializes myGameAre, myGamePiece, myTime, and myScore
function setup(){
	myGameArea = new gamearea();
	myGamePiece = new Component(15, "rgba(255,0,0,0.5)", 150, 150);
	myTime = new Score("20px Arial", "rgb(0,0,0)", 25, 25);
	myScore = new Score("20px Arial", "rgb(0,0,0)", 400, 25);
	myTime.text = "Time:";
	myScore.text = "Clicks:";
	myTime.update();
	myScore.update();	
}

function restartGame() {
    document.getElementById('restart').style.display = "none";
    myGameArea.stop();
    myGameArea.clear();
    myGameArea = {};
    myGamePiece = {};
    targets = [];
    // remove event listeners to avoid same multiple events for window
	window.removeEventListener('touchmove', getCoordinates);
	window.removeEventListener('touchstart', checkTargets);
    document.getElementById('canvasContainer').innerHTML = '';
 	setup();
    startGame();
}

function startGame() {
	document.getElementById('intro').style.display = "none";
    for (var i = 0; i < numTargets; i++) {
        myTarget = new Target(Math.floor(Math.random()*20 + 8), // radius 
                        "rgb(0, 0, 255)",   // color
                        Math.floor(Math.random()*500),  // x 
                        Math.floor(Math.random()*500),  // y 
                        Math.floor(Math.random()*6-3), // velX - should be negative # too
                        Math.floor(Math.random()*6-3)); // velY - should be negative # too
        targets.push(myTarget);
    }
    myGameArea.start();
}

function gamearea() {
    this.canvas = document.createElement("canvas"),
    this.canvas.width = 500;
    this.canvas.height = 500;

    this.context = this.canvas.getContext("2d");
    document.getElementById('canvasContainer').appendChild(this.canvas);
    this.frameNo = 0;
    this.clicks = 0;

    this.start = function() {
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('touchmove', getCoordinates);
        window.addEventListener('touchstart', checkTargets);
    },
    this.clear = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    this.stop = function() {
        clearInterval(this.interval);
    }
}

function Component(radius, color, x, y) {
    this.radius = radius;
    this.color = color;
    this.x = x;
    this.y = y;
}

Component.prototype.draw = function() {
	ctx = myGameArea.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.restore();
}

function Target(radius, color, x, y, velX, velY) {
    Component.call(this, radius, color, x, y);
    this.velX = velX;
    this.velY = velY;
}

Target.prototype.draw = function() {
    ctx = myGameArea.context;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fill();
}

Target.prototype.update = function() {
    if (this.x + this.radius > 500 && this.velX > 0 || 
    	this.x - this.radius < 0 && this.velX < 0) {
        this.velX = -(this.velX);
    }
    if (this.y + this.radius > 500 && this.velY > 0 ||
    	this.y - this.radius < 0 && this.velY < 0) {
        this.velY = -(this.velY);
    }
    this.x += this.velX;
    this.y += this.velY;
}
function Score (radius, color, x, y, text){
	Component.call(this, radius, color, x, y);
    this.text = text;
}
Score.prototype.update = function() {
    ctx = myGameArea.context;
    ctx.font = this.radius;
    ctx.color = this.color;
    ctx.fillText(this.text, this.x, this.y);
}
function updateGameArea() {
    myGameArea.clear();
    myGameArea.frameNo += 1;
    myTime.text = "Time: " + Math.floor(myGameArea.frameNo/50);
    myTime.update();
    myScore.text = "Clicks: " + myGameArea.clicks;
    myScore.update();
    if (myGameArea.x && myGameArea.y) {
        myGamePiece.x = myGameArea.x;
        myGamePiece.y = myGameArea.y;
    }
    myGamePiece.draw();
    for (var i = 0; i < targets.length; i++) {
        targets[i].update();
    }
    for (var i = 0; i < targets.length; i++) {
        targets[i].draw();
    }
}

setup();
