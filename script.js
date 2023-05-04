const DIMENSIONS = 20;
const LIVES = 5;
const SPEED = 7;
const gameBg = document.querySelector(".game-bg");
gameBg.innerHTML = `<div class="snake"></div><div class="time2">00:00</div>`;
const snakeHead = document.querySelector(".snake");
const text = document.querySelector(".text");
const maxTime = 60;
let curTime = 0;
const time = document.querySelector(".time");
const time2 = document.querySelector(".time2");
time.textContent = `${String(Math.floor(maxTime / 60)).padStart(
  2,
  "0"
)}:${String(Math.floor(maxTime % 60)).padStart(2, "0")}`;
time2.textContent = `${String(Math.floor(maxTime / 60)).padStart(
  2,
  "0"
)}:${String(Math.floor(maxTime % 60)).padStart(2, "0")}`;
let started = false;
let score = 0;
let startTime;
let highScore = localStorage.getItem("highScore")
  ? localStorage.getItem("highScore")
  : 0;
let scoreEle = document.querySelector(".score-text-val");
let interval;
let highScoreEle = document.querySelector(".highscore-text-val");
scoreEle.textContent = score;
highScoreEle.textContent = highScore;
let wordCreated = false;
let currentWord;
let index = 0;
let speed = SPEED;
const wordList = [
  "red",
  "snake",
  "ball",
  "pitch",
  "word",
  "game",
  "apple",
  "garden",
];
let letters = [];
let height = gameBg.getBoundingClientRect().height;
let pixelSize = gameBg.getBoundingClientRect().height / DIMENSIONS;
let snake = [snakeHead];
snakeHead.style.height = `${pixelSize}px`;
snakeHead.style.width = `${pixelSize}px`;
let curPosX = Math.floor(Math.random() * DIMENSIONS);
let curPosY = Math.floor(Math.random() * DIMENSIONS);
snakeHead.style.top = `${curPosY * pixelSize}px`;
snakeHead.style.left = `${curPosX * pixelSize}px`;

curPosX = Math.floor(Math.random() * DIMENSIONS);
curPosY = Math.floor(Math.random() * DIMENSIONS);

function elementsOverlap(el1, el2) {
  const domRect1 = el1.getBoundingClientRect();
  const domRect2 = el2.getBoundingClientRect();
  let game = gameBg.getBoundingClientRect();
  let bx = Math.floor((domRect1.left - game.left + 1) / pixelSize);
  let by = Math.floor((domRect1.top - game.top + 1) / pixelSize);
  let sx = Math.floor((domRect2.left - game.left + 1) / pixelSize);
  let sy = Math.floor((domRect2.top - game.top + 1) / pixelSize);
  return bx == sx && by == sy;
}

let dirX = 0;
let dirY = 0;
let moved = false;

window.addEventListener("keypress", (e) => {
  if (!started) {
    startTime = Date.now();
    interval = setInterval(() => {
      curTime = Math.floor((Date.now() - startTime) / 1000);
      if (curTime % 5 == 0) {
        speed += 1;
      }
      time.textContent = `${String(
        Math.floor((maxTime - curTime) / 60)
      ).padStart(2, "0")}:${String(
        Math.floor((maxTime - curTime) % 60)
      ).padStart(2, "0")}`;
      time2.textContent = `${String(
        Math.floor((maxTime - curTime) / 60)
      ).padStart(2, "0")}:${String(
        Math.floor((maxTime - curTime) % 60)
      ).padStart(2, "0")}`;
    }, 1000);

    started = true;
  }
  if (e.key == "w" && dirY != -1 && moved) {
    moved = false;
    dirX = 0;
    dirY = 1;
  } else if (e.key == "a" && dirX != 1 && moved) {
    moved = false;
    dirX = -1;
    dirY = 0;
  } else if (e.key == "s" && dirY != 1 && moved) {
    moved = false;
    dirX = 0;
    dirY = -1;
  } else if (e.key == "d" && dirX != -1 && moved) {
    moved = false;
    dirX = 1;
    dirY = 0;
  }
});

