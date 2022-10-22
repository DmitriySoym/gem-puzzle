console.log("test");

let gameArea = 400;
let btnFontSize = 150;

if (document.documentElement.clientWidth < 435) {
  gameArea = 300;
  btnFontSize = 82;
}

const appBody = document.createElement("div");
appBody.classList.add("appBody");

const bestRes = document.createElement("div");
bestRes.classList.add("topresults");
bestRes.style.width = `${gameArea}px`;
bestRes.innerHTML = `
    <h2>TOP results</h2>
        <div value="3">
        <b>3x3</b>
    </div>
    <div value="4">
        <b>4x4</b>
    </div>
    <div value="5">
        <b>5x5</b>
    </div>
    <div value="6">
        <b>6x6</b>
    </div>
    <div value="7">
        <b>7x7</b>
    </div>
    <div value="8">
        <b>8x8</b>
    </div>
    <div style="display:flex;">
        <button class="button button__fame_close delete_records">Ok</button>
        <button class="button button__fame_clear">Clear records</button>
    </div>
`;
const winning = document.createElement("div");
winning.classList.add("winning");
winning.style.width = `${gameArea}px`;

//------vars
let blockSide = 0;
let sizeX = 0;
let sizeY = 0;
let sizeSqr = sizeX * sizeY;
let numberOfImage = null;
let timer = null;
const animationTime = 300;

let initPuzzle = null;
let randomPuzzle = null;
let randomPuzzleString = null;
let htmlPuzzle = null;
let indexOfEmpty = null;
let empty = null;

let movesCounter = localStorage.getItem("moves")
  ? parseInt(localStorage.getItem("moves"))
  : 0;

let isShuffling = false;
let isFinalizing = false;
let isDropping = false;
let isMemo = false;
let isGameOver = false;
let arrSolution = [];

let areSoundsOn = true;
let areNumbersOn = true;

const winningButton = document.createElement("button");
winningButton.textContent = "Ok";
winningButton.classList.add("button");
winningButton.addEventListener("click", () => {
  winning.classList.toggle("visible");
  //   document.querySelectorAll(".myRecords").forEach((e) => e.remove());

  //   bestResultRender();
});
winning.append(winningButton);

appBody.append(bestRes, winning);
document.body.prepend(appBody);
const containerButtonsDown = document.createElement("div");
containerButtonsDown.classList.add("container__buttons__first");
containerButtonsDown.innerHTML = `
    <div class="container__form">
        <form name="my" class="form">
            <div class="button button__new" type="submit">New game</div>
                <select name="size" size="1" class="button button__select">
                     <option value="3">3x3</option>
                    <option value="4" selected>4x4</option>
                    <option value="5">5x5</option>
                    <option value="6">6x6</option>
                    <option value="7">7x7</option>
                    <option value="8">8x8</option>
                </select>
        </form>
        <div class="button button__finish"></div>
		  <div class="options">
        <button class="button volume_off"><i class="material-icons">sound on</i></button>
        </div>
    </div>
`;

appBody.appendChild(containerButtonsDown);
const containerButtonsUp = document.createElement("div");
containerButtonsUp.classList.add("container__buttons__second");
containerButtonsUp.innerHTML = `
    <div class="container__buttons__item item__left">
        <i class="material-icons indent">timer</i>
        <span class="timeHTML"></span>
    </div>
    <div class="container__buttons__item item__center">
        <button class="button button__fame">TOP results</button>
    </div>
    <div class="container__buttons__item item__right">
        <span class="indent indent_moves">Moves:</span>
        <span class="movesHTML"></span> 
    </div>
`;
appBody.appendChild(containerButtonsUp);
const movesHTML = document.querySelector(".movesHTML");
movesHTML.textContent = movesCounter;

const indentMoves = document.querySelector(".indent_moves");
const timeHTML = document.querySelector(".timeHTML");

const board = document.createElement("div");
board.classList.add("board");
board.style.width = `${gameArea}px`;
board.style.height = `${gameArea}px`;
appBody.appendChild(board);

