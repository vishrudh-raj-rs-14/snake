let DIMENSIONS = 30;
const LIVES = 3;
const SPEED = 7;
const gameBg = document.querySelector(".game-bg");
const go = document.querySelector(".go");
gameBg.innerHTML = `<div class="snake"></div><div class="time2">00:00</div>`;
const setting = document.querySelector(".menu");
const menu = document.querySelector(".settings-modal");
let snakeHead = document.querySelector(".snake");
let soundEffect = document.querySelector(".soundEffect");
let muteMusic = document.querySelector(".music");
const text = document.querySelector(".textContent");
const ball = document.querySelector("#joystick-head");
console.log(ball);
let clickedEle;
let oldPos;
const maxTime = 60;
let lives = LIVES;
let delayed = true;
let eat = new Audio("./assets/eat.mp3");
let power = new Audio("./assets/power.mp3");
let goAudio = new Audio("./assets/go.mp3");
let gameBgm = new Audio("./assets/bgm.mp3");
gameBgm.loop = true;
let click = new Audio("./assets/click.mp3");
let hiss = new Audio("./assets/hiss.mp3");
let curTime = 0;
let paused = false;
let waitingToRestart = false;
const time = document.querySelector(".time");
let time2 = document.querySelector(".time2");
const heart = document.querySelector(".heart");
let powers = [];
for (let i = 0; i < lives; i++) {
  let heartC = document.createElement("div");
  heartC.classList.add("heartContent");
  heartC.innerHTML = `<img src="./assets/heart.png">`;
  heart.append(heartC);
}
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
  "knight",
  "king",
  "delta",
  "cyber",
  "security",
  "pragyan",
];
const powerUp = [
  {
    name: "speedDecrease",
    color: "#32de84",
    do: () => {
      if (DIMENSIONS == 20) speed -= 1;
      else speed -= 1;
    },
    img: "./assets/turtle.png",
  },
  {
    name: "lengthDec",
    color: "#318CE7",
    do: () => {
      if (snake.length <= 2) return;
      for (let i = 0; i < 2; i++) {
        let body = snake.pop();
        body.parentNode.removeChild(body);
      }
    },
    img: "./assets/snake.png",
  },
  {
    name: "increaseTime",
    color: "#FEBE10",
    do: () => {
      curTime -= 10;
    },
    img: "./assets/clock.png",
  },
  {
    name: "increaseSpeed",
    color: "#FF033E",
    do: () => {
      speed += 2;
    },
    img: "./assets/lightning.png",
  },
];

soundEffect.addEventListener("click", () => {
  if (soundEffect.classList.contains("after-class")) {
    hiss.volume = 1;
    eat.volume = 1;
    click.volume = 1;
    powerUp.volume = 1;
    soundEffect.classList.remove("after-class");
  } else {
    hiss.volume = 0;
    eat.volume = 0;
    click.volume = 0;
    powerUp.volume = 0;
    soundEffect.classList.add("after-class");
  }
});

muteMusic.addEventListener("click", () => {
  if (muteMusic.classList.contains("after-class")) {
    gameBgm.volume = 0.18;
    muteMusic.classList.remove("after-class");
  } else {
    gameBgm.volume = 0;
    muteMusic.classList.add("after-class");
  }
});

let letters = [];
let height = gameBg.getBoundingClientRect().height;
let pixelSize = gameBg.getBoundingClientRect().height / DIMENSIONS;
let snake = [snakeHead];
const resume = document.querySelector("#resume");
const restart = document.querySelector("#restart");
snakeHead.style.height = `${pixelSize}px`;
snakeHead.style.width = `${pixelSize}px`;
let curPosX = Math.floor(Math.random() * DIMENSIONS);
let curPosY = Math.floor(Math.random() * DIMENSIONS);
snakeHead.style.top = `${curPosY * pixelSize}px`;
snakeHead.style.left = `${curPosX * pixelSize}px`;

let optionSelect = Array.from(document.querySelectorAll(".option-type"));
optionSelect.forEach((ele) => {
  if (ele.dataset.val == DIMENSIONS) {
    ele.classList.add("selected");
  } else {
    ele.classList.remove("selected");
  }
  ele.addEventListener("click", (e) => {
    click.play();
    optionSelect.forEach((ele) => {
      ele.classList.remove("selected");
    });
    e.target.classList.add("selected");
    if (parseInt(ele.dataset.val) != DIMENSIONS) {
      resume.classList.add("disabled");
    }
    DIMENSIONS = parseInt(ele.dataset.val);
  });
});