document.querySelector(".top").addEventListener("click", (e) => {
  if (!started) {
    startTime = Date.now();
    interval = setInterval(() => {
      curTime = Math.floor((Date.now() - startTime) / 1000);
      if (curTime % 5 == 0) {
        speed += 1;
      }
      time.textContent = `${String(
        Math.floor((maxTime - curTime) / 60)
      ).padStart(2, "0")}:${String(
        Math.floor((maxTime - curTime) % 60)
      ).padStart(2, "0")}`;
      time2.textContent = `${String(
        Math.floor((maxTime - curTime) / 60)
      ).padStart(2, "0")}:${String(
        Math.floor((maxTime - curTime) % 60)
      ).padStart(2, "0")}`;
    }, 1000);
    started = true;
  }
  if (dirY != -1 && moved) {
    moved = false;
    dirX = 0;
    dirY = 1;
  }
});
document.querySelector(".left").addEventListener("click", (e) => {
  if (!started) {
    startTime = Date.now();
    interval = setInterval(() => {
      curTime = Math.floor((Date.now() - startTime) / 1000);
      if (curTime % 5 == 0) {
        speed += 1;
      }
      time.textContent = `${String(
        Math.floor((maxTime - curTime) / 60)
      ).padStart(2, "0")}:${String(
        Math.floor((maxTime - curTime) % 60)
      ).padStart(2, "0")}`;
      time2.textContent = `${String(
        Math.floor((maxTime - curTime) / 60)
      ).padStart(2, "0")}:${String(
        Math.floor((maxTime - curTime) % 60)
      ).padStart(2, "0")}`;
    }, 1000);
    started = true;
  }
  if (dirX != 1 && moved) {
    moved = false;
    dirX = -1;
    dirY = 0;
  }
});
document.querySelector(".right").addEventListener("click", (e) => {
  if (!started) {
    startTime = Date.now();
    interval = setInterval(() => {
      curTime = Math.floor((Date.now() - startTime) / 1000);
      if (curTime % 5 == 0) {
        speed += 1;
      }
      time.textContent = `${String(
        Math.floor((maxTime - curTime) / 60)
      ).padStart(2, "0")}:${String(
        Math.floor((maxTime - curTime) % 60)
      ).padStart(2, "0")}`;
      time2.textContent = `${String(
        Math.floor((maxTime - curTime) / 60)
      ).padStart(2, "0")}:${String(
        Math.floor((maxTime - curTime) % 60)
      ).padStart(2, "0")}`;
    }, 1000);
    started = true;
  }
  if (dirX != -1 && moved) {
    moved = false;
    dirX = 1;
    dirY = 0;
  }
});
document.querySelector(".bottom").addEventListener("click", (e) => {
  if (!started) {
    startTime = Date.now();
    interval = setInterval(() => {
      curTime = Math.floor((Date.now() - startTime) / 1000);
      if (curTime % 5 == 0) {
        speed += 1;
      }
      time.textContent = `${String(
        Math.floor((maxTime - curTime) / 60)
      ).padStart(2, "0")}:${String(
        Math.floor((maxTime - curTime) % 60)
      ).padStart(2, "0")}`;
      time2.textContent = `${String(
        Math.floor((maxTime - curTime) / 60)
      ).padStart(2, "0")}:${String(
        Math.floor((maxTime - curTime) % 60)
      ).padStart(2, "0")}`;
    }, 1000);
    started = true;
  }
  if (dirY != 1 && moved) {
    moved = false;
    dirX = 0;
    dirY = -1;
  }
});

function createWord(word) {
  wordCreated = true;
  let lst = [];
  for (let i = 0; i < word.length; i++) {
    const ele = document.createElement("div");
    ele.classList.add("word");
    ele.textContent = word[i];
    let X = Math.floor(Math.random() * DIMENSIONS);
    let Y = Math.floor(Math.random() * DIMENSIONS);
    while (lst.includes(`${X},${Y}`)) {
      X = Math.floor(Math.random() * DIMENSIONS);
      Y = Math.floor(Math.random() * DIMENSIONS);
    }
    lst.push(`${X},${Y}`);
    ele.style.height = `${pixelSize}px`;
    ele.style.width = `${pixelSize}px`;
    // ele.style.fontSize = `${(16 / 40) * DIMENSIONS}px`;
    if (DIMENSIONS == 40) {
      ele.style.fontSize = `16px`;
    } else if (DIMENSIONS == 20) {
      ele.style.fontSize = `20px`;
    } else if (DIMENSIONS == 30) {
      ele.style.fontSize = `18px`;
    }
    ele.style.left = `${X * pixelSize}px`;
    ele.style.top = `${Y * pixelSize}px`;
    letters.push(ele);
    gameBg.append(ele);
  }
}

function increaseSnakeSize(n = 1) {
  for (let i = 0; i < n; i++) {
    const body = document.createElement("div");
    body.style.width = `${pixelSize}px`;
    body.style.height = `${pixelSize}px`;
    body.style.top = `${parseInt(snake[snake.length - 1].style.top)}px`;
    body.style.left = `${parseInt(snake[snake.length - 1].style.left)}px`;
    body.classList.add("snake-body");
    snake.push(body);
    gameBg.append(body);
  }
}

function createFood() {
  curPosX = Math.floor(Math.random() * DIMENSIONS);
  curPosY = Math.floor(Math.random() * DIMENSIONS);
  food.style.top = `${curPosY * pixelSize}px`;
  food.style.left = `${curPosX * pixelSize}px`;
  for (let i = 0; i < snake.length; i++) {
    if (elementsOverlap(snake[i], food)) {
      return createFood();
    }
  }
  food.style.top = `${curPosY * pixelSize}px`;
  food.style.left = `${curPosX * pixelSize}px`;
}