const buttonFame = document.querySelector(".button__fame");
buttonFame.addEventListener("click", showbestRes);

const buttonFameClear = document.querySelector(".button__fame_clear");
buttonFameClear.addEventListener("click", () => {
  localStorage.removeItem("fame");

  const { children } = bestRes;
  for (let i = 1; i < children.length - 1; i += 1) {
    while (children[i].children[1]) {
      children[i].removeChild(children[i].children[1]);
    }
  }

  showbestRes();
});

const buttonNew = document.querySelector(".button__new");
buttonNew.addEventListener("click", () => {
  localRemoveExceptFame();
  timeHTML.textContent = "00:00:00";
  movesCounter = 0;

  movesHTML.textContent = movesCounter;
  startGame();
});

const form = document.forms.my;
const buttonFinish = document.querySelector(".button__finish");

const toggleSounds = document.querySelector(".volume_off");
toggleSounds.addEventListener("click", () => {
  areSoundsOn = !areSoundsOn;
  if (areSoundsOn) toggleSounds.childNodes[0].textContent = "sound on";
  else toggleSounds.childNodes[0].textContent = "sound off";
});

function createBoardAddListeners() {
  board.innerHTML = "";
  isGameOver = false;

  if (localStorage.getItem("numberOfImage")) {
    numberOfImage = Number(localStorage.getItem("numberOfImage"));
  } else {
    numberOfImage = Math.floor(Math.random() * 150);
    localStorage.setItem("numberOfImage", numberOfImage);
  }

  if (localStorage.getItem("sizeX")) {
    sizeX = Number(localStorage.getItem("sizeX"));
    const children = form.elements.size.childNodes;
    for (let i = 1; i < children.length; i += 2) {
      if (i === sizeX * 2 - 2) children[i].setAttribute("selected", "");
      else if (children[i].getAttribute("selected")) {
        children[i].removeAttribute("selected");
      }
    }
  } else {
    sizeX = Number(form.elements.size.value);
    localStorage.setItem("sizeX", sizeX);
  }

  sizeY = sizeX;
  sizeSqr = sizeX * sizeY;
  blockSide = gameArea / sizeX;

  buttonFinish.removeEventListener("click", finishByAlg);
  buttonFinish.removeEventListener("click", finishByMemo);
  buttonFinish.addEventListener("click", () => {
    isFinalizing = true;
    localRemoveExceptFame();
  });

  if (localStorage.getItem("arrSolution"))
    arrSolution = localStorage
      .getItem("arrSolution")
      .split(",")
      .map((item) => Number(item));
  else arrSolution.length = 0;
}

function createPuzzles() {
  initPuzzle = createInitPuzzle();
  if (sizeX < 5) {
    if (localStorage.getItem("randomPuzzleString")) {
      randomPuzzle = localStorage
        .getItem("randomPuzzleString")
        .split(",")
        .map((item) => Number(item));
      htmlPuzzle = createHtmlPuzzle(randomPuzzle);
    } else {
      randomPuzzle = createRandomPuzzle();
      htmlPuzzle = createHtmlPuzzle(randomPuzzle);
      localStorage.setItem("randomPuzzleString", randomPuzzle.join(","));
    }

    indexOfEmpty = randomPuzzle.indexOf(0);

    isMemo = false;
    buttonFinish.addEventListener("click", finishByAlg);
  } else {
    if (localStorage.getItem("randomPuzzleString")) {
      randomPuzzle = localStorage
        .getItem("randomPuzzleString")
        .split(",")
        .map((item) => Number(item));
      htmlPuzzle = createHtmlPuzzle(randomPuzzle);
    } else {
      randomPuzzle = createInitPuzzle();
      htmlPuzzle = createHtmlPuzzle(randomPuzzle);
      shuffle();
      localStorage.setItem("randomPuzzleString", randomPuzzle.join(","));
    }

    isMemo = true;
    buttonFinish.addEventListener("click", finishByMemo);
  }
  htmlPuzzle.forEach((item) => board.appendChild(item));
}

