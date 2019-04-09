import path from 'path'
import dm from 'dm.dll'
import minimist from 'minimist'

interface Position {
  x: number
  y: number
}

interface Actions {
  noop (): void
  home (): void
  selectMainTask (): void
  enterIntoReplicate (): void
  challenge (): void
}

type State = keyof Actions

const hwnds = dm.enumWindow('', '阿拉德', 1 + 2 + 4 + 8 + 16)
const hwnd = dm.getWindow(hwnds[0], 1)

console.log(hwnds, hwnd)

console.log(`set path ${dm.setPath(path.resolve('./data'))}`)

console.log(`bind ${dm.bindWindow(hwnd, 'dx2', 'windows', 'windows', 0)}`)

const fp = (name: string, dir: 0 | 1 | 2 | 3) => dm.findPic(0, 0, 2000, 2000, name, '000000', 0.8, dir)

const move = (pos: Position, x = 0, y = 0) => dm.moveTo(pos.x + Math.floor(x / 2), pos.y + Math.floor(y / 2))

const click = () => dm.leftClick()

const argv = minimist(process.argv, { alias: { s: 'state', n: 'nextState' }, default: { state: 'selectMainTask', nextState: 'noop' } })

const initState = (argv.state as State)
const initNextState = (argv.nextState as State)

let state: State = initState
let nextState: State = initNextState

let moveTimer: NodeJS.Timeout | undefined

type Dir = 'right' | 'left' | 'up' | 'down'

const roleMove = (dir: Dir) => {
  dm.dll.KeyPressChar(dir)

  // dm.dll.KeyDownChar(dir)
  // setTimeout(() => {
  //   dm.dll.KeyUpChar(dir)
  // }, 2000)
}

const moveToNext = (next: Position) => {

  moveTimer = setInterval(
    () => {
      let pos = dm.findColor(0, 0, 2000, 560, '00ff0e', 0.8, 0)
      if (pos) {
        if (next.x > pos.x + 50) {
          roleMove('right')
        } else {
          roleMove('left')
        }
        if (next.y > pos.y) {
          roleMove('down')
        } else {
          roleMove('up')
        }
      } else {
        let dir: Dir
        let random = Math.random()
        if (random > 0.75) {
          dir = 'right'
        } else if (random > 0.5) {
          dir = 'left'
        } else if (random > 0.25) {
          dir = 'up'
        } else {
          dir = 'down'
        }
        roleMove(dir)
      }

    },
    300
  )

}

const keys = ['x', 'a', 's', 'd', 'f', 'g', 'h', 'q', 'w', 'e', 'r', 't']

let figthTimer: NodeJS.Timeout | undefined

const fight = () => {
  let i = 0

  figthTimer = setInterval(
    () => {
      let dir = Math.random() > 0.5 ? 'right' : 'left'
      dm.dll.KeyPressChar(dir)
      dm.dll.KeyPressChar('x')
      let key = keys[(i++) % 5]
      dm.dll.KeyPressChar(key)
    },
    300
  )
}

const actions: Actions = {
  noop () { },
  home () {
    let pos = fp('mystic-place.bmp', 2)
    if (pos) {
      state = nextState
      nextState = 'noop'
    } else {
      dm.moveTo(40, 20)
      click()
    }
  },
  selectMainTask () {
    let pos = fp('businessman-dialog.bmp|main-task-instance-flag.bmp', 3)
    if (pos) {
      switch (pos.index) {
        case 0:
          move(pos)
          break
        case 1:
          move(pos, 28, 28)
          state = 'enterIntoReplicate'
          break
        default:
          break
      }
      click()
      return
    }
    move({ x: 50, y: 170 })
    click()
  },
  enterIntoReplicate () {
    let pos = fp('start-challenge-workaround.bmp', 3)
    if (pos) {
      move(pos, 140, 120)
      click()
      state = 'challenge'
    }
  },
  challenge () {
    let pos = dm.findPic(0, 120, 2000, 560, 'right-entrance.bmp|forward.bmp|boss-new.bmp|entrance-new.bmp', '000000', 0.8, 0)
    // let pos = dm.findColor(0, 120, 2000, 560, 'fe3a01|e2e29c|aaffff', 1, 0)
    if (pos) {
      clearInterval(figthTimer!)
      figthTimer = undefined
      clearInterval(moveTimer!)
      moveTimer = undefined

      moveToNext(pos)
    } else if (!figthTimer) {
      clearInterval(moveTimer!)
      moveTimer = undefined
      fight()
    }
  }

}

let timer: NodeJS.Timeout

const start = () => {
  timer = setInterval(
    () => {
      console.log(state)
      actions[state]()
    },
    3000
  )
}

setInterval(
  () => {
    let pos = fp('close-notification.bmp', 1)
    if (pos) {
      move(pos, 46, 43)
      click()
    }
  },
  30 * 60 * 1000
)

const stop = () => {
  clearInterval(timer)
}

console.log(stop)

start()
