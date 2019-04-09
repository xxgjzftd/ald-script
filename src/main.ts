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

const actions: Actions = {
  noop () {},
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
          state = 'challenge'
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
  challenge () {
    let pos = fp('forward.bmp|boss.bmp', 3)
    if (pos) {

    }
  },
  moveToNext () {

  }
}

setInterval(
  () => {
    console.log(state)
    let pos = fp('close-notification.bmp', 1)
    if (pos) {
      move(pos, 46, 43)
      click()
    }
    actions[state]()
  },
  3000
)