function createTimeThings() {
  timeHTML.textContent = localStorage.getItem("time")
    ? localStorage.getItem("time")
    : "00:00:00";
  clearTimeout(timer);
  timer = setTimeout(function tick() {
    timeHTML.textContent = increaseTime(timeHTML.textContent);
    localStorage.setItem("time", timeHTML.textContent);
    timer = setTimeout(tick, 1000);
  }, 1000);
}

function startGame() {
  createBoardAddListeners();
  createPuzzles();
  createTimeThings();
}

function createInitPuzzle() {
  const arr = [];
  for (let i = 0; i < sizeSqr - 1; i += 1) {
    arr.push(i + 1);
  }
  arr.push(0);
  return arr;
}

function createRandomPuzzle() {
  const arr = [];
  const tempArr = [];

  for (let k = 0; k < sizeSqr; k += 1) {
    tempArr.push(k);
  }
  for (let i = 0; i < sizeSqr; i += 1) {
    const randomIndex = Math.floor(Math.random() * tempArr.length);
    const randomNumber = tempArr[randomIndex];
    tempArr.splice(randomIndex, 1);
    arr.push(randomNumber);
  }

  if (!isSolvable(arr) || puzzlesAreEqual(arr, initPuzzle))
    return createRandomPuzzle();
  return arr;
}

function createHtmlPuzzle(randomPuzzleLoc) {
  indexOfEmpty = randomPuzzleLoc.indexOf(0);
  const arr = [];
  for (let i = 0; i < randomPuzzleLoc.length; i += 1) {
    const x = i % sizeX;
    const y = Math.floor(i / sizeX);
    arr[i] = createBlock(x, y, randomPuzzleLoc[i]);

    if (i !== indexOfEmpty) {
      arr[i].addEventListener("click", (e) => {
        if (!blocksAreNeig(i, indexOfEmpty) || isGameOver || isDropping) return;

        if (e.screenX && e.screenY) {
          if (isFinalizing) return;
        }

        const a = empty.style.left;
        const b = empty.style.top;
        empty.style.left = arr[i].style.left;
        empty.style.top = arr[i].style.top;
        arr[i].style.left = a;
        arr[i].style.top = b;

        if (!isFinalizing && sizeX > 4) {
          arrSolution.push(indexOfEmpty);
          if (!isShuffling) {
            localStorage.setItem(
              "arrSolution",
              `${localStorage.getItem("arrSolution")}, ${indexOfEmpty}`
            );
          }
        }

        const temp = arr[i];
        arr.splice(i, 1, arr[indexOfEmpty]);
        arr.splice(indexOfEmpty, 1, temp);

        [indexOfEmpty, i] = [i, indexOfEmpty];
        [randomPuzzleLoc[indexOfEmpty], randomPuzzleLoc[i]] = [
          randomPuzzleLoc[i],
          randomPuzzleLoc[indexOfEmpty],
        ];

        if (!isShuffling) {
          playSound("move");
          movesCounter += 1;

          localStorage.setItem("moves", movesCounter);
        }
        if (!isFinalizing) movesHTML.textContent = movesCounter;

        if (puzzlesAreEqual(randomPuzzleLoc, initPuzzle) && !isShuffling) {
          isGameOver = true;
          setTimeout(() => {
            endGame();
          }, animationTime);
        }

        if (!isFinalizing) {
          if (!isShuffling) {
            randomPuzzleString = randomPuzzleLoc.join(",");
            localStorage.setItem("randomPuzzleString", randomPuzzleString);
          }
        }
      });
    }
  }

  return arr;
}

function isSolvable(puzzle) {
  let sum = 0;
  let e = 0;

  for (let i = 0; i < puzzle.length; i += 1) {
    if (puzzle[i] === 0) {
      e = Math.floor(i / sizeX) + 1;
    } else {
      let count = 0;
      for (let j = i; j < puzzle.length; j += 1) {
        if (puzzle[j] !== 0 && puzzle[i] > puzzle[j]) count += 1;
      }
      sum += count;
    }
  }

  if (sizeX % 2 === 1) return sum % 2 === 0;
  return (sum + e) % 2 === 0;
}

