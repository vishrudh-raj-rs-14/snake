let DIMENSIONS = 30;
const LIVES = 3;

const SPEED = 7;
let gameState = (state = {
  dimension: DIMENSIONS,
  snake: [],
  oldSnake: [],
  dirX: 0,
  dirY: 0,
  obstacles: [],
  letters: [],
  speed: SPEED,
  curTime: 0,
  portals: [],
  score: 0,
  index: 0,
  curPosX: Math.floor(Math.random() * DIMENSIONS),
  curPosY: Math.floor(Math.random() * DIMENSIONS),
  snakeHead: undefined,
  lives: LIVES,
  oldDirX: 0,
  oldDirY: 0,
  load: false,
});
let PercentOfObstacles = 15;
let coopPlay = false;
let PercentOfMovingObstacles = 10;
const gameBg = document.querySelector(".game-bg");
const go = document.querySelector(".go");
gameBg.innerHTML = `<div class="snake"></div><div class="time2">00:00</div>`;
const setting = document.querySelector(".menu");
const save = document.querySelector("#save");
let gameoverCollide = false;
let mainAudio = new Audio("./assets/main.mp3");
mainAudio.volume = 0.25;
mainAudio.loop = true;
const newGame = document.querySelector("#new");
const loadGame = document.querySelector("#load");
const coop = document.querySelector("#coop");
const load = document.querySelector("#load2");
const menu = document.querySelector(".settings-modal");
let snakeHead = document.querySelector(".snake");
let snakeHead2;
let soundEffect = document.querySelector(".soundEffect");
let muteMusic = document.querySelector(".music");
const text = document.querySelector(".textContent");
const ball = document.querySelector("#joystick-head");
let portals = [];
let root = document.querySelector(":root");
let clickedEle;
let oldPos;
let obstacles = [];
let movingObstacle = [];
const maxTime = 60;
let oldDirX;
let oldDirX2;
let oldDirY;
let oldDirY2;
let oldSnake = [];
let oldSnake2 = [];
let lives = LIVES;
let portaled = false;
let portaled2 = false;
let delayed = true;
let eat = new Audio("./assets/eat.mp3");
let power = new Audio("./assets/power.mp3");
let goAudio = new Audio("./assets/go.mp3");
let gameBgm = new Audio("./assets/bgm.mp3");
gameBgm.loop = true;
gameBgm.volume = 0.25;
let click = new Audio("./assets/click.mp3");
let hiss = new Audio("./assets/hiss.mp3");
let curTime = 0;
let paused = false;
let waitingToRestart = false;
const time = document.querySelector(".time");
let time2 = document.querySelector(".time2");
const heart = document.querySelector(".heart");
let powers = [];
mainAudio.autoplay = true;
// mainAudio.muted = true;
// if (mainAudio.paused) {
//   mainAudio.play();
// }

