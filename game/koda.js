var level = 0;

var gameRoomCanvas = document.getElementById("gameRoom");
var ctx0 = gameRoomCanvas.getContext("2d");

gameRoomCanvas.width = 500;
gameRoomCanvas.height = 500;

ctx0.fillStyle = "rgb(100, 230, 230)";
ctx0.fillRect(0, 0, 500, 500);

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

var manPixX;
var manPixY;

var manArrayX = 0;
var manArrayY = 0;

var sortArray1 = 0;
var sortArray2 = 0;
var array1 = [];
var array2 = [];

var bool = false;

//get starting map
$.get("./levels/levels.txt", function(levels) {
    for (var i in levels) {
        //ARRAYS
        //COULD BE A PROBLEM "EOF"
        if (levels[i] === "\n") {
            array1[sortArray1] = array2;
            sortArray1++;
            array2 = [];
            sortArray2 = 0;
        } else {
            array2[sortArray2] = levels[i];
            sortArray2++;
        }
    }
    draw(array1);
});

function draw(mapArray) {
    for (var i in mapArray) {
        for (var j in mapArray[i]) {
            if (mapArray[i][j] === "#") {
                //zid
                ctx0.drawImage(wallBlock, j*25, i*25);
                bool = true;
            } else if (mapArray[i][j] === ".") {
                //končno mesto
                ctx0.drawImage(endBlock, j*25, i*25);
            } else if (mapArray[i][j] === "$") {
                //škatla
                ctx0.drawImage(woodBlock, j*25, i*25);
            } else if (mapArray[i][j] === "*") {
                //success škatla
                ctx0.drawImage(successBlock, j*25, i*25);
            } else if (mapArray[i][j] === " " && bool) {
                //navadno
                ctx0.drawImage(normalBlock, j*25, i*25);
            } else if (mapArray[i][j] === "@") {
                //man
                ctx0.drawImage(manBlock, j*25, i*25);

                manPixX = j * 25;
                manPixY = i * 25;

                manArrayX = parseInt(j);
                manArrayY = parseInt(i);

            } else if (mapArray[i][j] === "\r") {
                bool = false;
            }
        }
    }
}

var previousBlock = " ";

function move(moveX, moveY) {

    var x = manArrayX + moveX;
    var y = manArrayY + moveY;

    var x2 = x + moveX;
    var y2 = y + moveY;

    if (array1[y][x] === "$" && array1[y2][x2] === " ") {
        // ŠKATLA: PRAZNEGA na PRAZNO MESTO
        array1[y][x] = " ";
        array1[y2][x2] = "$";

    } else if (array1[y][x] === "$" && array1[y2][x2] === ".") {
        // ŠKATLA: PRAZNEGA na KONČNO MESTO
        array1[y][x] = " ";
        array1[y2][x2] = "*";

    } else if (array1[y][x] === "*" && array1[y2][x2] === " ") {
        // ŠKATLA: KONČNEGA na PRAZNO MESTO
        array1[y][x] = ".";
        array1[y2][x2] = "$";

    } else if (array1[y][x] === "*" && array1[y2][x2] === ".") {
        // ŠKATLA: KONČNEGA na KONČNO MESTO
        array1[y][x] = ".";
        array1[y2][x2] = "*";

    } else {
        console.log("can't go there");
    }

    if (array1[y][x] === " " || array1[y][x] === ".") {
        array1[manArrayY][manArrayX] = previousBlock;
        previousBlock = array1[y][x];
        array1[y][x] = "@";
    }

    draw(array1);
}

function levelUp() {
    level++;
    $("#gameLevel").text("Level " + level);
}

window.addEventListener('keydown', function(event) {
    var key = event.keyCode;
    if (key === 38) {
        //up
        move(0, -1);
    } else if (key === 40) {
        //down
        move(0, 1);
    } else if(key === 37) {
        //left
        move(-1, 0);
    } else if (key === 39) {
        //right
        move(1, 0);
    }

}, false);