function puzzlesAreEqual(firstPuzzle, secondPuzzle) {
  for (let i = 0; i < firstPuzzle.length; i += 1) {
    if (firstPuzzle[i] !== secondPuzzle[i]) return false;
  }
  return true;
}

function shuffle(num) {
  isShuffling = true;
  let localNum = null;

  if (num) localNum = num;
  else {
    if (sizeX === 5) localNum = 600;
    if (sizeX === 6) localNum = 1000;
    if (sizeX === 7) localNum = 1500;
    if (sizeX === 8) localNum = 2100;
  }

  const arrDirections = [-1, -sizeX, 1, sizeX];
  for (let i = 0; i < localNum; i += 1) {
    const randomDirection = Math.floor(Math.random() * arrDirections.length);
    const randomIndex = indexOfEmpty + arrDirections[randomDirection];
    if (randomIndex >= 0 && randomIndex < sizeSqr) {
      htmlPuzzle[randomIndex].click();
    }
  }
  localStorage.setItem("indexOfEmpty", indexOfEmpty);
  localStorage.setItem("arrSolution", arrSolution.join(","));
  isShuffling = false;
}

function calcManhattanDist(puzzle) {
  let dist = 0;
  let row = false;
  let col = false;

  for (let i = 0; i < puzzle.length; i += 1) {
    if (puzzle[i] !== 0) {
      const j = initPuzzle.indexOf(puzzle[i]);
      dist += Math.abs((i % sizeX) - (j % sizeX));
      dist += Math.abs(Math.floor(i / sizeX) - Math.floor(j / sizeX));

      if (puzzle[i] === sizeSqr - 1) {
        if (Math.floor(i / sizeX) === sizeY - 1) row = true;
      } else if (puzzle[i] === sizeSqr - sizeX) {
        if (i % sizeX === sizeX - 1) col = true;
      }
    }
  }

  // last move
  if (!row && !col) dist += 2;
  else if (!row || !col) dist += 1;

  return dist;
}

function createBlock(x, y, textContent) {
  const item = document.createElement("div");
  item.classList.add("item");
  item.style.left = `${x * blockSide}px`;
  item.style.top = `${y * blockSide}px`;
  item.style.width = `${blockSide}px`;
  item.style.height = `${blockSide}px`;
  item.setAttribute("id", textContent);

  const backX = (textContent - 1) % sizeX;
  const backY = Math.floor((textContent - 1) / sizeY);

  if (textContent === 0) {
    item.classList.add("empty");
    empty = item;
  } else {
    if (areNumbersOn) item.textContent = textContent;
    item.style.backgroundPosition = `${(backX / (sizeX - 1)) * 100}% ${
      (backY / (sizeY - 1)) * 100
    }%`;

    let fontSize = btnFontSize / sizeX;
    if (fontSize < 14) fontSize = 14;
    item.style.fontSize = `${fontSize}px`;
  }
  return item;
}

function blocksAreNeig(firstIndex, secondIndex) {
  const hor = !!(
    Math.abs(firstIndex - secondIndex) === 1 &&
    Math.max(firstIndex, secondIndex) % sizeX
  );
  const vert = Math.abs(firstIndex - secondIndex) === sizeX;
  return (hor && !vert) || (!hor && vert);
}

class Position {
  constructor(puzzle, G, H, way) {
    this.puzzle = puzzle; // текущая позиция (массив)
    this.G = G; // количество шагов от начальной вершины до текущей (число)
    this.H = H; // манхэттенское расстояние (число)
    this.F = this.G + this.H; // число
    this.way = way; // путь от начальной вершины (массив)
  }
}

function increaseTime(str) {
  let [hours, minutes, seconds] = str.split(":");

  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  seconds = parseInt(seconds, 10) + 1;

  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes === 60) {
    minutes = 0;
    hours += 1;
  }
  [hours, minutes, seconds] = [
    addZero(hours),
    addZero(minutes),
    addZero(seconds),
  ];

  return `${hours}:${minutes}:${seconds}`;
}

