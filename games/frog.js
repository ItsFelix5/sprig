/*
@title: Frog
@author: Felix
@tags: ['endless', 'retro', 'adventure', 'survival']
@addedOn: 2025-01-22
@description: A retro-style frog crossing game where you navigate through traffic and obstacles. Use WASD keys to move the frog, avoid cars, and try to progress as far as you can while increasing your score.
*/

const frog = "f"
const car = "c"
const road = "r"
const sidewalk = "s"
const house = "h"
const water = "w"
const log = "l"
setLegend(
  [ frog, bitmap`
................
........DD..DD..
.......D44DD44D.
......D4404440D.
......D4444DD44D
.....D444444444D
....D444422224D.
...D444422224D..
..D444422222D...
.D44444222DD....
.D4D44D42D4D....
.D44D4D44D44D...
D4444D4444D44D..
................
................
................` ],
  [ car, bitmap`
................
................
................
................
.......33333....
......3373733...
.....33773773...
....3377737733..
..3333333333333.
333333333333333.
6330003333300033
3330103333301033
...000.....000..
................
................
................` ],
  [ road, bitmap`
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
1111111111111111
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0666006666006660
0666006666006660
0000000000000000
0000000000000000
0000000000000000
0000000000000000
1111111111111111
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL` ],
  [ sidewalk, bitmap`
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL` ],
  [ house, bitmap`
................
................
................
................
.....333333.....
....33333333....
...3333333333...
..333333333333..
...CCCCCCCCCC...
...CCCCCCCCCC...
...C777CCCCCC...
...C777CCCCCC...
...C777CC000C...
...CCCCCC000C...
...CCCCCC600C...
...CCCCCC000C...` ],
  [ log, bitmap`
................
................
................
................
CCCCCCCCCCCCCCCC
C000CCCCCCCCCCCC
CCCCCCCCC000CCCC
CCCCCCCCCCCCCCCC
CCC000CCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCC0000C
CCCCCCCCCCCCCCCC
................
................
................
................` ],
  [ water, bitmap`
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777` ],
)

setSolids([frog, house])
setBackground(sidewalk)

let dead, score, moved, logPos, logLength = 10;
function spawn() {
  dead = false;
  score = 0;
  moved = true;
  clearText()
  addText("0", {x:0, color: color`5`})
  setMap(map`
.............
.............
.............
.............
.............
.............
.............
.............
.............
......f......`)
  for(let y = 0;y < height() - 1;y++)generateRow(y)
  loop()
}
spawn()

function loop() {
  if(dead) return;
  moved = false;
  getAll(car).forEach(c=>{
    if(c.x == 0) c.remove()
    else c.x--
  })
  if(tilesWith(frog, log).length == 1) getFirst(frog).x++
  getAll(log).forEach(l=>{
    if(l.x == width()-1) l.remove()
    else l.x++
  })
  if(tilesWith(frog, car).length > 0 || tilesWith(frog, water).length > tilesWith(frog, log).length) {
    addText("You died!", {color: color`3`})
    dead = true;
    moved = true;
    return;
  }
  const newCar = ~~(Math.random() * height())
  const tile = getTile(width()-1, newCar);
  if(tile.length == 1 && tile[0].type == road) addSprite(width() - 1, newCar, car)
  if(++logLength < 4) addSprite(0, logPos, log)
  else if(tile.length > 0 && tile[0].type == water) {
    logPos = newCar;
    logLength = 0;
  }
  setTimeout(loop, 250)
}

function generateRow(y) {
  let r = Math.random()
  if(r < 0.5) {
    for(let x = 0;x < width();x++) addSprite(x, y, road)
  } else if(r < 0.65) {
    for(let x = 0;x < width();x++) {
      if(Math.random() < 0.5) addSprite(x, y, house)
    }
  } else if(r < 0.7) {
    for(let x = 0;x < width();x++) addSprite(x, y, water)
  }
}

onInput("w", () => {
  if(moved) return;
  if(--getFirst(frog).y < height() - 2) {
    logPos++
    if(logPos > height()-1) logLength = 10
    getAll().forEach(s=>{
      if(s.y == height() - 1) s.remove()
      else s.y++
    })
    generateRow(0)
    score++
  }
})

onInput("s", () => {
  if(moved) return;
  getFirst(frog).y++
  score--
})

onInput("a", () => {
  if(moved) return;
  getFirst(frog).x--
})

onInput("d", () => {
  if(moved) return;
  getFirst(frog).x++
})

afterInput(() => {
  if(dead == true) spawn()
  moved = true;
  if(tilesWith(frog, car).length > 0) {
    addText("You died!", {color: color`3`})
    dead = true;
  } else {
    clearText()
    addText(""+score, {x:0, color: color`5`})
  }
})