function CheckGameOver() {
  let top = parseInt(snakeHead.style.top);
  let left = parseInt(snakeHead.style.left);
  if (top < 0) {
    snakeHead.style.top = 0;
    return true;
  } else if (top > height - height / DIMENSIONS) {
    snakeHead.style.top = `${height - height / DIMENSIONS}px`;
    return true;
  }
  if (left < 0) {
    snakeHead.style.left = 0;
    return true;
  } else if (left > height - height / DIMENSIONS) {
    snakeHead.style.left = `${height - height / DIMENSIONS}px`;
    return true;
  }
  if (curTime >= maxTime) return true;
  let game = gameBg.getBoundingClientRect();
  let snakeHeadRect = snake[0].getBoundingClientRect();
  for (let i = 3; i < snake.length; i++) {
    let bx = Math.floor(
      (snake[i].getBoundingClientRect().left - game.left + 1) / pixelSize
    );
    let by = Math.floor(
      (snake[i].getBoundingClientRect().top - game.top + 1) / pixelSize
    );
    let sx = Math.floor((snakeHeadRect.left - game.left + 1) / pixelSize);
    let sy = Math.floor((snakeHeadRect.top - game.top + 1) / pixelSize);
    if (sx == bx && sy == by) return true;
  }
  return false;
}

function gameLoop() {
  // if (elementsOverlap(snakeHead, food)) {
  //   createFood();
  //   const body = document.createElement("div");
  //   body.style.width = `${pixelSize}px`;
  //   body.style.height = `${pixelSize}px`;
  //   body.classList.add("snake-body");
  //   snake.push(body);
  //   gameBg.append(body);
  // }
  if (maxTime - curTime <= 15) {
    time.style.color = `#f40009`;
    time2.style.color = `#f40009`;
  } else {
    time.style.color = `white`;
    time2.style.color = `white`;
  }
  if (!wordCreated) {
    let word = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    index = 0;
    text.innerHTML = currentWord.toUpperCase();
    createWord(word.toUpperCase());
  } else {
    for (let i = 0; i < letters.length; i++) {
      if (elementsOverlap(letters[i], snakeHead)) {
        console.log(currentWord);
        if (letters[i].textContent == currentWord[index].toUpperCase()) {
          letters[i].parentNode.removeChild(letters[i]);
          text.innerHTML = `<span class="colorTextGreen">${currentWord
            .toUpperCase()
            .slice(0, index + 1)}</span>${currentWord
            .toUpperCase()
            .slice(index + 1, currentWord.length)}`;
          letters.splice(i, 1);
          score += 10;
          increaseSnakeSize();
          index++;
        } else {
          text.innerHTML = `<span class="colorTextGreen">${currentWord
            .toUpperCase()
            .slice(0, index)}</span><span class="colorTextRed">${currentWord
            .toUpperCase()
            .slice(index, index + 1)}</span>${currentWord
            .toUpperCase()
            .slice(index + 1, currentWord.length)}`;
          increaseSnakeSize(2);
          startTime -= 3000;
          score -= 5;
        }
        scoreEle.textContent = score;
      }
    }
  }
  if (letters.length == 0) {
    wordCreated = false;
    let word = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    startTime += 15000;
    text.innerHTML = currentWord.toUpperCase();
    index = 0;
    createWord(word.toUpperCase());
  }
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].style.top = `${parseInt(snake[i - 1].style.top)}px`;
    snake[i].style.left = `${parseInt(snake[i - 1].style.left)}px`;
  }
  snakeHead.style.top = `${
    parseInt(snakeHead.style.top) + 1 * pixelSize * dirY * -1
  }px`;
  snakeHead.style.left = `${
    parseInt(snakeHead.style.left) + 1 * pixelSize * dirX
  }px`;
  moved = true;

  if (CheckGameOver()) {
    if (score > highScore) {
      highScore = score;
      highScoreEle.textContent = highScore;
      localStorage.setItem("highScore", highScore);
    }
    startTime = 0;
    // started = false;
    time.textContent = `00:00`;
    time2.textContent = `00:00`;

    clearInterval(interval);
    return;
  }
  setTimeout(() => window.requestAnimationFrame(gameLoop), 1000 / speed);
}

window.onresize = () => {
  pixelSize = gameBg.getBoundingClientRect().height / DIMENSIONS;
  for (let i = 0; i < snake.length; i++) {
    snake[i].style.height = `${pixelSize}px`;
    snake[i].style.width = `${pixelSize}px`;
  }
  height = gameBg.getBoundingClientRect().height;
  for (let i = 0; i < letters.length; i++) {
    letters[i].style.height = `${pixelSize}px`;
    letters[i].style.width = `${pixelSize}px`;
  }
  //   snakeHead.style.top = `${curPosY * pixelSize}px`;
  //   snakeHead.style.left = `${curPosX * pixelSize}px`;
};

gameLoop();