function addZero(num) {
  if (num < 10) return `0${num.toString()}`;
  return num.toString();
}

function timeToSeconds(str) {
  const [hours, minutes, seconds] = str.split(":");
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function finishByMemo() {
  deleteDuplicates(arrSolution);
  arrSolution.reverse();
  clickToFinish(arrSolution);
}

function deleteDuplicates(arr) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] === arr[i + 2]) {
      arr.splice(i + 1, 2);
      i -= 2;
    }
  }
}

function finishByAlg() {
  if (puzzlesAreEqual(randomPuzzle, initPuzzle)) return;

  const puzzle = randomPuzzle.slice();
  const manh = calcManhattanDist(puzzle);
  const inObj = new Position(puzzle, 0, manh, []);

  const open = [inObj];
  const openStrings = [inObj.puzzle.join("")];
  const close = [];
  let counter = null;
  const [labelOne, labelTwo] = sizeX < 4 ? ["F", "H"] : ["H", "F"];

  const winWay = process();
  if (winWay) clickToFinish(winWay);

  function process() {
    for (counter = 0; counter < 30000; counter += 1) {
      if (open.length === 0) break;

      let minIndex = 0;
      for (let j = 1; j < open.length; j += 1) {
        if (
          open[j][labelOne] < open[minIndex][labelOne] ||
          (open[j][labelOne] === open[minIndex][labelOne] &&
            open[j][labelTwo] < open[minIndex][labelTwo])
        ) {
          minIndex = j;
        }
      }
      if (open[minIndex].H === 0) return open[minIndex].way;

      const obj = {};
      Object.assign(obj, open[minIndex]);
      open.splice(minIndex, 1);
      openStrings.splice(minIndex, 1);

      close.push(obj.puzzle.join(""));
      addChildren(obj);
    }
    return null;
  }

  function findInCloseAndOpen(puzzleStr) {
    for (let j = close.length - 1; j >= 0; j -= 1) {
      if (close[j] === puzzleStr) return true;
    }
    for (let k = openStrings.length - 1; k >= 0; k -= 1) {
      if (openStrings[k] === puzzleStr) return true;
    }
    return false;
  }

  function addChildren(initialObj) {
    const index = initialObj.puzzle.indexOf(0);

    if (index % sizeX !== 0) {
      checkInCloseAndOpen(index - 1);
    }
    if (index % sizeX !== sizeX - 1) {
      checkInCloseAndOpen(index + 1);
    }
    if (index >= sizeX) {
      checkInCloseAndOpen(index - sizeX);
    }
    if (Math.floor(index / sizeX) !== sizeY - 1) {
      checkInCloseAndOpen(index + sizeX);
    }

    function checkInCloseAndOpen(direction) {
      const newPuzzle = initialObj.puzzle.slice();
      [newPuzzle[index], newPuzzle[direction]] = [
        newPuzzle[direction],
        newPuzzle[index],
      ];
      const newPuzzleStr = newPuzzle.join("");

      if (findInCloseAndOpen(newPuzzleStr)) return;

      const manhLocal = calcManhattanDist(newPuzzle);
      const way = initialObj.way.slice();
      way.push(direction);
      const newChild = new Position(
        newPuzzle,
        initialObj.G + 1,
        manhLocal,
        way
      );

      open.push(newChild);
      openStrings.push(newPuzzleStr);
    }
  }
}

function clickToFinish(arr) {
  let j = 0;
  indentMoves.textContent = "Moves remain:";

  let delay = 300;
  if (arr.length > 100 && arr.length <= 150) delay = 200;
  else if (arr.length > 150 && arr.length <= 300) delay = 150;
  else if (arr.length > 300 && arr.length <= 500) delay = 100;
  else if (arr.length > 500) delay = 50;

  recursion();
  function recursion() {
    if (j < arr.length) {
      setTimeout(() => {
        htmlPuzzle[arr[j]].click();
        j += 1;
        movesHTML.textContent = arr.length - j;
        if (puzzlesAreEqual(randomPuzzle, initPuzzle)) {
          return;
        }
        recursion();
      }, delay);
    }
  }
}

