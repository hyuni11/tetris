import Blocks from "./blocks.js";

const playBoard = document.querySelector('.board > ul');
const scoreDisplay = document.querySelector('.score');
const gameoverText = document.querySelector('.gameover');
const restart = document.querySelector('.gameover > button');

const gameRow = 20;
const gameCols = 10;

let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const movingItem = {
    type: '',
    direction: 0,
    top: 0,
    left: 3
};

init();

function init() {
    tempMovingItem = { ...movingItem };

    for (var i = 0; i < gameRow; i++) {
        prependBox();
    }
    makeNewBlock();
}

function prependBox() {
    const li = document.createElement('li');
    const ul = document.createElement('ul');
    for (var j = 0; j < gameCols; j++) {
        const matrix = document.createElement('li');
        ul.prepend(matrix)
    }
    li.prepend(ul);
    playBoard.prepend(li);
}

function renderBlocks(moveType = '') {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll('.moving');

    movingBlocks.forEach(moving => {
        moving.classList.remove(type, 'moving');
    })
    Blocks[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playBoard.childNodes[y] ? playBoard.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, 'moving');
        } else {
            tempMovingItem = { ...movingItem };
            if(moveType === 'retry'){
                clearInterval(downInterval);
                gameover();
            }
            setTimeout(() => {
                renderBlocks('retry');
                if (moveType === 'top') {
                    seizeBlock();
                }
            }, 0)
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function seizeBlock() {
    const movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        moving.classList.remove('moving');
        moving.classList.add('seized');
    })
    checkMatch();
}
function checkMatch(){
    
    const childNodes = playBoard.childNodes;
    childNodes.forEach(child =>{
        let matched =true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains('seized')){
                matched = false;
            }
        })
        if(matched){
            child.remove();
            prependBox();
            score++;
            scoreDisplay.innerText = score*100;
        }
    })

    makeNewBlock();
}
function makeNewBlock(){

    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top',1)
    },duration)

    const blockArray = Object.entries(Blocks);
    const randomIndex = Math.floor(Math.random()*7);
    
    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction =0;
    tempMovingItem = {...movingItem};
    renderBlocks();
}
function checkEmpty(target) {
    if (!target || target.classList.contains('seized')) {
        return false;
    }
    return true;
}
function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}
function chasngeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}
function gameover(){
    gameoverText.style.display = 'flex';
}

document.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 39:
            moveBlock('left', 1);
            break;
        case 37:
            moveBlock('left', -1);
            break;
        case 40:
            moveBlock('top', 1);
            break;
        case 38:
            chasngeDirection()
            break;
        default:
            break;

    }
})
restart.addEventListener('click',()=>{
    playBoard.innerHTML = '';
    gameoverText.style.display = 'none';
    init();
})