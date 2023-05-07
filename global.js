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