function endGame() {
  isGameOver = true;

  for (let i = 0; i < htmlPuzzle.length; i += 1) {
    if (i === htmlPuzzle.length - 1) htmlPuzzle[i].classList.add("empty__win");
    else {
      htmlPuzzle[i].textContent = "";
      htmlPuzzle[i].classList.add("item__win");
    }
  }
  clearTimeout(timer);

  if (!isFinalizing) {
    playSound("win");

    let fame = null;
    const username = prompt("Enter your name:"); // eslint-disable-line no-alert
    const time = timeToSeconds(timeHTML.textContent);
    const fameItem = {
      name: username,
      sizeX,
      timeString: timeHTML.textContent,
      time,
      moves: movesCounter,
      calc: time * movesCounter ** 2,
    };

    if (localStorage.getItem("fame")) {
      const json = localStorage.getItem("fame");
      fame = JSON.parse(json);
      let bool = true;
      for (let j = 0; j < fame.length; j += 1) {
        if (Number(fame[j].calc) > fameItem.calc) {
          fame.splice(j, 0, fameItem);
          bool = false;
          break;
        }
      }
      if (bool) fame.push(fameItem);
    } else {
      fame = [];
      fame.push(fameItem);
    }

    const string = JSON.stringify(fame);
    localStorage.setItem("fame", string);

    const winningInfo = document.createElement("div");
    winningInfo.innerHTML = `Hooray! You solved the puzzle in ${timeHTML.textContent}  and ${movesCounter} moves!`;
    for (let i = 2; i < winning.children.length - 1; ) {
      winning.removeChild(winning.children[2]);
    }
    winning.insertBefore(winningInfo, winning.childNodes[2]);
    winning.classList.add("visible");
  } else playSound("finish");
  isFinalizing = false;

  movesCounter = 0;
  movesHTML.textContent = movesCounter;
  indentMoves.textContent = "Moves:";
  timeHTML.textContent = "00:00:00";

  localRemoveExceptFame();
}

const buttonFameClose = document.querySelector(".button__fame_close");
buttonFameClose.addEventListener("click", () => {
  bestRes.classList.toggle("visible");
});

// bestResultRender();

function showbestRes() {
  bestRes.classList.toggle("visible");
  document.querySelectorAll(".myRecords").forEach((e) => e.remove());
  if (bestRes.classList.contains("visible")) {
    playSound("fame");
  }

  if (localStorage.getItem("fame")) {
    let fames = localStorage.getItem("fame");
    fames = JSON.parse(fames);

    const { children } = bestRes;

    for (let k = 0; k < fames.length; k += 1) {
      for (let i = 0; i < children.length; i += 1) {
        if (fames[k].sizeX === Number(children[i].getAttribute("value"))) {
          const el = document.createElement("div");
          el.classList.add("myRecords");

          el.innerHTML = `
                           name = ${fames[k].name}, time = ${fames[k].timeString}, moves = ${fames[k].moves}
                        `;

          children[i].appendChild(el);
          console.log(el);

          const deleteRecordsButton = document.querySelector(".delete_records");
          deleteRecordsButton.onclick = () => {
            document.querySelectorAll(".myRecords").forEach((e) => e.remove());
          };
        }
      }
    }
  }
}

function playSound(type) {
  if (!areSoundsOn) return;
  let audio = document.createElement("audio");
  audio.setAttribute("src", `./assets/sounds/${type}.mp3`);
  audio.load();
  audio.play();
  audio = null;
}

function localRemoveExceptFame() {
  localStorage.removeItem("randomPuzzleString");
  localStorage.removeItem("indexOfEmpty");
  localStorage.removeItem("sizeX");
  localStorage.removeItem("numberOfImage");
  localStorage.removeItem("arrSolution");
  localStorage.removeItem("time");
  localStorage.removeItem("moves");
}

startGame();
