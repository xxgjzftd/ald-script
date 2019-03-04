import path from 'path'
import dm from 'dm.dll'
import minimist from 'minimist'

interface Actions {
  noop (): void
  home (): void
  enterIntoMysticPlace (): void
  selectDarkAbyss (): void
  selectKingLevel (): void
  challenge (): void
  enterIntoPackage (): void
  selectConsumablesPanel (): void
  selectPotion (): void
  usePotion (): void
}

interface Position {
  x: number,
  y: number
}

type State = keyof Actions

const argv = minimist(process.argv, { alias: { s: 'state', n: 'nextState' }, default: { state: 'enterIntoMysticPlace', nextState: 'noop' } })

const initState = (argv.state as State)
const initNextState = (argv.nextState as State)

let state: State = initState
let nextState: State = initNextState

const hwnds = dm.enumWindow('', '阿拉德', 1 + 2 + 4 + 8 + 16)
const hwnd = hwnds[0]

console.log(hwnds)

console.log(`set path ${dm.setPath(path.resolve('./data'))}`)

console.log(`bind ${dm.dll.BindWindow(hwnd, 'dx2', 'windows3', 'windows', 0)}`)

const fp = (name: string, dir: 0 | 1 | 2 | 3) => dm.findPic(0, 0, 2000, 2000, name, '000000', 0.8, dir)

const move = (pos: Position, x = 0, y = 0) => dm.moveTo(pos.x + Math.floor(x / 2), pos.y + Math.floor(y / 2))

const click = () => dm.leftClick()

const actions: Actions = {
// tslint:disable-next-line: no-empty
  noop () {},
  home () {
    let pos = fp('mystic-place.bmp', 2)
    if (pos) {
      state = nextState
      nextState = 'noop'
    } else {
      dm.moveTo(50, 60)
      click()
    }
  },
  enterIntoMysticPlace () {
    let pos = fp('mystic-place.bmp', 2)
    if (pos) {
      move(pos, 31)
      click()
      state = 'selectDarkAbyss'
    }
  },
  selectDarkAbyss () {
    let pos = fp('dark-abyss.bmp', 2)
    if (pos) {
      move(pos, 63, 16)
      click()
      state = 'selectKingLevel'
    }
  },
  selectKingLevel () {
    let pos = fp('king-level.bmp', 2)
    if (pos) {
      move(pos, 39, 19)
      click()
      state = 'challenge'
    }
  },
  challenge () {
    let pos = fp('businessman-dialog.bmp|goods-list-cancel.bmp|continue-challenge.bmp|start-challenge.bmp|potion.bmp', 0)
    if (pos) {
      switch (pos.index) {
        case 0:
          move(pos)
          break
        case 1:
          move(pos, 34, 33)
          break
        case 2:
          move(pos)
          break
        case 3:
          move(pos)
          break
        case 4:
          state = 'home'
          nextState = 'enterIntoPackage'
          break
        default:
          break
      }
      click()
    }
  },
  enterIntoPackage () {
    let pos = fp('package.bmp', 3)
    if (pos) {
      move(pos, 23)
      click()
      state = 'selectConsumablesPanel'
    }
  },
  selectConsumablesPanel () {
    let pos = fp('consumables.bmp', 2)
    if (pos) {
      move(pos, 61, 20)
      click()
      state = 'selectPotion'
    }
  },
  selectPotion () {
    let pos = fp('potion.bmp', 2)
    if (pos) {
      move(pos, 44, 47)
      click()
      state = 'usePotion'
      setTimeout(
        () => {
          state = 'home'
          nextState = 'enterIntoMysticPlace'
        },
        90000
      )
    }
  },
  usePotion () {
    let pos = fp('use-potion.bmp', 0)
    if (pos) {
      move(pos, 34, 17)
      click()
    }
  }
}

setInterval(
  () => {
    console.log(state)
    actions[state]()
  },
  3000
)

process.on(
  'exit',
  (code) => {
    console.log(`exit ${code}`)
    console.log(`unbind ${dm.unBindWindow()}`)
  }
)
