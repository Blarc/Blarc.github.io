var storage = firebase.storage();
var pathReference = storage.ref('/Sokoban');

var gameRoomCanvas;
var ctx0;

var allLevels = [];
var level = 0;
var moves = 0;

var manArrayX = 0;
var manArrayY = 0;
var mapArray = [];

var numMoves = 0;
var memory;

pathReference.child('/Levels/levels.txt').getDownloadURL().then(function(url) {
    var sortMapArray = 0;
    var sortArray2 = 0;
    var array2 = [];
    var currMapArray = [];
    $.get(url, function(levels) {
        var endNum = 0;
        var bigWidth = 0;
        var atmWidth = 0;
        var atmLevel = 0;
        for (var i = 0; i <= levels.length; i++) {
            if (levels[i] === "L") {
                // Level 1
                while (levels[i] !== '\n') {
                    i++;
                }
                i++;

                allLevels[atmLevel] = newMapArray(currMapArray, bigWidth-1, endNum, " ");
                currMapArray = [];
                sortMapArray = 0;

                atmWidth = 0;
                bigWidth = 0;
                endNum = 0;

                atmLevel++;
            }
            if (levels[i] === ";") {
                // komentar
                while (levels[i] !== '\n') {
                    i++;
                }
                i++;
            }
            if (levels[i] === "'") {
                // naslov
                while (levels[i] !== '\n') {
                    i++;
                }
                i++;
            }
            if (levels[i] === "*" || levels[i] === ".") {
                endNum++;
            }
            if (levels[i] === "\n") {
                currMapArray[sortMapArray] = array2;
                sortMapArray++;
                array2 = [];
                sortArray2 = 0;

                if (atmWidth > bigWidth) {
                    bigWidth = atmWidth;
                }
                atmWidth = 0;
            } else {
                array2[sortArray2] = levels[i];
                sortArray2++;
                atmWidth++;
            }
        }
        currMapArray[sortMapArray] = array2;
        allLevels[atmLevel] = newMapArray(currMapArray, bigWidth-1, endNum);

    });

});


var wallBlock = document.createElement("img");
wallBlock.src = "./img/lightGrayBlock.png";

var woodBlock = document.createElement("img");
woodBlock.src = "./img/woodBlock.png";

var manBlock = document.createElement("img");
manBlock.src = "./img/charSprite.png";

var endBlock = document.createElement("img");
endBlock.src = "./img/endBlock.png";

var normalBlock = document.createElement("img");
normalBlock.src = "./img/normalBlock.png";

var successBlock = document.createElement("img");
successBlock.src = "./img/successBlock.png";


function newMapArray(array, width, endNum, prevBlock) {
    return {
        array : array,
        width : width,
        endNum: endNum,
        prevBlock: prevBlock
    }
}

var bool = false;

function draw() {

    var cMap = mapArray.array;

    for (var i in cMap) {
        for (var j in cMap[i]) {
            if (cMap[i][j] === "#") {
                //zid
                ctx0.drawImage(wallBlock, j*25, i*25);
                bool = true;
            } else if (cMap[i][j] === ".") {
                //končno mesto
                ctx0.drawImage(endBlock, j*25, i*25);
            } else if (cMap[i][j] === "$") {
                //škatla
                ctx0.drawImage(woodBlock, j*25, i*25);
            } else if (cMap[i][j] === "*") {
                //success škatla
                ctx0.drawImage(successBlock, j*25, i*25);
            } else if (cMap[i][j] === " " && bool) {
                //navadno
                ctx0.drawImage(normalBlock, j*25, i*25);
            } else if (cMap[i][j] === "@") {
                //man
                ctx0.drawImage(manBlock, j*25, i*25);

                manArrayX = parseInt(j);
                manArrayY = parseInt(i);

            } else if (cMap[i][j] === "\r") {
                bool = false;
            }
        }
    }
    memory[numMoves] = JSON.parse(JSON.stringify(mapArray));
}

function move(moveX, moveY) {

    var cMap = mapArray.array;

    var x = manArrayX + moveX;
    var y = manArrayY + moveY;

    var x2 = x + moveX;
    var y2 = y + moveY;

    if (cMap[y][x] === "$" && cMap[y2][x2] === " ") {
        // ŠKATLA: PRAZNEGA na PRAZNO MESTO
        cMap[y][x] = " ";
        cMap[y2][x2] = "$";

    } else if (cMap[y][x] === "$" && cMap[y2][x2] === ".") {
        // ŠKATLA: PRAZNEGA na KONČNO MESTO
        cMap[y][x] = " ";
        cMap[y2][x2] = "*";

    } else if (cMap[y][x] === "*" && cMap[y2][x2] === " ") {
        // ŠKATLA: KONČNEGA na PRAZNO MESTO
        cMap[y][x] = ".";
        cMap[y2][x2] = "$";

    } else if (cMap[y][x] === "*" && cMap[y2][x2] === ".") {
        // ŠKATLA: KONČNEGA na KONČNO MESTO
        cMap[y][x] = ".";
        cMap[y2][x2] = "*";
    }

    if (cMap[y][x] === " " || cMap[y][x] === ".") {
        cMap[manArrayY][manArrayX] = mapArray.prevBlock;
        mapArray.prevBlock = cMap[y][x];
        cMap[y][x] = "@";
        numMoves++;
        moves++;
    }

    $("#numMoves").text("Moves: " + moves);
    draw();
    check();
}

function levelUp() {
    level++;
    moves = 0;
	memory = [];
    $("#numMoves").text("Moves: " + moves);
    $("#gameDone").text("");
    $("#gameLevel").text("Level " + level);
    mapArray = allLevels[level];

    var mapWidth = 25 * mapArray.width;
    var mapHeight = 25 * (mapArray.array.length);

    gameRoomCanvas = document.getElementById("gameRoom");
    ctx0 = gameRoomCanvas.getContext("2d");

    gameRoomCanvas.width = mapWidth;
    gameRoomCanvas.height = mapHeight;

    ctx0.fillStyle = "rgb(255, 255, 255)";
    ctx0.fillRect(0, 0, mapWidth, mapWidth);

    draw();
}

function undo() {
    if (numMoves > 0) {
        numMoves -= 1;
        mapArray = memory[numMoves];
        draw();
    }
}

function check() {
    var count = 0;
    var endNum = mapArray.endNum;
    for (var i in mapArray.array) {
        for (var j in mapArray.array[i]) {
            if (mapArray.array[i][j] === "*") {
                count++;
            }
        }
    }

    if (count === endNum) {
        $("#gameDone").text("Level completed!");
    }
}

window.addEventListener('keydown', function (event) {
    var key = event.keyCode;
    if (key === 38) {
        //up
        move(0, -1, mapArray);
    } else if (key === 40) {
        //down
        move(0, 1, mapArray);
    } else if (key === 37) {
        //left
        move(-1, 0, mapArray);
    } else if (key === 39) {
        //right
        move(1, 0, mapArray);
    }

}, false);