setting.addEventListener("click", (e) => {
  click.play();
  gameBgm.pause();
  let gear = setting.querySelector("img");
  paused = true;
  gear.classList.add("onclick");
  menu.classList.remove("hide");
});

document.querySelector(".arrows").addEventListener("touchstart", (e) => {
  clickedEle = ball;
  oldPos = ball.getBoundingClientRect();
  if (clickedEle) {
    let evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    let touch = evt.touches[0] || evt.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;
    console.log(x, y);
    [x, y] = [
      x - oldPos.x - oldPos.width / 2,
      y - oldPos.y - oldPos.height / 2,
    ];
    let r = parseInt(
      parseInt(
        document.querySelector("#joystick").getBoundingClientRect().width
      ) / 2
    );
    let newX, newY;
    let theta = Math.atan(Math.abs(y / x));
    if (Math.sqrt(x ** 2 + y ** 2) <= r) {
      newX = x;
      newY = y;
    } else {
      newY = r * Math.sign(y) * Math.sin(theta);
      newX = r * Math.sign(x) * Math.cos(theta);
    }
    clickedEle.style.transform = `translate(${newX}px,${newY}px)`;
    if (!paused && (x != 0 || y != 0)) {
      if (!started && delayed) {
        //   gameBgm.loop = true;
        gameBgm.volume = 0.18;
        gameBgm.play();
        curTime = 0;
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
          if (!paused) {
            curTime += 1;
          }
          if (curTime % 5 == 0 && !paused) {
            speed += DIMENSIONS == 30 ? 0.5 : 1;
          }
          if (curTime % 15 == 0 && !paused) {
            createPower();
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
      }
      if (e.key == "r" && waitingToRestart) {
        waitingToRestart = false;
        curTime = 0;
        reset(true);
        gameLoop();
      }
      if (theta >= Math.PI / 4 && newY < 0 && dirY != -1 && moved && delayed) {
        moved = false;
        started = true;
        dirX = 0;
        dirY = 1;
      } else if (
        theta <= Math.PI / 4 &&
        newX < 0 &&
        dirX != 1 &&
        moved &&
        delayed
      ) {
        moved = false;
        started = true;
        dirX = -1;
        dirY = 0;
      } else if (
        theta >= Math.PI / 4 &&
        newY > 0 &&
        dirY != 1 &&
        moved &&
        delayed
      ) {
        moved = false;
        started = true;
        dirX = 0;
        dirY = -1;
      } else if (
        theta <= Math.PI / 4 &&
        newX > 0 &&
        dirX != -1 &&
        moved &&
        delayed
      ) {
        moved = false;
        started = true;
        dirX = 1;
        dirY = 0;
      }
    }
  }
  //   ball.transform
});

window.addEventListener("touchmove", (e) => {
  if (clickedEle) {
    let evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    let touch = evt.touches[0] || evt.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;
    console.log(x, y);
    [x, y] = [
      x - oldPos.x - oldPos.width / 2,
      y - oldPos.y - oldPos.height / 2,
    ];
    let r = parseInt(
      parseInt(
        document.querySelector("#joystick").getBoundingClientRect().width
      ) / 2
    );
    let newX, newY;
    let theta = Math.atan(Math.abs(y / x));
    if (Math.sqrt(x ** 2 + y ** 2) <= r) {
      newX = x;
      newY = y;
    } else {
      newY = r * Math.sign(y) * Math.sin(theta);
      newX = r * Math.sign(x) * Math.cos(theta);
    }
    clickedEle.style.transform = `translate(${newX}px,${newY}px)`;
    if (!paused) {
      if (!started && delayed) {
        //   gameBgm.loop = true;
        gameBgm.volume = 0.18;
        gameBgm.play();
        curTime = 0;
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
          if (!paused) {
            curTime += 1;
          }
          if (curTime % 5 == 0 && !paused) {
            speed += DIMENSIONS == 30 ? 0.5 : 1;
          }
          if (curTime % 15 == 0 && !paused) {
            createPower();
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
      }
      if (e.key == "r" && waitingToRestart) {
        waitingToRestart = false;
        curTime = 0;
        reset(true);
        gameLoop();
      }
      if (theta >= Math.PI / 4 && newY < 0 && dirY != -1 && moved && delayed) {
        moved = false;
        started = true;
        dirX = 0;
        dirY = 1;
      } else if (
        theta <= Math.PI / 4 &&
        newX < 0 &&
        dirX != 1 &&
        moved &&
        delayed
      ) {
        moved = false;
        started = true;
        dirX = -1;
        dirY = 0;
      } else if (
        theta >= Math.PI / 4 &&
        newY > 0 &&
        dirY != 1 &&
        moved &&
        delayed
      ) {
        moved = false;
        started = true;
        dirX = 0;
        dirY = -1;
      } else if (
        theta <= Math.PI / 4 &&
        newX > 0 &&
        dirX != -1 &&
        moved &&
        delayed
      ) {
        moved = false;
        started = true;
        dirX = 1;
        dirY = 0;
      }
    }
  }
});

document.querySelector(".arrows").addEventListener("touchend", (e) => {
  if (clickedEle) {
    ball.style.transform = `translate(${0}px,${0}px)`;
    clickedEle = undefined;
  }
});
document.querySelector("#joystick").addEventListener("touchcancel", (e) => {
  if (clickedEle) {
    ball.style.transform = `translate(${0}px,${0}px)`;
    clickedEle = undefined;
  }
});

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

document.querySelector(".mob").addEventListener("click", () => {
  if (waitingToRestart) {
    click.play();
    waitingToRestart = false;
    reset(true);
    gameLoop();
  }
});

window.addEventListener("keypress", (e) => {
  if (!paused) {
    if (!started && delayed) {
      gameBgm.volume = 0.18;
      gameBgm.play();
      curTime = 0;
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (!paused) {
          curTime += 1;
        }
        if (curTime % 5 == 0 && !paused) {
          speed += DIMENSIONS == 30 ? 0.5 : 1;
        }
        if (curTime % 15 == 0 && !paused) {
          createPower();
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
    }
    if (e.key == "r" && waitingToRestart) {
      waitingToRestart = false;
      curTime = 0;
      reset(true);
      gameLoop();
    }
    if (e.key == "w" && dirY != -1 && moved && delayed) {
      moved = false;
      started = true;
      dirX = 0;
      dirY = 1;
    } else if (e.key == "a" && dirX != 1 && moved && delayed) {
      moved = false;
      started = true;
      dirX = -1;
      dirY = 0;
    } else if (e.key == "s" && dirY != 1 && moved && delayed) {
      moved = false;
      started = true;
      dirX = 0;
      dirY = -1;
    } else if (e.key == "d" && dirX != -1 && moved && delayed) {
      moved = false;
      started = true;
      dirX = 1;
      dirY = 0;
    }
  }
});

// document.querySelector(".top").addEventListener("click", (e) => {
//   if (!paused) {
//     if (!started) {
//       startTime = Date.now();
//       interval = setInterval(() => {
//         if (!paused) {
//           curTime += 1;
//         }
//         if (curTime % 5 == 0 && !paused) {
//           speed += DIMENSIONS == 30 ? 0.5 : 1;
//         }
//         if (curTime % 15 == 0 && !paused) {
//           createPower();
//         }
//         time.textContent = `${String(
//           Math.floor((maxTime - curTime) / 60)
//         ).padStart(2, "0")}:${String(
//           Math.floor((maxTime - curTime) % 60)
//         ).padStart(2, "0")}`;
//         time2.textContent = `${String(
//           Math.floor((maxTime - curTime) / 60)
//         ).padStart(2, "0")}:${String(
//           Math.floor((maxTime - curTime) % 60)
//         ).padStart(2, "0")}`;
//       }, 1000);
//       started = true;
//     }
//     if (dirY != -1 && moved && delayed) {
//       moved = false;
//       dirX = 0;
//       dirY = 1;
//     }
//   }
// });
// document.querySelector(".left").addEventListener("click", (e) => {
//   if (!paused) {
//     if (!started) {
//       startTime = Date.now();
//       interval = setInterval(() => {
//         if (!paused) {
//           curTime += 1;
//         }
//         if (curTime % 5 == 0 && !paused) {
//           speed += DIMENSIONS == 30 ? 0.5 : 1;
//         }
//         if (curTime % 15 == 0 && !paused) {
//           createPower();
//         }
//         time.textContent = `${String(
//           Math.floor((maxTime - curTime) / 60)
//         ).padStart(2, "0")}:${String(
//           Math.floor((maxTime - curTime) % 60)
//         ).padStart(2, "0")}`;
//         time2.textContent = `${String(
//           Math.floor((maxTime - curTime) / 60)
//         ).padStart(2, "0")}:${String(
//           Math.floor((maxTime - curTime) % 60)
//         ).padStart(2, "0")}`;
//       }, 1000);
//       started = true;
//     }
//     if (dirX != 1 && moved && delayed) {
//       moved = false;
//       dirX = -1;
//       dirY = 0;
//     }
//   }
// });
// document.querySelector(".right").addEventListener("click", (e) => {
//   if (!paused) {
//     if (!started) {
//       startTime = Date.now();
//       interval = setInterval(() => {
//         if (!paused) {
//           curTime += 1;
//         }
//         if (curTime % 5 == 0 && !paused) {
//           speed += DIMENSIONS == 30 ? 0.5 : 1;
//         }
//         if (curTime % 15 == 0 && !paused) {
//           createPower();
//         }
//         time.textContent = `${String(
//           Math.floor((maxTime - curTime) / 60)
//         ).padStart(2, "0")}:${String(
//           Math.floor((maxTime - curTime) % 60)
//         ).padStart(2, "0")}`;
//         time2.textContent = `${String(
//           Math.floor((maxTime - curTime) / 60)
//         ).padStart(2, "0")}:${String(
//           Math.floor((maxTime - curTime) % 60)
//         ).padStart(2, "0")}`;
//       }, 1000);
//       started = true;
//     }
//     if (dirX != -1 && moved && delayed) {
//       moved = false;
//       dirX = 1;
//       dirY = 0;
//     }
//   }
// });
// document.querySelector(".bottom").addEventListener("click", (e) => {
//   if (!paused) {
//     if (!started) {
//       startTime = Date.now();
//       interval = setInterval(() => {
//         if (!paused) {
//           curTime += 1;
//         }
//         if (curTime % 5 == 0 && !paused) {
//           speed += DIMENSIONS == 30 ? 0.5 : 1;
//         }
//         if (curTime % 15 == 0 && !paused) {
//           createPower();
//         }
//         time.textContent = `${String(
//           Math.floor((maxTime - curTime) / 60)
//         ).padStart(2, "0")}:${String(
//           Math.floor((maxTime - curTime) % 60)
//         ).padStart(2, "0")}`;
//         time2.textContent = `${String(
//           Math.floor((maxTime - curTime) / 60)
//         ).padStart(2, "0")}:${String(
//           Math.floor((maxTime - curTime) % 60)
//         ).padStart(2, "0")}`;
//       }, 1000);
//       started = true;
//     }
//     if (dirY != 1 && moved && delayed) {
//       moved = false;
//       dirX = 0;
//       dirY = -1;
//     }
//   }
// });

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
    } else if (DIMENSIONS == 30) {
      ele.style.fontSize = `17px`;
    } else if (DIMENSIONS == 60) {
      ele.style.fontSize = `14px`;
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

function createPower() {
  if (!paused && powers.length < 3) {
    curPosX = Math.floor(Math.random() * DIMENSIONS);
    curPosY = Math.floor(Math.random() * DIMENSIONS);
    powerUpEle = powerUp[Math.floor(Math.random() * powerUp.length)];
    const power = document.createElement("div");
    power.classList.add("pow");
    power.innerHTML = `<img src="${powerUpEle.img}">`;
    power.style.position = "absolute";
    power.style.top = `${curPosY * pixelSize}px`;
    power.style.left = `${curPosX * pixelSize}px`;

    for (let i = 0; i < snake.length; i++) {
      if (elementsOverlap(snake[i], power)) {
        return createPower();
      }
    }
    for (let i = 0; i < letters.length; i++) {
      if (elementsOverlap(letters[i], power)) {
        return createPower();
      }
    }

    power.style.backgroundColor = powerUpEle.color;
    power.style.height = `${pixelSize}px`;
    power.style.width = `${pixelSize}px`;
    power.style.borderRadius = `100%`;
    setTimeout(
      (power, index) => {
        if (
          power.getBoundingClientRect().x != 0 &&
          power.getBoundingClientRect().y != 0
        ) {
          powers[index][0].parentNode.removeChild(powers[index][0]);
          powers.splice(index, 1);
        }
      },
      8000,
      power,
      powers.length
    );
    powers.push([power, powerUpEle]);
    gameBg.append(power);
  }
}

function reset(all = false) {
  go.classList.add("hide");
  delayed = false;
  setTimeout(() => {
    delayed = true;
  }, 500);
  paused = false;
  letters = [];
  powers = [];
  dirX = 0;
  dirY = 0;
  speed = SPEED;
  gameBg.innerHTML = `<div class="snake"></div><div class="time2">00:00</div>`;
  snakeHead = document.querySelector(".snake");
  snakeHead.style.height = `${pixelSize}px`;
  snakeHead.style.width = `${pixelSize}px`;
  time2 = document.querySelector(".time2");
  started = false;
  moved = false;
  startTime = 0;
  clearInterval(interval);
  curTime = 0;
  time.textContent = `${String(Math.floor(maxTime / 60)).padStart(
    2,
    "0"
  )}:${String(Math.floor(maxTime % 60)).padStart(2, "0")}`;
  time2.textContent = `${String(Math.floor(maxTime / 60)).padStart(
    2,
    "0"
  )}:${String(Math.floor(maxTime % 60)).padStart(2, "0")}`;
  snake = [snakeHead];
  let curPosX = Math.floor(Math.random() * DIMENSIONS);
  let curPosY = Math.floor(Math.random() * DIMENSIONS);
  snakeHead.style.top = `${curPosY * pixelSize}px`;
  snakeHead.style.left = `${curPosX * pixelSize}px`;
  if (all) {
    score = 0;
    scoreEle.textContent = 0;
    pixelSize = gameBg.getBoundingClientRect().height / DIMENSIONS;
    lives = LIVES;
    snakeHead.style.height = `${pixelSize}px`;
    snakeHead.style.width = `${pixelSize}px`;
    snakeHead.style.top = `${curPosY * pixelSize}px`;
    snakeHead.style.left = `${curPosX * pixelSize}px`;
    heart.innerHTML = ``;
    for (let i = 0; i < lives; i++) {
      let heartC = document.createElement("div");
      heartC.classList.add("heartContent");
      heartC.innerHTML = `<img src="./assets/heart.png">`;
      heart.append(heartC);
    }
  }
}

resume.addEventListener("click", (e) => {
  if (!resume.classList.contains("disabled")) {
    click.play();
    if (started) {
      gameBgm.play();
    }
    paused = false;
    setting.querySelector("img").classList.remove("onclick");
    menu.classList.add("hide");
  }
});

restart.addEventListener("click", (e) => {
  click.play();
  gameBgm.currentTime = 0;
  menu.classList.add("hide");
  resume.classList.remove("disabled");
  setting.querySelector("img").classList.remove("onclick");
  reset(true);
});

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
  if (!paused) {
    for (let i = 0; i < powers.length; i++) {
      if (elementsOverlap(snakeHead, powers[i][0])) {
        powers[i][1].do();
        powers[i][0].parentNode.removeChild(powers[i][0]);
        power.play();
        powers.splice(i, 1);
      }
    }
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
          if (letters[i].textContent == currentWord[index].toUpperCase()) {
            letters[i].parentNode.removeChild(letters[i]);
            text.innerHTML = `<span class="colorTextGreen">${currentWord
              .toUpperCase()
              .slice(0, index + 1)}</span>${currentWord
              .toUpperCase()
              .slice(index + 1, currentWord.length)}`;
            letters.splice(i, 1);
            score += 10;
            eat.play();
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
            hiss.play();
            increaseSnakeSize(2);
            curTime += 3;
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
      curTime -= 15;
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
      lives--;
      let hearts = Array.from(heart.querySelectorAll(".heartContent"));
      hearts[lives].classList.add("blinking");
      if (lives > 0) {
        hiss.play();
        reset();
      } else {
        gameBgm.pause();
        gameBgm.currentTime = 0;
        goAudio.play();
        go.classList.remove("hide");
        waitingToRestart = true;
        return;
      }
    }
  }
  setTimeout(() => window.requestAnimationFrame(gameLoop), 1000 / speed);
}
gameLoop();
