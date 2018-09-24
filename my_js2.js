var myGameArea;
var myGamePiece;
var targets = [];
const numTargets = 10;
var myTime;
var myScore;
var numTries = 0;

var marginTop = 50;
var mainDiv = document.getElementById('main');
var style = window.getComputedStyle(mainDiv);
var marginLeft = parseInt(style.getPropertyValue('margin-left'),10);

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
    document.getElementById('canvasContainer').innerHTML = '';
    setup();
    startGame();
}

function startGame() {
	document.getElementById('intro').style.display = "none";
    for (var i = 0; i < numTargets; i++) {
        myTarget = new Target(Math.random()*20 + 8, // radius
                        "rgb(0, 0, 255)",   // color
                        Math.random()*500,  // x
                        Math.random()*500,  // y
                        Math.random()*360,  // dir
                        Math.random()*2+1, // velX
                        Math.random()*2+1); // velY
        targets.push(myTarget);
    }
    myGameArea.start();
}

function gamearea() {
    this.canvas = document.createElement("canvas"),
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.canvas.style.border = '1px solid black';
    this.context = this.canvas.getContext("2d");
    document.getElementById('canvasContainer').appendChild(this.canvas);
    this.frameNo = 0;

    this.start = function() {
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousemove', function(e) {
            myGameArea.x = e.clientX - marginLeft;
            myGameArea.y = e.clientY - marginTop;
        });
        window.addEventListener('click', function(e) {
        	numTries++;
            for (var i = 0; i < targets.length; i++) {
                if(e.clientX - marginLeft> targets[i].x - targets[i].radius &&
                    e.clientX - marginLeft< targets[i].x + targets[i].radius &&
                    e.clientY - marginTop> targets[i].y - targets[i].radius &&
                    e.clientY - marginTop< targets[i].y + targets[i].radius) {
                    targets.splice(i, 1);
                    if(targets.length === 0) {
                        myGameArea.stop();
                        document.getElementById('restart').style.display = 'block';
                        return;
                    }
                    return;
                }
            }
        });
        window.addEventListener('mousemove', function(e) {
            for (var i = 0; i < targets.length; i++) {
                if(e.clientX > targets[i].x - targets[i].radius &&
                    e.clientX < targets[i].x + targets[i].radius &&
                    e.clientY > targets[i].y - targets[i].radius &&
                    e.clientY < targets[i].y + targets[i].radius) {
                    targets[i].color = '#696969';
                }
                else targets[i].color = "rgb(0, 0, 255)";
            }
        })
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
    ctx = myGameArea.context;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.restore();
}

function Target(radius, color, x, y, dir, velX, velY) {
    Component.call(this, radius, color, x, y);
    this.dir = dir;
    this.velX = velX;
    this.velY = velY;
}

Target.prototype.draw = function() {
    ctx = myGameArea.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((Math.PI / 180) * this.dir);
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.restore();
}

Target.prototype.update = function() {
    if (this.x + this.radius > 500) {
        this.velX = -(this.velX);
    }
    if (this.x - this.radius < 0) {
        this.velX = -(this.velX);
    }
    if (this.y + this.radius > 500) {
        this.velY = -(this.velY);
    }
    if (this.y - this.radius < 0) {
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
    myScore.text = "Clicks: " + (numTries);
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