document.body.onpointermove = (e) => {
  let blob = document.querySelector(".blob");
  blob.animate(
    {
      top: `${e.clientY}px`,
      left: `${e.clientX}px`,
    },

    {
      duration: 3000,
      fill: "forwards",
    }
  );
};

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
    do: (n = 0) => {
      if (DIMENSIONS == 20) speed -= 1;
      else speed -= 1;
    },
    img: "./assets/turtle.png",
  },
  {
    name: "lengthDec",
    color: "#318CE7",
    do: (n = 0) => {
      if (n == 0) {
        if (snake.length <= 2) return;
        for (let i = 0; i < 2; i++) {
          let body = snake.pop();
          body.parentNode.removeChild(body);
        }
      } else {
        if (snake2.length <= 2) return;
        for (let i = 0; i < 2; i++) {
          let body = snake2.pop();
          body.parentNode.removeChild(body);
        }
      }
    },
    img: "./assets/snake.png",
  },
  {
    name: "increaseTime",
    color: "#FEBE10",
    do: (n = 0) => {
      curTime -= 10;
    },
    img: "./assets/clock.png",
  },
  {
    name: "increaseSpeed",
    color: "#FF033E",
    do: (n = 0) => {
      speed += 2;
      document
        .querySelector(":root")
        .style.setProperty("--transition", `${1000 / speed}ms`);
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
    gameBgm.volume = 0.25;
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
let snake2 = [snakeHead2];
const resume = document.querySelector("#resume");
const restart = document.querySelector("#restart");
snakeHead.style.height = `${pixelSize}px`;
snakeHead.style.width = `${pixelSize}px`;
let curPosX = Math.floor(Math.random() * DIMENSIONS);
let curPosY = Math.floor(Math.random() * DIMENSIONS);
snakeHead.dataset.x = curPosX;
snakeHead.dataset.y = curPosY;
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
document.addEventListener("keydown", (e) => {
  if (document.querySelector(".bg").classList.contains("hide")) {
    if (e.key == "Escape") {
      click.play();
      gameBgm.pause();
      let gear = setting.querySelector("img");
      paused = true;
      gear.classList.add("onclick");
      menu.classList.remove("hide");
    }
  }
});

setting.addEventListener("click", (e) => {
  click.play();
  gameBgm.pause();
  let gear = setting.querySelector("img");
  paused = true;
  gear.classList.add("onclick");
  menu.classList.remove("hide");
});

// document.querySelector(".arrows").addEventListener("touchstart", (e) => {
//   clickedEle = ball;
//   oldPos = ball.getBoundingClientRect();
//   if (clickedEle) {
//     let evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
//     let touch = evt.touches[0] || evt.changedTouches[0];
//     x = touch.pageX;
//     y = touch.pageY;
//     [x, y] = [
//       x - oldPos.x - oldPos.width / 2,
//       y - oldPos.y - oldPos.height / 2,
//     ];
//     let r = parseInt(
//       parseInt(
//         document.querySelector("#joystick").getBoundingClientRect().width
//       ) / 2
//     );
//     let newX, newY;
//     let theta = Math.atan(Math.abs(y / x));
//     if (Math.sqrt(x ** 2 + y ** 2) <= r) {
//       newX = x;
//       newY = y;
//     } else {
//       newY = r * Math.sign(y) * Math.sin(theta);
//       newX = r * Math.sign(x) * Math.cos(theta);
//     }
//     clickedEle.style.transform = `translate(${newX}px,${newY}px)`;
//     if (!paused && (x != 0 || y != 0)) {
//       if (!started && delayed) {
//         //   gameBgm.loop = true;
//         // gameBgm.volume = 0.18;
//         gameBgm.play();
//         // curTime = 0;
//         if (interval) clearInterval(interval);
//         interval = setInterval(() => {
//           if (!paused) {
//             curTime += 1;
//           }
//           if (curTime % 5 == 0 && !paused) {
//             speed += DIMENSIONS == 30 ? 0.5 : 1;
//             document
//               .querySelector(":root")
//               .style.setProperty("--transition", `${1000 / speed}ms`);
//           }
//           if (curTime % 15 == 0 && !paused) {
//             createPower();
//           }
//           time.textContent = `${String(
//             Math.floor((maxTime - curTime) / 60)
//           ).padStart(2, "0")}:${String(
//             Math.floor((maxTime - curTime) % 60)
//           ).padStart(2, "0")}`;
//           time2.textContent = `${String(
//             Math.floor((maxTime - curTime) / 60)
//           ).padStart(2, "0")}:${String(
//             Math.floor((maxTime - curTime) % 60)
//           ).padStart(2, "0")}`;
//         }, 1000);
//       }
//       if (e.key == "r" && waitingToRestart) {
//         waitingToRestart = false;
//         curTime = 0;
//         reset(
//           true,
//           {
//             dimension: DIMENSIONS,
//             snake: [],
//             oldSnake: [],
//             dirX: 0,
//             dirY: 0,
//             obstacles: [],
//             letters: [],
//             speed: SPEED,
//             curTime: 0,
//             portals: [],
//             score: 0,
//             index: 0,
//             curPosX: Math.floor(Math.random() * DIMENSIONS),
//             curPosY: Math.floor(Math.random() * DIMENSIONS),
//             snakeHead: undefined,
//             lives: LIVES,
//             oldDirX: 0,
//             oldDirY: 0,
//             load: false,
//           },
//           coopPlay
//         );
//         gameLoop();
//       }
//       if (theta >= Math.PI / 4 && newY < 0 && dirY != -1 && moved && delayed) {
//         moved = false;
//         started = true;
//         save.classList.remove("disabled");
//         dirX = 0;
//         dirY = 1;
//       } else if (
//         theta <= Math.PI / 4 &&
//         newX < 0 &&
//         dirX != 1 &&
//         moved &&
//         delayed
//       ) {
//         moved = false;
//         started = true;
//         save.classList.remove("disabled");
//         dirX = -1;
//         dirY = 0;
//       } else if (
//         theta >= Math.PI / 4 &&
//         newY > 0 &&
//         dirY != 1 &&
//         moved &&
//         delayed
//       ) {
//         moved = false;
//         started = true;
//         save.classList.remove("disabled");
//         dirX = 0;
//         dirY = -1;
//       } else if (
//         theta <= Math.PI / 4 &&
//         newX > 0 &&
//         dirX != -1 &&
//         moved &&
//         delayed
//       ) {
//         moved = false;
//         started = true;
//         save.classList.remove("disabled");
//         dirX = 1;
//         dirY = 0;
//       }
//     }
//   }
//   //   ball.transform
// });

let downx, downy;
gameBg.addEventListener("touchstart", (e) => {
  let evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
  let touch = evt.touches[0] || evt.changedTouches[0];
  downx = touch.pageX;
  downy = touch.pageY;
  //   ball.transform
});

window.addEventListener("touchmove", (e) => {
  if (downx && downy) {
    let evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    let touch = evt.touches[0] || evt.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;
    let xDiff = x - downx;
    let yDiff = y - downy;
    if (!paused) {
      if (!started && delayed) {
        //   gameBgm.loop = true;
        // gameBgm.volume = 0.18;
        gameBgm.play();
        // curTime = 0;
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
          if (!paused) {
            curTime += 1;
          }
          if (curTime % 5 == 0 && !paused) {
            speed += DIMENSIONS == 30 ? 0.5 : 1;
            document
              .querySelector(":root")
              .style.setProperty("--transition", `${1000 / speed}ms`);
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
        reset(
          true,
          {
            dimension: DIMENSIONS,
            snake: [],
            oldSnake: [],
            dirX: 0,
            dirY: 0,
            obstacles: [],
            letters: [],
            speed: SPEED,
            curTime: 0,
            portals: [],
            score: 0,
            index: 0,
            curPosX: Math.floor(Math.random() * DIMENSIONS),
            curPosY: Math.floor(Math.random() * DIMENSIONS),
            snakeHead: undefined,
            lives: LIVES,
            oldDirX: 0,
            oldDirY: 0,
            load: false,
          },
          coopPlay
        );
        gameLoop();
      }
      if (
        Math.abs(xDiff) < Math.abs(yDiff) &&
        yDiff < 0 &&
        dirY != -1 &&
        moved &&
        delayed
      ) {
        moved = false;
        started = true;
        save.classList.remove("disabled");
        dirX = 0;
        dirY = 1;
        downx = undefined;
        downy = undefined;
      } else if (
        Math.abs(xDiff) > Math.abs(yDiff) &&
        xDiff < 0 &&
        dirX != 1 &&
        moved &&
        delayed
      ) {
        moved = false;
        started = true;
        save.classList.remove("disabled");
        dirX = -1;
        dirY = 0;
        downx = undefined;
        downy = undefined;
      } else if (
        Math.abs(xDiff) < Math.abs(yDiff) &&
        yDiff > 0 &&
        dirY != 1 &&
        moved &&
        delayed
      ) {
        moved = false;
        started = true;
        save.classList.remove("disabled");
        dirX = 0;
        dirY = -1;
        downx = undefined;
        downy = undefined;
      } else if (
        Math.abs(xDiff) > Math.abs(yDiff) &&
        xDiff > 0 &&
        dirX != -1 &&
        moved &&
        delayed
      ) {
        moved = false;
        started = true;
        save.classList.remove("disabled");
        dirX = 1;
        dirY = 0;
        downx = undefined;
        downy = undefined;
      }
    }
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
let dirX2 = 0;
let dirY = 0;
let dirY2 = 0;
let moved = true;

document.querySelector(".mob").addEventListener("click", () => {
  if (waitingToRestart) {
    click.play();
    waitingToRestart = false;
    reset(
      true,
      {
        dimension: DIMENSIONS,
        snake: [],
        oldSnake: [],
        dirX: 0,
        dirY: 0,
        obstacles: [],
        letters: [],
        speed: SPEED,
        curTime: 0,
        portals: [],
        score: 0,
        index: 0,
        curPosX: Math.floor(Math.random() * DIMENSIONS),
        curPosY: Math.floor(Math.random() * DIMENSIONS),
        snakeHead: undefined,
        lives: LIVES,
        oldDirX: 0,
        oldDirY: 0,
        load: false,
      },
      coopPlay
    );
    gameLoop();
  }
});

window.addEventListener("keydown", (e) => {
  if (!paused && document.querySelector(".bg").classList.contains("hide")) {
    if (!started && delayed) {
      // gameBgm.volume = 0.18;
      gameBgm.play();
      //   curTime = 0;

      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (!paused) {
          curTime += 1;
        }
        if (curTime % 5 == 0 && !paused) {
          speed += DIMENSIONS == 30 ? 0.5 : 1;
          document
            .querySelector(":root")
            .style.setProperty("--transition", `${1000 / speed}ms`);
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
      reset(
        true,
        {
          dimension: DIMENSIONS,
          snake: [],
          oldSnake: [],
          dirX: 0,
          dirY: 0,
          obstacles: [],
          letters: [],
          speed: SPEED,
          curTime: 0,
          portals: [],
          score: 0,
          index: 0,
          curPosX: Math.floor(Math.random() * DIMENSIONS),
          curPosY: Math.floor(Math.random() * DIMENSIONS),
          snakeHead: undefined,
          lives: LIVES,
          oldDirX: 0,
          oldDirY: 0,
          load: false,
        },
        coopPlay
      );
      gameLoop();
    }
    if (
      (e.key == "w" || e.key == "ArrowUp") &&
      !coopPlay &&
      dirY != -1 &&
      moved &&
      delayed
    ) {
      moved = false;
      started = true;
      save.classList.remove("disabled");
      dirX = 0;
      dirY = 1;
    } else if (
      (e.key == "a" || e.key == "ArrowLeft") &&
      !coopPlay &&
      dirX != 1 &&
      moved &&
      delayed
    ) {
      moved = false;
      started = true;
      save.classList.remove("disabled");
      dirX = -1;
      dirY = 0;
    } else if (
      (e.key == "s" || e.key == "ArrowDown") &&
      !coopPlay &&
      dirY != 1 &&
      moved &&
      delayed
    ) {
      moved = false;
      started = true;
      save.classList.remove("disabled");
      dirX = 0;
      dirY = -1;
    } else if (
      (e.key == "d" || e.key == "ArrowRight") &&
      !coopPlay &&
      dirX != -1 &&
      moved &&
      delayed
    ) {
      moved = false;
      started = true;
      save.classList.remove("disabled");
      dirX = 1;
      dirY = 0;
    }
  }
});

window.addEventListener("keydown", (e) => {
  if (coopPlay) {
    if (!paused && document.querySelector(".bg").classList.contains("hide")) {
      if (!started && delayed) {
        // gameBgm.volume = 0.18;
        gameBgm.play();
        //   curTime = 0;

        if (interval) clearInterval(interval);
        interval = setInterval(() => {
          if (!paused) {
            curTime += 1;
          }
          if (curTime % 5 == 0 && !paused) {
            speed += DIMENSIONS == 30 ? 0.5 : 1;
            document
              .querySelector(":root")
              .style.setProperty("--transition", `${1000 / speed}ms`);
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
        reset(
          true,
          {
            dimension: DIMENSIONS,
            snake: [],
            oldSnake: [],
            dirX: 0,
            dirY: 0,
            obstacles: [],
            letters: [],
            speed: SPEED,
            curTime: 0,
            portals: [],
            score: 0,
            index: 0,
            curPosX: Math.floor(Math.random() * DIMENSIONS),
            curPosY: Math.floor(Math.random() * DIMENSIONS),
            snakeHead: undefined,
            lives: LIVES,
            oldDirX: 0,
            oldDirY: 0,
            load: false,
          },
          coopPlay
        );
        gameLoop();
      }
      // console.log(e.key, moved);

      if (e.key == "w" && dirY != -1 && moved && delayed) {
        moved = false;
        started = true;
        save.classList.remove("disabled");
        dirX = 0;
        dirY = 1;
      } else if (e.key == "a" && dirX != 1 && moved && delayed) {
        moved = false;
        started = true;
        save.classList.remove("disabled");
        dirX = -1;
        dirY = 0;
      } else if (e.key == "s" && dirY != 1 && moved && delayed) {
        moved = false;
        started = true;
        save.classList.remove("disabled");
        dirX = 0;
        dirY = -1;
      } else if (e.key == "d" && dirX != -1 && moved && delayed) {
        moved = false;
        started = true;
        save.classList.remove("disabled");
        dirX = 1;
        dirY = 0;
      }
    }
  }
});
window.addEventListener("keydown", (e) => {
  if (coopPlay) {
    if (!paused && document.querySelector(".bg").classList.contains("hide")) {
      if (!started && delayed) {
        // gameBgm.volume = 0.18;
        gameBgm.play();
        //   curTime = 0;

        if (interval) clearInterval(interval);
        interval = setInterval(() => {
          if (!paused) {
            curTime += 1;
          }
          if (curTime % 5 == 0 && !paused) {
            speed += DIMENSIONS == 30 ? 0.5 : 1;
            document
              .querySelector(":root")
              .style.setProperty("--transition", `${1000 / speed}ms`);
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
        reset(
          true,
          {
            dimension: DIMENSIONS,
            snake: [],
            oldSnake: [],
            dirX: 0,
            dirY: 0,
            obstacles: [],
            letters: [],
            speed: SPEED,
            curTime: 0,
            portals: [],
            score: 0,
            index: 0,
            curPosX: Math.floor(Math.random() * DIMENSIONS),
            curPosY: Math.floor(Math.random() * DIMENSIONS),
            snakeHead: undefined,
            lives: LIVES,
            oldDirX: 0,
            oldDirY: 0,
            load: false,
          },
          coopPlay
        );
        gameLoop();
      }

      if (e.key == "ArrowUp" && dirY2 != -1 && moved2 && delayed) {
        moved2 = false;
        started = true;
        save.classList.remove("disabled");
        dirX2 = 0;
        dirY2 = 1;
      } else if (e.key == "ArrowLeft" && dirX2 != 1 && moved2 && delayed) {
        moved2 = false;
        started = true;
        save.classList.remove("disabled");
        dirX2 = -1;
        dirY2 = 0;
      } else if (e.key == "ArrowDown" && dirY2 != 1 && moved2 && delayed) {
        moved2 = false;
        started = true;
        save.classList.remove("disabled");
        dirX2 = 0;
        dirY2 = -1;
      } else if (e.key == "ArrowRight" && dirX2 != -1 && moved2 && delayed) {
        moved2 = false;
        started = true;
        save.classList.remove("disabled");
        dirX2 = 1;
        dirY2 = 0;
      }
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
  for (let i = 0; i < obstacles.length; i++) {
    lst.push(`${obstacles[i].dataset.x},${obstacles[i].dataset.y}`);
  }
  for (let i = 0; i < portals.length; i++) {
    lst.push(`${portals[i].dataset.x},${portals[i].dataset.y}`);
  }

  for (let j = 0; j < movingObstacle.length; j++) {
    for (
      k =
        parseInt(movingObstacle[j].dataset.orgX) -
        parseInt(movingObstacle[j].dataset.blocks) -
        1;
      k <
      parseInt(movingObstacle[j].dataset.orgX) +
        parseInt(movingObstacle[j].dataset.blocks) +
        2;
      k++
    ) {
      lst.push(`${k},${movingObstacle[j].dataset.orgY}`);
    }
    for (
      k =
        parseInt(movingObstacle[j].dataset.orgY) -
        parseInt(movingObstacle[j].dataset.blocks) -
        1;
      k <
      parseInt(movingObstacle[j].dataset.orgY) +
        parseInt(movingObstacle[j].dataset.blocks) +
        2;
      k++
    ) {
      lst.push(`${movingObstacle[j].dataset.orgX},${k}`);
    }
  }
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
    ele.dataset.x = X;
    ele.dataset.y = Y;
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

function createSnakeBody(arr) {
  let snakeNew = [];
  for (let i = 0; i < arr.length; i++) {
    const body = document.createElement("div");
    body.style.width = `${pixelSize}px`;
    body.style.height = `${pixelSize}px`;
    body.style.top = `${parseInt(arr[i][1]) * pixelSize}px`;
    body.style.left = `${parseInt(arr[i][0]) * pixelSize}px`;
    body.classList.add("snake-body");
    body.dataset.x = parseInt(arr[i][0]);
    body.dataset.y = parseInt(arr[i][1]);
    snakeNew.push(body);
    gameBg.append(body);
  }
  return snakeNew;
}

function createSnakeBody2(arr) {
  let snakeNew = [];
  for (let i = 0; i < arr.length; i++) {
    const body = document.createElement("div");
    body.style.width = `${pixelSize}px`;
    body.style.height = `${pixelSize}px`;
    body.style.top = `${parseInt(arr[i][1]) * pixelSize}px`;
    body.style.left = `${parseInt(arr[i][0]) * pixelSize}px`;
    body.dataset.x = parseInt(arr[i][0]);
    body.dataset.y = parseInt(arr[i][1]);
    body.classList.add("snake-body2");
    snakeNew.push(body);
    gameBg.append(body);
  }
  return snakeNew;
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
function increaseSnakeSize2(n = 1) {
  for (let i = 0; i < n; i++) {
    const body = document.createElement("div");
    body.style.width = `${pixelSize}px`;
    body.style.height = `${pixelSize}px`;
    body.style.top = `${parseInt(snake2[snake2.length - 1].style.top)}px`;
    body.style.left = `${parseInt(snake2[snake2.length - 1].style.left)}px`;
    body.classList.add("snake-body2");
    snake2.push(body);
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
    for (let i = 0; i < obstacles.length; i++) {
      if (
        parseInt(obstacles[i].dataset.x) == curPosX &&
        parseInt(obstacles[i].dataset.y) == curPosY
      ) {
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

function placeObstacle(arr) {
  obstacles = [];
  for (let i = 0; i < arr.length; i++) {
    let obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.height = `${pixelSize}px`;
    obstacle.style.width = `${pixelSize}px`;
    obstacle.style.top = `${parseInt(arr[i][1]) * pixelSize}px`;
    obstacle.style.left = `${parseInt(arr[i][0]) * pixelSize}px`;
    obstacle.dataset.x = arr[i][0];
    obstacle.dataset.y = arr[i][1];
    gameBg.append(obstacle);
    obstacles.push(obstacle);
  }
}

function createObstacle() {
  obstacles.splice(0, obstacles.length);
  let noOFObsatcles = (PercentOfObstacles * DIMENSIONS) / 100;
  let obs = [`${snakeHead.dataset.x},${snakeHead.dataset.y}`];
  if (coopPlay) {
    obs.push(`${snakeHead2.dataset.x},${snakeHead2.dataset.y}`);
  }
  for (let i = 0; i < noOFObsatcles; i++) {
    let x = Math.floor(Math.random() * DIMENSIONS);
    let y = Math.floor(Math.random() * DIMENSIONS);

    while (obs.includes(`${x},${y}`)) {
      x = Math.floor(Math.random() * DIMENSIONS);
      y = Math.floor(Math.random() * DIMENSIONS);
    }
    let obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.height = `${pixelSize}px`;
    obstacle.style.width = `${pixelSize}px`;
    obstacle.style.top = `${y * pixelSize}px`;
    obstacle.style.left = `${x * pixelSize}px`;
    obstacle.dataset.x = x;
    obstacle.dataset.y = y;

    obs.push(`${x},${y}`);

    obstacles.push(obstacle);
    gameBg.append(obstacle);
  }
}

function placeMovingObstacle(arr) {
  movingObstacle = [];
  for (let i = 0; i < arr.length; i++) {
    let obs = document.createElement("div");
    obs.classList.add("moving-obstacle");
    obs.innerHTML = `<img src="./assets/saw.png">`;
    obs.style.width = `${pixelSize}px`;
    obs.style.height = `${pixelSize}px`;
    obs.dataset.x = arr[i].x;
    obs.dataset.y = arr[i].y;
    obs.style.top = `${parseInt(arr[i].y) * pixelSize}px`;
    obs.style.left = `${parseInt(arr[i].x) * pixelSize}px`;
    obs.dataset.orgX = arr[i].orgX;
    obs.dataset.orgY = arr[i].orgY;
    obs.dataset.dir = arr[i].dir;
    obs.dataset.movDir = arr[i].movDir;
    obs.dataset.blocks = arr[i].blocks;
    obs.dataset.travelled = arr[i].travelled;
    movingObstacle.push(obs);
    gameBg.append(obs);
  }
}

function createMovingObstacle() {
  movingObstacle = [];
  let noOfMovingObsatcles = (PercentOfMovingObstacles / 100) * DIMENSIONS;
  let noOFObsatcles = (PercentOfObstacles * DIMENSIONS) / 100;
  let obs = [`${snakeHead.dataset.x},${snakeHead.dataset.y}`];
  if (coopPlay) {
    obs.push(`${snakeHead2.dataset.x},${snakeHead2.dataset.y}`);
  }
  let newobs = [];
  let restrict = [];
  restrict.push(parseInt(snakeHead.dataset.x));
  restrict.push(parseInt(snakeHead.dataset.y));

  //   for (let j = 0; j < obstacles.length; j++) {
  //     console.log(obstacles[i].dataset.x, obstacles[i].dataset.y);
  //   }

  let dir = Math.floor(Math.random() * 2);
  for (let i = 0; i < portals.length; i++) {
    restrict.push(parseInt(portals[i].dataset.x));
    restrict.push(parseInt(portals[i].dataset.y));
  }
  for (let i = 0; i < obstacles.length; i++) {
    obs.push(`${obstacles[i].dataset.x},${obstacles[i].dataset.y}`);
  }
  for (let i = 0; i < noOfMovingObsatcles; i++) {
    newobs = [];
    restrictX = [];
    restrictY = [];
    let movDir = Math.floor(Math.random() * 2);
    let block = Math.floor(Math.random() * 6) + 4;
    let minX = -2000,
      maxX = +2000,
      minY = -2000,
      maxY = +2000;
    if (dir == 0) {
      minX = block + 1;
      maxX = DIMENSIONS - 1 - block - 1;
      dir = 1;
    } else {
      minY = block + 1;
      maxY = DIMENSIONS - 1 - block - 1;
      dir = 0;
    }
    for (let j = 0; j < obstacles.length; j++) {
      for (
        k = parseInt(obstacles[j].dataset.x) - block - 1;
        k < parseInt(obstacles[j].dataset.x) + block + 2;
        k++
      ) {
        newobs.push(`${k},${obstacles[j].dataset.y}`);
      }
      for (
        k = parseInt(obstacles[j].dataset.y) - block - 1;
        k < parseInt(obstacles[j].dataset.y) + block + 2;
        k++
      ) {
        newobs.push(`${obstacles[j].dataset.x},${k}`);
      }
    }
    for (
      k = parseInt(snakeHead.dataset.x) - block - 1;
      k < parseInt(snakeHead.dataset.x) + block + 2;
      k++
    ) {
      newobs.push(`${k},${snakeHead.dataset.y}`);
    }
    for (
      k = parseInt(snakeHead.dataset.y) - block - 1;
      k < parseInt(snakeHead.dataset.y) + block + 2;
      k++
    ) {
      newobs.push(`${snakeHead.dataset.x},${k}`);
    }
    if (coopPlay) {
      for (
        k = parseInt(snakeHead2.dataset.x) - block - 1;
        k < parseInt(snakeHead2.dataset.x) + block + 2;
        k++
      ) {
        newobs.push(`${k},${snakeHead2.dataset.y}`);
      }
      for (
        k = parseInt(snakeHead2.dataset.y) - block - 1;
        k < parseInt(snakeHead2.dataset.y) + block + 2;
        k++
      ) {
        newobs.push(`${snakeHead2.dataset.x},${k}`);
      }
    }
    let x = Math.floor(Math.random() * DIMENSIONS);
    let y = Math.floor(Math.random() * DIMENSIONS);

    while (
      obs.includes(`${x},${y}`) ||
      newobs.includes(`${x},${y}`) ||
      restrict.includes(x) ||
      restrict.includes(y) ||
      x < minX ||
      x > maxX ||
      restrictX.includes(x) ||
      restrictY.includes(y) ||
      y < minY ||
      y > maxY
    ) {
      x = Math.floor(Math.random() * DIMENSIONS);
      y = Math.floor(Math.random() * DIMENSIONS);
    }
    let obstacle = document.createElement("div");
    obstacle.classList.add("moving-obstacle");
    obstacle.innerHTML = `<img src="./assets/saw.png">`;
    obstacle.style.height = `${pixelSize}px`;
    obstacle.style.width = `${pixelSize}px`;
    obstacle.style.top = `${y * pixelSize}px`;
    obstacle.style.left = `${x * pixelSize}px`;
    obstacle.dataset.x = x;
    obstacle.dataset.orgX = x;
    obstacle.dataset.y = y;
    obstacle.dataset.orgY = y;
    obstacle.dataset.dir = dir;
    obstacle.dataset.movDir = [-1, 1][movDir];
    obstacle.dataset.blocks = block;
    obstacle.dataset.travelled = 0;
    obs.push(`${x},${y}`);
    movingObstacle.push(obstacle);
    gameBg.append(obstacle);
  }
}

function placePortal(arr) {
  let portal1 = document.createElement("div");
  let portal2 = document.createElement("div");
  let x = parseInt(arr[0][0]);
  let y = parseInt(arr[0][1]);
  let a = parseInt(arr[1][0]);
  let b = parseInt(arr[1][1]);
  portal1.classList.add("portal");
  portal2.classList.add("portal");
  portal1.style.width = `${pixelSize}px`;
  portal1.style.height = `${pixelSize}px`;
  portal1.style.top = `${y * pixelSize}px`;
  portal1.style.left = `${x * pixelSize}px`;
  portal1.dataset.x = x;
  portal1.dataset.y = y;
  portal1.dataset.teleportX = a;
  portal1.dataset.teleportY = b;
  portal2.style.width = `${pixelSize}px`;
  portal2.style.height = `${pixelSize}px`;
  portal2.style.top = `${b * pixelSize}px`;
  portal2.style.left = `${a * pixelSize}px`;
  portal2.dataset.teleportX = x;
  portal2.dataset.teleportY = y;
  portal2.dataset.x = a;
  portal2.dataset.y = b;
  gameBg.append(portal1);
  gameBg.append(portal2);
  portals.push(portal1);
  portals.push(portal2);
}

function createPortal() {
  let portal1 = document.createElement("div");
  let portal2 = document.createElement("div");
  let noOFObsatcles = (PercentOfObstacles * DIMENSIONS) / 100;
  let obs = [`${snakeHead.dataset.x},${snakeHead.dataset.y}`];
  if (coopPlay) {
    obs.push(`${snakeHead2.dataset.x},${snakeHead2.dataset.y}`);
  }
  for (let i = 0; i < obstacles.length; i++) {
    obs.push(`${obstacles[i].dataset.x},${obstacles[i].dataset.y}`);
  }
  let x = Math.floor(Math.random() * DIMENSIONS);
  let y = Math.floor(Math.random() * DIMENSIONS);
  while (
    obs.includes(`${x},${y}`) ||
    x == 0 ||
    y == 0 ||
    x == DIMENSIONS - 1 ||
    y == DIMENSIONS - 1
  ) {
    x = Math.floor(Math.random() * DIMENSIONS);
    y = Math.floor(Math.random() * DIMENSIONS);
  }
  obs.push(`${x},${y}`);
  let a = Math.floor(Math.random() * DIMENSIONS);
  let b = Math.floor(Math.random() * DIMENSIONS);
  while (
    obs.includes(`${a},${b}`) ||
    a == 0 ||
    b == 0 ||
    a == DIMENSIONS - 1 ||
    b == DIMENSIONS - 1
  ) {
    a = Math.floor(Math.random() * DIMENSIONS);
    b = Math.floor(Math.random() * DIMENSIONS);
  }
  portal1.classList.add("portal");
  portal2.classList.add("portal");
  portal1.style.width = `${pixelSize}px`;
  portal1.style.height = `${pixelSize}px`;
  portal1.style.top = `${y * pixelSize}px`;
  portal1.style.left = `${x * pixelSize}px`;
  portal1.dataset.x = x;
  portal1.dataset.y = y;
  portal1.dataset.teleportX = a;
  portal1.dataset.teleportY = b;
  portal2.style.width = `${pixelSize}px`;
  portal2.style.height = `${pixelSize}px`;
  portal2.style.top = `${b * pixelSize}px`;
  portal2.style.left = `${a * pixelSize}px`;
  portal2.dataset.teleportX = x;
  portal2.dataset.teleportY = y;
  portal2.dataset.x = a;
  portal2.dataset.y = b;
  gameBg.append(portal1);
  gameBg.append(portal2);
  portals.push(portal1);
  portals.push(portal2);
}

function reset(
  all = false,
  state = {
    dimension: DIMENSIONS,
    snake: [],
    oldSnake: [],
    dirX: 0,
    dirY: 0,
    obstacles: [],
    letters: [],
    speed: SPEED,
    curTime: 0,
    portals: [],
    score: 0,
    index: 0,
    curPosX: Math.floor(Math.random() * DIMENSIONS),
    curPosY: Math.floor(Math.random() * DIMENSIONS),
    snakeHead: undefined,
    lives: LIVES,
    oldDirX: 0,
    oldDirY: 0,
    load: false,
  },
  coop = false
) {
  DIMENSIONS = state.dimension;
  go.classList.add("hide");
  delayed = false;
  if (coop) {
    coopPlay = true;
    gameBg.innerHTML = `<div class="snake"></div><div class="snake2"></div><div class="time2">00:00</div>`;
  } else {
    coopPlay = false;
    gameBg.innerHTML = `<div class="snake"></div><div class="time2">00:00</div>`;
  }
  setTimeout(() => {
    delayed = true;
  }, 500);
  paused = false;
  pixelSize = gameBg.getBoundingClientRect().height / DIMENSIONS;
  letters = [];
  wordCreated = false;
  index = state.index;
  if (state.load) {
    state.letters.map((coord, i) => {
      const ele = document.createElement("div");
      ele.classList.add("word");
      ele.textContent = state.word[i + index].toUpperCase();
      let X = coord[0];
      let Y = coord[1];
      ele.dataset.x = X;
      ele.dataset.y = Y;
      ele.style.height = `${pixelSize}px`;
      ele.style.width = `${pixelSize}px`;
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
    });
    currentWord = state.word;
    text.innerHTML = `<span class="colorTextGreen">${currentWord
      .toUpperCase()
      .slice(0, index)}</span>${currentWord
      .toUpperCase()
      .slice(index, currentWord.length)}`;
    wordCreated = true;
  }
  powers = [];
  //   save.classList.add("disabled");
  speed = SPEED;
  document
    .querySelector(":root")
    .style.setProperty("--transition", `${1000 / speed}ms`);
  dirX = state.dirX;
  dirY = state.dirY;
  if (coop) {
    dirX2 = 0;
    dirY2 = 0;
  }
  oldDirX = 0;
  oldDirY = 0;
  oldDirX2 = 0;
  oldDirY2 = 0;
  for (let i = 0; i < oldSnake.length; i++) {
    if (oldSnake[i].parentNode) {
      oldSnake[i].parentNode.removeChild(oldSnake[i]);
    }
  }
  for (let i = 0; i < oldSnake2.length; i++) {
    if (oldSnake2[i].parentNode) {
      oldSnake2[i].parentNode.removeChild(oldSnake2[i]);
    }
  }
  oldSnake = createSnakeBody(state.oldSnake);
  if (state.oldSnake2 && coop) {
    oldSnake2 = createSnakeBody2(state.oldSnake2);
  } else if (coop) {
    oldSnake2 = [];
  }
  snakeHead = document.querySelector(".snake");
  snakeHead.style.height = `${pixelSize}px`;
  snakeHead.style.width = `${pixelSize}px`;
  if (coop) {
    snakeHead2 = document.querySelector(".snake2");
    snakeHead2.style.height = `${pixelSize}px`;
    snakeHead2.style.width = `${pixelSize}px`;
  }
  time2 = document.querySelector(".time2");
  started = false;
  moved = false;
  moved2 = false;
  portals.splice(0, portals.length);
  for (let i = 0; i < movingObstacle.length; i++) {
    if (movingObstacle[i].parentNode)
      movingObstacle[i].parentNode.removeChild(movingObstacle[i]);
  }
  for (let i = 0; i < snake.length; i++) {
    if (snake[i]?.parentNode) {
      snake[i].parentNode.removeChild(snake[i]);
    }
  }
  if (coop) {
    for (let i = 0; i < snake2.length; i++) {
      if (snake2[i]) {
        if (snake2[i].parentNode) {
          snake2[i].parentNode.removeChild(snake2[i]);
        }
      }
    }
  }
  movingObstacle = [];
  snake = [
    snakeHead,
    ...createSnakeBody(state.snake.slice(1, state.snake.length)),
  ];
  if (coop && state.snake2) {
    snake2 = [
      snakeHead2,
      ...createSnakeBody2(state.snake2.slice(1, state.snake2.length)),
    ];
  } else if (coop) {
    snake2 = [snakeHead2];
  }
  let curPosX = state.curPosX;
  let curPosY = state.curPosY;
  snakeHead.dataset.x = curPosX;
  snakeHead.dataset.y = curPosY;
  snakeHead.style.top = `${curPosY * pixelSize}px`;
  snakeHead.style.left = `${curPosX * pixelSize}px`;
  if (state.curPosX2 && state.curPosY2) {
    snakeHead2.dataset.x = parseInt(state.curPosX2);
    snakeHead2.dataset.y = parseInt(state.curPosY2);
    snakeHead2.style.top = `${parseInt(state.curPosY2) * pixelSize}px`;
    snakeHead2.style.left = `${parseInt(state.curPosX2) * pixelSize}px`;
  } else if (coop) {
    let x = Math.floor(Math.random() * DIMENSIONS);
    let y = Math.floor(Math.random() * DIMENSIONS);
    while (x == curPosX && y == curPosY) {
      x = Math.floor(Math.random() * DIMENSIONS);
      y = Math.floor(Math.random() * DIMENSIONS);
    }
    snakeHead2.dataset.x = x;
    snakeHead2.dataset.y = y;
    snakeHead2.style.top = `${y * pixelSize}px`;
    snakeHead2.style.left = `${x * pixelSize}px`;
  }
  if (state.load) {
    placeObstacle(state.obstacles);
    placePortal(state.portals);
    placeMovingObstacle(state.movingObstacle);
  } else {
    createObstacle();
    createPortal();
    createMovingObstacle();
  }

  clearInterval(interval);
  curTime = state.curTime;
  time.textContent = `${String(
    Math.floor((maxTime - state.curTime) / 60)
  ).padStart(2, "0")}:${String(
    Math.floor((maxTime - state.curTime) % 60)
  ).padStart(2, "0")}`;
  time2.textContent = `${String(
    Math.floor((maxTime - state.curTime) / 60)
  ).padStart(2, "0")}:${String(
    Math.floor((maxTime - state.curTime) % 60)
  ).padStart(2, "0")}`;

  //   Array.from(document.querySelectorAll(".snake-body")).forEach((ele) => {
  //     if (!snake.includes(ele)) {
  //       ele.parentElement.removeChild(ele);
  //     }
  //   });

  gameoverCollide = false;
  spikeCollide();
  if (all) {
    score = state.score;
    scoreEle.textContent = score;
    // save.classList.add("disabled");
    lives = state.lives;
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

save.addEventListener("click", (e) => {
  //   if (started) {
  document.querySelector(".v2").classList.remove("hide");
  document.querySelector(".main-menu").classList.add("hide");
  // let gameState = {
  //   snake: snake.map((ele) => [
  //     parseInt(ele.dataset.x),
  //     parseInt(ele.dataset.y),
  //   ]),
  //   oldSnake: oldSnake.map((ele) => [
  //     parseInt(ele.dataset.x),
  //     parseInt(ele.dataset.y),
  //   ]),
  //   dirX,
  //   dirY,
  //   obstacles: obstacles.map((ele) => [
  //     parseInt(ele.dataset.x),
  //     parseInt(ele.dataset.y),
  //   ]),
  //   letters: letters.map((ele) => [
  //     parseInt(ele.dataset.x),
  //     parseInt(ele.dataset.y),
  //   ]),
  //   speed,
  //   portals: portals.map((ele) => [
  //     parseInt(ele.dataset.x),
  //     parseInt(ele.dataset.y),
  //   ]),
  //   curTime,
  //   score,
  //   word: currentWord,
  //   curPosX: parseInt(snakeHead.dataset.x),
  //   curPosY: parseInt(snakeHead.dataset.y),
  //   snakeHead: [parseInt(snakeHead.dataset.x), parseInt(snakeHead.dataset.y)],
  //   lives: lives,
  //   index,
  //   oldDirX,
  //   oldDirY,
  //   load: true,
  // };
  // console.log(gameState);
  // localStorage.setItem("state", JSON.stringify(gameState));
  //   }
});

Array.from(document.querySelectorAll(".slot")).forEach((ele, i_) => {
  let state = JSON.parse(localStorage.getItem(`state${i_}`));
  if (!state) {
    ele.classList.add("free");
  } else {
    ele.classList.remove("free");
  }
  return ele.addEventListener("click", (e) => {
    let gameState = {
      snake: snake.map((ele) => [
        parseInt(ele.dataset.x),
        parseInt(ele.dataset.y),
      ]),
      oldSnake: oldSnake.map((ele) => [
        parseInt(ele.dataset.x),
        parseInt(ele.dataset.y),
      ]),
      dimension: DIMENSIONS,
      dirX,
      dirY,
      obstacles: obstacles.map((ele) => [
        parseInt(ele.dataset.x),
        parseInt(ele.dataset.y),
      ]),
      letters: letters.map((ele) => [
        parseInt(ele.dataset.x),
        parseInt(ele.dataset.y),
      ]),
      speed,
      portals: portals.map((ele) => [
        parseInt(ele.dataset.x),
        parseInt(ele.dataset.y),
      ]),
      curTime,
      movingObstacle: movingObstacle.map((ele) => {
        return {
          x: ele.dataset.x,
          y: ele.dataset.y,
          height: ele.dataset.height,
          width: ele.dataset.width,
          top: ele.dataset.top,
          left: ele.dataset.left,
          orgX: ele.dataset.orgX,
          orgY: ele.dataset.orgY,
          dir: ele.dataset.dir,
          movDir: ele.dataset.movDir,
          blocks: ele.dataset.blocks,
          travelled: ele.dataset.travelled,
        };
      }),
      score,
      word: currentWord,
      curPosX: parseInt(snakeHead.dataset.x),
      curPosY: parseInt(snakeHead.dataset.y),
      snakeHead: [parseInt(snakeHead.dataset.x), parseInt(snakeHead.dataset.y)],
      lives: lives,
      index,
      oldDirX,
      oldDirY,
      load: true,
    };
    localStorage.setItem(`state${i_}`, JSON.stringify(gameState));
    Array.from(document.querySelectorAll(".load"))[i_].classList.remove(
      "disabled"
    );
    Array.from(document.querySelectorAll(".sec"))[i_].classList.remove(
      "disabled-tile"
    );
    // Array.from(document.querySelectorAll(".load"))[i_].classList.remove(
    //   "disabled-tile"
    // );
    e.target.parentElement.classList.remove("free");
    document.querySelector(".v2").classList.add("hide");
    document.querySelector(".main-menu").classList.remove("hide");
    menu.classList.add("hide");
    click.play();
    if (started) {
      gameBgm.play();
    }
    paused = false;
    setting.querySelector("img").classList.remove("onclick");
  });
});

Array.from(document.querySelectorAll(".load")).forEach((ele, i_) => {
  let state = JSON.parse(localStorage.getItem(`state${i_}`));
  if (!state) {
    ele.classList.add("disabled");
  } else {
    ele.classList.remove("disabled");
  }
  return ele.addEventListener("click", (e) => {
    let state = JSON.parse(localStorage.getItem(`state${i_}`));
    if (state) reset(true, state);
    document.querySelector(".load-menu").classList.add("hide");
    document.querySelector(".main-menu").classList.remove("hide");
    menu.classList.add("hide");
    click.play();
    if (started) {
      gameBgm.play();
    }
    paused = false;
    setting.querySelector("img").classList.remove("onclick");
  });
});

load.addEventListener("click", (e) => {
  document.querySelector(".load-menu").classList.remove("hide");
  document.querySelector(".main-menu").classList.add("hide");
});

restart.addEventListener("click", (e) => {
  click.play();
  gameBgm.currentTime = 0;
  menu.classList.add("hide");
  resume.classList.remove("disabled");
  setting.querySelector("img").classList.remove("onclick");
  reset(
    true,
    {
      dimension: DIMENSIONS,
      snake: [],
      oldSnake: [],
      dirX: 0,
      dirY: 0,
      obstacles: [],
      letters: [],
      speed: SPEED,
      curTime: 0,
      portals: [],
      score: 0,
      index: 0,
      curPosX: Math.floor(Math.random() * DIMENSIONS),
      curPosY: Math.floor(Math.random() * DIMENSIONS),
      snakeHead: undefined,
      lives: LIVES,
      oldDirX: 0,
      oldDirY: 0,
      load: false,
    },
    coopPlay
  );
});

function CheckGameOver() {
  let top = parseInt(snakeHead.dataset.y);
  let left = parseInt(snakeHead.dataset.x);
  if (top < 0) {
    snakeHead.style.top = 0;
    return true;
  } else if (top >= DIMENSIONS) {
    snakeHead.style.top = `${height - height / DIMENSIONS}px`;
    return true;
  }
  if (left < 0) {
    snakeHead.style.left = 0;
    return true;
  } else if (left >= DIMENSIONS) {
    snakeHead.style.left = `${height - height / DIMENSIONS}px`;
    return true;
  }
  if (coopPlay) {
    let top = parseInt(snakeHead2.dataset.y);
    let left = parseInt(snakeHead2.dataset.x);
    if (top < 0) {
      snakeHead2.style.top = 0;
      return true;
    } else if (top >= DIMENSIONS) {
      snakeHead2.style.top = `${height - height / DIMENSIONS}px`;
      return true;
    }
    if (left < 0) {
      snakeHead2.style.left = 0;
      return true;
    } else if (left >= DIMENSIONS) {
      snakeHead2.style.left = `${height - height / DIMENSIONS}px`;
      return true;
    }
  }

  if (curTime >= maxTime) return true;
  let game = gameBg.getBoundingClientRect();
  for (let i = 0; i < obstacles.length; i++) {
    if (elementsOverlap(snakeHead, obstacles[i])) {
      snakeHead.style.top = `${
        parseInt(snakeHead.style.top) + 1 * dirY * pixelSize
      }px`;
      snakeHead.style.left = `${
        parseInt(snakeHead.style.left) + -1 * dirX * pixelSize
      }px`;
      dirX = 0;
      dirY = 0;
      dirX2 = 0;
      dirY2 = 0;
      return true;
    }
    if (coopPlay && elementsOverlap(snakeHead2, obstacles[i])) {
      snakeHead2.style.top = `${
        parseInt(snakeHead2.style.top) + 1 * dirY * pixelSize
      }px`;
      snakeHead2.style.left = `${
        parseInt(snakeHead2.style.left) + -1 * dirX * pixelSize
      }px`;
      dirX = 0;
      dirY = 0;
      dirX2 = 0;
      dirY2 = 0;
      return true;
    }
  }

  for (let i = 3; i < snake.length; i++) {
    if (elementsOverlap(snake[i], snakeHead)) return true;
  }
  if (coopPlay) {
    for (let i = 3; i < snake2.length; i++) {
      if (elementsOverlap(snake2[i], snakeHead2)) return true;
    }
    for (let i = 0; i < snake.length; i++) {
      for (let j = 0; j < snake2.length; j++) {
        if (elementsOverlap(snake[i], snake2[j])) return true;
      }
    }
  }
  for (let i = 0; i < oldSnake.length; i++) {
    if (elementsOverlap(snakeHead, oldSnake[i])) return true;
  }
  if (coopPlay) {
    for (let i = 0; i < oldSnake2.length; i++) {
      if (elementsOverlap(snakeHead2, oldSnake2[i])) return true;
    }
    for (let i = 0; i < oldSnake2.length; i++) {
      if (elementsOverlap(snakeHead, oldSnake2[i])) return true;
    }
    for (let i = 0; i < oldSnake.length; i++) {
      if (elementsOverlap(snakeHead2, oldSnake[i])) return true;
    }
  }

  return gameoverCollide || false;
}

function spikeCollide() {
  for (let i = 0; i < snake.length; i++) {
    for (let j = 0; j < movingObstacle.length; j++) {
      let object_1 = snake[i].getBoundingClientRect();
      let object_2 = movingObstacle[j].getBoundingClientRect();
      if (
        object_1.left < object_2.left + object_2.width &&
        object_1.left + object_1.width > object_2.left &&
        object_1.top < object_2.top + object_2.height &&
        object_1.top + object_1.height > object_2.top
      ) {
        gameoverCollide = true;
        return;
      }
    }
  }
  for (let i = 0; i < oldSnake.length; i++) {
    for (let j = 0; j < movingObstacle.length; j++) {
      let object_1 = oldSnake[i].getBoundingClientRect();
      let object_2 = movingObstacle[j].getBoundingClientRect();
      if (
        object_1.left < object_2.left + object_2.width &&
        object_1.left + object_1.width > object_2.left &&
        object_1.top < object_2.top + object_2.height &&
        object_1.top + object_1.height > object_2.top
      ) {
        gameoverCollide = true;
        return;
      }
    }
  }
  if (coopPlay) {
    for (let i = 0; i < snake2.length; i++) {
      for (let j = 0; j < movingObstacle.length; j++) {
        let object_1 = snake2[i].getBoundingClientRect();
        let object_2 = movingObstacle[j].getBoundingClientRect();
        if (
          object_1.left < object_2.left + object_2.width &&
          object_1.left + object_1.width > object_2.left &&
          object_1.top < object_2.top + object_2.height &&
          object_1.top + object_1.height > object_2.top
        ) {
          gameoverCollide = true;
          return;
        }
      }
    }
    for (let i = 0; i < oldSnake2.length; i++) {
      for (let j = 0; j < movingObstacle.length; j++) {
        let object_1 = oldSnake2[i].getBoundingClientRect();
        let object_2 = movingObstacle[j].getBoundingClientRect();
        if (
          object_1.left < object_2.left + object_2.width &&
          object_1.left + object_1.width > object_2.left &&
          object_1.top < object_2.top + object_2.height &&
          object_1.top + object_1.height > object_2.top
        ) {
          gameoverCollide = true;
          return;
        }
      }
    }
  }
  window.requestAnimationFrame(spikeCollide);
}

function gameLoop() {
  if (!paused) {
    for (let i = 0; i < powers.length; i++) {
      if (elementsOverlap(snakeHead, powers[i][0])) {
        powers[i][1].do(0);
        powers[i][0].parentNode.removeChild(powers[i][0]);
        power.play();
        powers.splice(i, 1);
      }
    }

    if (coopPlay) {
      for (let i = 0; i < powers.length; i++) {
        if (elementsOverlap(snakeHead2, powers[i][0])) {
          powers[i][1].do(1);
          powers[i][0].parentNode.removeChild(powers[i][0]);
          power.play();
          powers.splice(i, 1);
        }
      }
    }
    if (maxTime - curTime <= 15) {
      time.style.color = `#f40009`;
      time2.style.color = `#f40009`;
    } else {
      time.style.color = `white`;
      time2.style.color = `white`;
    }

    if (obstacles.length == 0) {
      createObstacle();
    }
    if (portals.length == 0) {
      createPortal();
    }
    if (movingObstacle.length == 0) {
      createMovingObstacle();
    } else {
      for (let i = 0; i < movingObstacle.length; i++) {
        if (!gameoverCollide) {
          if (
            parseInt(movingObstacle[i].dataset.travelled) <=
            parseInt(movingObstacle[i].dataset.blocks)
          ) {
            movingObstacle[i].style.top = `${
              parseInt(movingObstacle[i].style.top) +
              (parseInt(movingObstacle[i].dataset.dir) == 0 ? 1 : 0) *
                1 *
                parseInt(movingObstacle[i].dataset.movDir) *
                pixelSize
            }px`;
            movingObstacle[i].style.left = `${
              parseInt(movingObstacle[i].style.left) +
              (parseInt(movingObstacle[i].dataset.dir) == 0 ? 0 : 1) *
                1 *
                parseInt(movingObstacle[i].dataset.movDir) *
                pixelSize
            }px`;
            movingObstacle[i].dataset.y = `${
              parseInt(movingObstacle[i].dataset.y) +
              (parseInt(movingObstacle[i].dataset.dir) == 0 ? 1 : 0) *
                1 *
                parseInt(movingObstacle[i].dataset.movDir)
            }`;
            movingObstacle[i].dataset.x = `${
              parseInt(movingObstacle[i].dataset.x) +
              (parseInt(movingObstacle[i].dataset.dir) == 0 ? 0 : 1) *
                1 *
                parseInt(movingObstacle[i].dataset.movDir)
            }`;
            movingObstacle[i].dataset.travelled =
              parseInt(movingObstacle[i].dataset.travelled) + 1;
          } else {
            movingObstacle[i].dataset.movDir =
              -1 * parseInt(movingObstacle[i].dataset.movDir);
            movingObstacle[i].dataset.travelled = 0;
          }
        }
      }
    }

    if (!wordCreated) {
      let word = wordList[Math.floor(Math.random() * wordList.length)];
      currentWord = word;
      index = 0;
      text.innerHTML = currentWord.toUpperCase();
      createWord(word.toUpperCase());
    } else {
      for (let i = 0; i < letters.length; i++) {
        if (letters[i] && elementsOverlap(letters[i], snakeHead)) {
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
        if (coopPlay && letters[i] && elementsOverlap(letters[i], snakeHead2)) {
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
            increaseSnakeSize2();
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
            increaseSnakeSize2(2);
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
    if (oldSnake.length != 0 && started && !gameoverCollide) {
      for (let i = oldSnake.length - 1; i > 0; i--) {
        oldSnake[i].style.top = `${parseInt(oldSnake[i - 1].style.top)}px`;
        oldSnake[i].style.left = `${parseInt(oldSnake[i - 1].style.left)}px`;
        oldSnake[i].dataset.x = oldSnake[i - 1].dataset.x;
        oldSnake[i].dataset.y = oldSnake[i - 1].dataset.y;
      }
      let clone = [
        snake[snake.length - 1].style.top,
        snake[snake.length - 1].style.left,
      ];
      let ele = document.createElement("div");

      oldSnake[0].parentElement.removeChild(oldSnake[0]);
      oldSnake.shift();
      ele.style.height = `${pixelSize}px`;
      ele.style.width = `${pixelSize}px`;
      ele.dataset.x = snake[snake.length - 1].dataset.x;
      ele.dataset.y = snake[snake.length - 1].dataset.y;
      ele.style.top = clone[0];
      ele.style.left = clone[1];
      ele.classList.add("snake-body");
      gameBg.append(ele);
      snake.push(ele);
    }
    if (oldSnake2.length != 0 && started && !gameoverCollide && coopPlay) {
      for (let i = oldSnake2.length - 1; i > 0; i--) {
        oldSnake2[i].style.top = `${parseInt(oldSnake2[i - 1].style.top)}px`;
        oldSnake2[i].style.left = `${parseInt(oldSnake2[i - 1].style.left)}px`;
        oldSnake2[i].dataset.x = oldSnake2[i - 1].dataset.x;
        oldSnake2[i].dataset.y = oldSnake2[i - 1].dataset.y;
      }
      let clone = [
        snake2[snake2.length - 1].style.top,
        snake2[snake2.length - 1].style.left,
      ];
      let ele = document.createElement("div");

      oldSnake2[0].parentElement.removeChild(oldSnake2[0]);
      oldSnake2.shift();
      ele.style.height = `${pixelSize}px`;
      ele.style.width = `${pixelSize}px`;
      ele.dataset.x = snake2[snake2.length - 1].dataset.x;
      ele.dataset.y = snake2[snake2.length - 1].dataset.y;
      ele.style.top = clone[0];
      ele.style.left = clone[1];
      ele.classList.add("snake-body2");
      gameBg.append(ele);
      snake2.push(ele);
    }
    for (let i = 0; i < portals.length; i++) {
      if (elementsOverlap(snakeHead, portals[i])) {
        if (oldSnake.length != 0) {
          if (score > highScore) {
            highScore = score;
            highScoreEle.textContent = highScore;
            localStorage.setItem("highScore", highScore);
          }
          // started = false;
          time.textContent = `00:00`;
          time2.textContent = `00:00`;
          clearInterval(interval);
          lives--;
          let hearts = Array.from(heart.querySelectorAll(".heartContent"));
          hearts[lives].classList.add("blinking");
          if (lives > 0) {
            hiss.play();
            paused = true;
            setTimeout(() => {
              paused = false;
              reset();
            }, 300);
          } else {
            gameBgm.pause();
            gameBgm.currentTime = 0;
            goAudio.play();
            document.querySelector(".go-score-val").textContent = score;
            go.classList.remove("hide");
            waitingToRestart = true;
            return;
          }
        }

        oldDirX = dirX;
        oldDirY = dirY;
        oldSnake = [...snake.slice(1)];
        snakeHead.parentElement.removeChild(snakeHead);
        snake.splice(0, 1);
        let ele = document.createElement("div");
        ele.classList.add("snake");
        // ele.classList.add("snakeMove");
        ele.style.height = `${pixelSize}px`;
        ele.style.width = `${pixelSize}px`;
        ele.dataset.x = parseInt(portals[i].dataset.teleportX);
        ele.dataset.y = parseInt(portals[i].dataset.teleportY);
        ele.style.top = `${
          parseInt(portals[i].dataset.teleportY) * pixelSize
        }px`;
        ele.style.left = `${
          parseInt(portals[i].dataset.teleportX) * pixelSize
        }px`;
        root.style.setProperty(
          "--fromX",
          `${parseInt(portals[i].dataset.teleportX) * pixelSize}px`
        );
        root.style.setProperty(
          "--fromY",
          `${parseInt(portals[i].dataset.teleportY) * pixelSize}px`
        );
        gameBg.append(ele);
        snake = [ele];
        snakeHead = ele;
        portaled = true;
        break;
      }
      if (coopPlay && elementsOverlap(snakeHead2, portals[i])) {
        if (oldSnake2.length != 0) {
          if (score > highScore) {
            highScore = score;
            highScoreEle.textContent = highScore;
            localStorage.setItem("highScore", highScore);
          }
          // started = false;
          time.textContent = `00:00`;
          time2.textContent = `00:00`;
          clearInterval(interval);
          lives--;
          let hearts = Array.from(heart.querySelectorAll(".heartContent"));
          hearts[lives].classList.add("blinking");
          if (lives > 0) {
            hiss.play();
            paused = true;
            setTimeout(() => {
              paused = false;
              reset();
            }, 300);
          } else {
            gameBgm.pause();
            gameBgm.currentTime = 0;
            goAudio.play();
            document.querySelector(".go-score-val").textContent = score;
            go.classList.remove("hide");
            waitingToRestart = true;
            return;
          }
        }

        oldDirX2 = dirX2;
        oldDirY2 = dirY2;
        oldSnake2 = [...snake2.slice(1)];
        snakeHead2.parentElement.removeChild(snakeHead2);
        snake2.splice(0, 1);
        let ele = document.createElement("div");
        ele.classList.add("snake2");
        // ele.classList.add("snakeMove");
        ele.style.height = `${pixelSize}px`;
        ele.style.width = `${pixelSize}px`;
        ele.dataset.x = parseInt(portals[i].dataset.teleportX);
        ele.dataset.y = parseInt(portals[i].dataset.teleportY);
        ele.style.top = `${
          parseInt(portals[i].dataset.teleportY) * pixelSize
        }px`;
        ele.style.left = `${
          parseInt(portals[i].dataset.teleportX) * pixelSize
        }px`;
        root.style.setProperty(
          "--fromX2",
          `${parseInt(portals[i].dataset.teleportX) * pixelSize}px`
        );
        root.style.setProperty(
          "--fromY2",
          `${parseInt(portals[i].dataset.teleportY) * pixelSize}px`
        );
        gameBg.append(ele);
        snake2 = [ele];
        snakeHead2 = ele;
        portaled2 = true;
        break;
      }
    }
    if (started && !gameoverCollide) {
      for (let i = snake.length - 1; i > 0; i--) {
        snake[i].style.top = `${parseInt(snake[i - 1].style.top)}px`;
        snake[i].style.left = `${parseInt(snake[i - 1].style.left)}px`;
        snake[i].dataset.x = snake[i - 1].dataset.x;
        snake[i].dataset.y = snake[i - 1].dataset.y;
      }
      if (coopPlay) {
        for (let i = snake2.length - 1; i > 0; i--) {
          snake2[i].style.top = `${parseInt(snake2[i - 1].style.top)}px`;
          snake2[i].style.left = `${parseInt(snake2[i - 1].style.left)}px`;
          snake2[i].dataset.x = snake2[i - 1].dataset.x;
          snake2[i].dataset.y = snake2[i - 1].dataset.y;
        }
      }
    }
    root.style.setProperty(
      "--toX",
      `${parseInt(snakeHead.style.left) + 1 * pixelSize * dirX}px`
    );
    root.style.setProperty(
      "--toY",
      `${parseInt(snakeHead.style.top) + 1 * pixelSize * dirY * -1}px`
    );
    if (coopPlay) {
      root.style.setProperty(
        "--toX2",
        `${parseInt(snakeHead2.style.left) + 1 * pixelSize * dirX}px`
      );
      root.style.setProperty(
        "--toY2",
        `${parseInt(snakeHead2.style.top) + 1 * pixelSize * dirY * -1}px`
      );
    }
    if (portaled) {
      snakeHead.classList.add("moveSnake");
      portaled = false;
    } else {
      //   snakeHead.classList.remove("snakeMove");
    }
    if (portaled2 && coopPlay) {
      snakeHead2.classList.add("moveSnake2");
      portaled2 = false;
    } else {
      //   snakeHead.classList.remove("snakeMove");
    }
    if (started && !gameoverCollide) {
      snakeHead.dataset.x = parseInt(snakeHead.dataset.x) + 1 * dirX;
      snakeHead.dataset.y = parseInt(snakeHead.dataset.y) + -1 * dirY;
      snakeHead.style.top = `${
        parseInt(snakeHead.style.top) + 1 * pixelSize * dirY * -1
      }px`;
      snakeHead.style.left = `${
        parseInt(snakeHead.style.left) + 1 * pixelSize * dirX
      }px`;
    }
    if (coopPlay && started && !gameoverCollide) {
      snakeHead2.dataset.x = parseInt(snakeHead2.dataset.x) + 1 * dirX2;
      snakeHead2.dataset.y = parseInt(snakeHead2.dataset.y) + -1 * dirY2;
      snakeHead2.style.top = `${
        parseInt(snakeHead2.style.top) + 1 * pixelSize * dirY2 * -1
      }px`;
      snakeHead2.style.left = `${
        parseInt(snakeHead2.style.left) + 1 * pixelSize * dirX2
      }px`;
    }
    moved = true;
    moved2 = true;
    if (CheckGameOver()) {
      curTime = 0;
      if (score > highScore) {
        highScore = score;
        highScoreEle.textContent = highScore;
        localStorage.setItem("highScore", highScore);
      }
      // started = false;
      time.textContent = `00:00`;
      time2.textContent = `00:00`;
      clearInterval(interval);
      lives--;
      let hearts = Array.from(heart.querySelectorAll(".heartContent"));
      hearts[lives].classList.add("blinking");
      if (lives > 0) {
        hiss.play();
        gameoverCollide = false;
        paused = true;
        setTimeout(() => {
          paused = false;
          reset(
            false,
            {
              dimension: DIMENSIONS,
              snake: [],
              oldSnake: [],
              dirX: 0,
              dirY: 0,
              obstacles: [],
              letters: [],
              speed: SPEED,
              curTime: 0,
              portals: [],
              score: 0,
              index: 0,
              curPosX: Math.floor(Math.random() * DIMENSIONS),
              curPosY: Math.floor(Math.random() * DIMENSIONS),
              snakeHead: undefined,
              lives: LIVES,
              oldDirX: 0,
              oldDirY: 0,
              load: false,
            },
            coopPlay
          );
        }, 300);
      } else {
        gameBgm.pause();
        gameoverCollide = false;
        gameBgm.currentTime = 0;
        goAudio.play();
        document.querySelector(".go-score-val").textContent = score;
        go.classList.remove("hide");
        waitingToRestart = true;
        return;
      }
    }
  }
  setTimeout(() => window.requestAnimationFrame(gameLoop), 1000 / speed);
}
reset(true, gameState);
gameLoop();
spikeCollide();
window.onresize = () => {
  if (coopPlay) {
    reset(
      true,
      {
        snake: snake.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        snake2: snake2.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        oldSnake: oldSnake.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        oldSnake2: oldSnake2.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        dimension: DIMENSIONS,
        dirX,
        dirY,
        movingObstacle: movingObstacle.map((ele) => {
          return {
            x: ele.dataset.x,
            y: ele.dataset.y,
            height: ele.dataset.height,
            width: ele.dataset.width,
            top: ele.dataset.top,
            left: ele.dataset.left,
            orgX: ele.dataset.orgX,
            orgY: ele.dataset.orgY,
            dir: ele.dataset.dir,
            movDir: ele.dataset.movDir,
            blocks: ele.dataset.blocks,
            travelled: ele.dataset.travelled,
          };
        }),
        obstacles: obstacles.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        letters: letters.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        speed,
        portals: portals.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        curTime,
        score,
        word: currentWord,
        curPosX: parseInt(snakeHead.dataset.x),
        curPosY: parseInt(snakeHead.dataset.y),
        curPosX2: parseInt(snakeHead2.dataset.x),
        curPosY2: parseInt(snakeHead2.dataset.y),
        snakeHead: [
          parseInt(snakeHead.dataset.x),
          parseInt(snakeHead.dataset.y),
        ],
        lives: lives,
        index,
        oldDirX,
        oldDirY,
        load: true,
      },
      coopPlay
    );
  } else {
    reset(
      true,
      {
        snake: snake.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        oldSnake: oldSnake.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        dimension: DIMENSIONS,
        dirX,
        dirY,
        movingObstacle: movingObstacle.map((ele) => {
          return {
            x: ele.dataset.x,
            y: ele.dataset.y,
            height: ele.dataset.height,
            width: ele.dataset.width,
            top: ele.dataset.top,
            left: ele.dataset.left,
            orgX: ele.dataset.orgX,
            orgY: ele.dataset.orgY,
            dir: ele.dataset.dir,
            movDir: ele.dataset.movDir,
            blocks: ele.dataset.blocks,
            travelled: ele.dataset.travelled,
          };
        }),
        obstacles: obstacles.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        letters: letters.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        speed,
        portals: portals.map((ele) => [
          parseInt(ele.dataset.x),
          parseInt(ele.dataset.y),
        ]),
        curTime,
        score,
        word: currentWord,
        curPosX: parseInt(snakeHead.dataset.x),
        curPosY: parseInt(snakeHead.dataset.y),
        snakeHead: [
          parseInt(snakeHead.dataset.x),
          parseInt(snakeHead.dataset.y),
        ],
        lives: lives,
        index,
        oldDirX,
        oldDirY,
        load: true,
      },
      false
    );
  }
};

document.querySelector("#exit").addEventListener("click", () => {
  click.play();
  menu.classList.add("hide");
  let gameState = {
    snake: snake.map((ele) => [
      parseInt(ele.dataset.x),
      parseInt(ele.dataset.y),
    ]),
    oldSnake: oldSnake.map((ele) => [
      parseInt(ele.dataset.x),
      parseInt(ele.dataset.y),
    ]),
    dimension: DIMENSIONS,
    dirX,
    dirY,
    obstacles: obstacles.map((ele) => [
      parseInt(ele.dataset.x),
      parseInt(ele.dataset.y),
    ]),
    letters: letters.map((ele) => [
      parseInt(ele.dataset.x),
      parseInt(ele.dataset.y),
    ]),
    speed,
    portals: portals.map((ele) => [
      parseInt(ele.dataset.x),
      parseInt(ele.dataset.y),
    ]),
    curTime,
    movingObstacle: movingObstacle.map((ele) => {
      return {
        x: ele.dataset.x,
        y: ele.dataset.y,
        height: ele.dataset.height,
        width: ele.dataset.width,
        top: ele.dataset.top,
        left: ele.dataset.left,
        orgX: ele.dataset.orgX,
        orgY: ele.dataset.orgY,
        dir: ele.dataset.dir,
        movDir: ele.dataset.movDir,
        blocks: ele.dataset.blocks,
        travelled: ele.dataset.travelled,
      };
    }),
    score,
    word: currentWord,
    curPosX: parseInt(snakeHead.dataset.x),
    curPosY: parseInt(snakeHead.dataset.y),
    snakeHead: [parseInt(snakeHead.dataset.x), parseInt(snakeHead.dataset.y)],
    lives: lives,
    index,
    oldDirX,
    oldDirY,
    load: true,
  };
  if (!coopPlay && lives > 0) {
    localStorage.setItem(`state-accident`, JSON.stringify(gameState));
  }
  if (!localStorage.getItem(`state-accident`)) {
    document.querySelector("#continue").classList.add("disabled-tile");
  }
  reset(true);
  createStars();
  mainAudio.play();
  document.querySelector(".bg").classList.remove("hide");
});

document.querySelector("#new").addEventListener("click", () => {
  click.play();
  if (started) {
    gameBgm.play();
  }
  reset();
  paused = false;
  deleteStars();
  setting.querySelector("img").classList.remove("onclick");
  menu.classList.add("hide");
  mainAudio.pause();
  document.querySelector(".bg").classList.add("hide");
});

loadGame.addEventListener("click", () => {
  click.play();
  document.querySelector(".menu-main2").classList.add("hide");
  document.querySelector(".second").classList.remove("hide");
});
Array.from(document.querySelectorAll(".sec")).forEach((ele, index) => {
  if (!localStorage.getItem(`state${index}`)) {
    ele.classList.add("disabled-tile");
  } else {
    ele.classList.remove("disabled-tile");
  }
  ele.addEventListener("click", () => {
    if (JSON.parse(localStorage.getItem(`state${index}`))) {
      click.play();
      deleteStars();
      reset(true, JSON.parse(localStorage.getItem(`state${index}`)));
    }
    document.querySelector(".menu-main2").classList.remove("hide");
    document.querySelector(".second").classList.add("hide");
    mainAudio.pause();
    document.querySelector(".bg").classList.add("hide");
  });
});

function createStars() {
  let bg = document.querySelector(".bg");
  for (let i = 0; i < 700; i++) {
    let star = document.createElement("div");
    star.classList.add("star");
    star.classList.add("star1");
    let posX = Math.ceil(Math.random() * window.innerWidth);
    let posY = Math.ceil(Math.random() * window.innerHeight * 3.5);
    star.style.left = `${posX}px`;
    star.style.top = `${posY}px`;
    bg.append(star);
  }
  for (let i = 0; i < 200; i++) {
    let star = document.createElement("div");
    star.classList.add("star");
    star.classList.add("star2");
    let posX = Math.ceil(Math.random() * window.innerWidth);
    let posY = Math.ceil(Math.random() * window.innerHeight * 3.5);
    star.style.left = `${posX}px`;
    star.style.top = `${posY}px`;
    bg.append(star);
  }
  for (let i = 0; i < 100; i++) {
    let star = document.createElement("div");
    star.classList.add("star");
    star.classList.add("star3");
    let posX = Math.ceil(Math.random() * window.innerWidth);
    let posY = Math.ceil(Math.random() * window.innerHeight * 3.5);
    star.style.left = `${posX}px`;
    star.style.top = `${posY}px`;
    bg.append(star);
  }
}
createStars();
coop.addEventListener("click", () => {
  reset(
    true,
    {
      dimension: DIMENSIONS,
      snake: [],
      oldSnake: [],
      dirX: 0,
      dirY: 0,
      obstacles: [],
      letters: [],
      speed: SPEED,
      curTime: 0,
      portals: [],
      score: 0,
      index: 0,
      curPosX: Math.floor(Math.random() * DIMENSIONS),
      curPosY: Math.floor(Math.random() * DIMENSIONS),
      snakeHead: undefined,
      lives: LIVES,
      oldDirX: 0,
      oldDirY: 0,
      load: false,
    },
    true
  );
  click.play();
  document.querySelector(".second").classList.add("hide");
  mainAudio.pause();
  document.querySelector(".bg").classList.add("hide");
});
let blob = document.querySelector(".blob");

window.addEventListener("mouseenter", (e) => {
  console.log("here");
});

window.addEventListener("beforeunload", (e) => {
  let gameState = {
    snake: snake.map((ele) => [
      parseInt(ele.dataset.x),
      parseInt(ele.dataset.y),
    ]),
    oldSnake: oldSnake.map((ele) => [
      parseInt(ele.dataset.x),
      parseInt(ele.dataset.y),
    ]),
    dimension: DIMENSIONS,
    dirX,
    dirY,
    obstacles: obstacles.map((ele) => [
      parseInt(ele.dataset.x),
      parseInt(ele.dataset.y),
    ]),
    letters: letters.map((ele) => [
      parseInt(ele.dataset.x),
      parseInt(ele.dataset.y),
    ]),
    speed,
    portals: portals.map((ele) => [
      parseInt(ele.dataset.x),
      parseInt(ele.dataset.y),
    ]),
    curTime,
    movingObstacle: movingObstacle.map((ele) => {
      return {
        x: ele.dataset.x,
        y: ele.dataset.y,
        height: ele.dataset.height,
        width: ele.dataset.width,
        top: ele.dataset.top,
        left: ele.dataset.left,
        orgX: ele.dataset.orgX,
        orgY: ele.dataset.orgY,
        dir: ele.dataset.dir,
        movDir: ele.dataset.movDir,
        blocks: ele.dataset.blocks,
        travelled: ele.dataset.travelled,
      };
    }),
    score,
    word: currentWord,
    curPosX: parseInt(snakeHead.dataset.x),
    curPosY: parseInt(snakeHead.dataset.y),
    snakeHead: [parseInt(snakeHead.dataset.x), parseInt(snakeHead.dataset.y)],
    lives: lives,
    index,
    oldDirX,
    oldDirY,
    load: true,
  };
  if (!coopPlay && lives > 0) {
    localStorage.setItem(`state-accident`, JSON.stringify(gameState));
  }
});

if (localStorage.getItem("state-accident")) {
  document.querySelector("#continue").classList.remove("disabled-tile");
  document.querySelector("#continue").addEventListener("click", (e) => {
    if (JSON.parse(localStorage.getItem(`state-accident`))) {
      reset(true, JSON.parse(localStorage.getItem(`state-accident`)));
      mainAudio.pause();
      document.querySelector(".bg").classList.add("hide");
      click.play();
    }
    deleteStars();
  });
}

function deleteStars() {
  document.querySelectorAll(".star").forEach((ele) => {
    ele.parentElement.removeChild(ele);
  });
}

// blob.style.top = `${e.clientY}px`;
// blob.style.left = `${e.clientX}px`;

document.querySelector("#themes").addEventListener("click", () => {
  click.play();
  document.querySelector(".menu-main2").classList.add("hide");
  document.querySelector(".third").classList.remove("hide");
});

document.querySelector("#jungle").addEventListener("click", (e) => {
  Array.from(document.querySelectorAll(".theme-card")).forEach((ele) => {
    ele.classList.remove("selected-card");
  });
  click.play();
  document.querySelector("#jungle").classList.add("selected-card");
  root.style.setProperty(
    "--background",
    `url(https://ik.imagekit.io/ehbewtutq/jungle_bg.jpg?updatedAt=1683983356058)`
  );
  document.querySelector(".menu-main2").classList.remove("hide");
  document.querySelector(".third").classList.add("hide");
});

document.querySelector("#alien").addEventListener("click", (e) => {
  Array.from(document.querySelectorAll(".theme-card")).forEach((ele) => {
    ele.classList.remove("selected-card");
  });
  document.querySelector("#alien").classList.add("selected-card");
  click.play();
  root.style.setProperty(
    "--background",
    `url(https://ik.imagekit.io/ehbewtutq/1624.jpg?updatedAt=1683983490991)`
  );
  document.querySelector(".menu-main2").classList.remove("hide");
  document.querySelector(".third").classList.add("hide");
});

document.querySelector("#scifi").addEventListener("click", (e) => {
  Array.from(document.querySelectorAll(".theme-card")).forEach((ele) => {
    ele.classList.remove("selected-card");
  });
  document.querySelector("#scifi").classList.add("selected-card");
  click.play();
  root.style.setProperty(
    "--background",
    `url(https://ik.imagekit.io/ehbewtutq/city-5848267_1920.jpg?updatedAt=1683983490935)`
  );
  document.querySelector(".menu-main2").classList.remove("hide");
  document.querySelector(".third").classList.add("hide");
});
