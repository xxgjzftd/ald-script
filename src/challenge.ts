import path from 'path'
import dm from 'dm.dll'

interface Actions {
  noop (): void
  home (): void
  enterIntoMysticPlace (): void
  selectDarkAbyss (): void
  select60Abyss (): void
  selectKingLevel (): void
  enterIntoOther (): void
  selectOther (): void
  challenge (): void
  enterIntoPackage (): void
  selectConsumablesPanel (): void
  selectPotion (): void
  usePotion (): void
}

interface Position {
  x: number
  y: number
}

type State = keyof Actions

let state: State
let nextState: State

const hwnds = dm.enumWindow('', '阿拉德', 1 + 2 + 4 + 8 + 16)
const hwnd = dm.getWindow(hwnds[0], 1)

console.log(hwnds, hwnd)

console.log(`set path ${dm.setPath(path.resolve(__dirname, '../../data'))}`)

console.log(`bind ${dm.bindWindow(hwnd, 'dx2', 'windows', 'windows', 0)}`)

const fp = (name: string, dir: 0 | 1 | 2 | 3) => dm.findPic(0, 0, 2000, 2000, name, '000000', 0.8, dir)

const move = (pos: Position, x = 0, y = 0) => dm.moveTo(pos.x + Math.floor(x / 2), pos.y + Math.floor(y / 2))

const click = () => dm.leftClick()

const actions: Actions = {
  // tslint:disable-next-line: no-empty
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
  enterIntoMysticPlace () {
    let pos = fp('mystic-place.bmp', 2)
    if (pos) {
      move(pos, 31)
      click()
      if (vm.loop === '60') {
        state = 'select60Abyss'
      } else if (vm.loop === 'abyss') {
        state = 'selectDarkAbyss'
      }
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
  select60Abyss () {
    let pos = fp('60abyss.bmp', 2)
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
  enterIntoOther () {
    dm.dll.KeyPressChar('left')
    dm.dll.KeyPressChar('left')
    dm.dll.KeyPressChar('left')
    state = 'selectOther'
  },
  selectOther () {
    let pos = fp('other.bmp', 2)
    if (pos) {
      move(pos, 63, 16)
      click()
      state = 'selectKingLevel'
    }
  },
  challenge () {
    let pos = fp('businessman-dialog.bmp|goods-list-cancel.bmp|continue-challenge.bmp|start-challenge.bmp|can-not-continue-flag.bmp|gray-continue-challenge.bmp|gold-card.bmp|start-challenge-workaround.bmp', 3)
    if (pos) {
      switch (pos.index) {
        case 0:
          if (vm.businessman) {
            vm.stop()
            // tslint:disable-next-line: no-unused-expression
            new Notification('商人', { body: '出现了 ~~~' })
            return
          } else {
            move(pos)
          }
          break
        case 1:
          if (fp('transfer.bmp', 2)) {
            vm.stop()
            // tslint:disable-next-line: no-unused-expression
            new Notification('转移石', { body: '出现了 ~~~' })
            return
          } else {
            move(pos, 34, 33)
          }
          break
        case 2:
        case 3:
          move(pos)
          // setTimeout(
          //   () => {
          //     if (state === 'challenge') {
          //       state = 'noop'
          //       setTimeout(
          //         () => {
          //           state = 'challenge'
          //         },
          //         30 * 1000
          //       )
          //     }
          //   },
          //   15 * 1000
          // )
          break
        case 4:
          if (dm.findPic(300, 300, 2000, 2000, 'can-not-continue-flag.bmp', '000000', 0.8, 0)) {
            state = 'home'
            nextState = 'enterIntoPackage'
          }
          break
        case 5:
          pos = fp('back-home.bmp', 2)
          if (pos) {
            move(pos)
            state = 'home'
            nextState = 'enterIntoPackage'
          }
          break
        case 6:
          move(pos, 91, 18)
          break
        case 7:
          move(pos, 90, 50)
          break
        default:
          break
      }
      click()
      return
    }

    let lastAbyssBossFlag = dm.findPic(240, 70, 768, 135, 'last.bmp', '000000', 0.8, 0)

    if (lastAbyssBossFlag) {
      setTimeout(() => {
        dm.moveTo(974, 345)
        click()
        let timer = setInterval(
          () => {
            dm.moveTo(974, 345)
            click()
          },
          500
        )
        setTimeout(
          () => {
            clearInterval(timer)
          },
          5000
        )
      }, 5000)
      return
    }

    if (!vm.businessman) {
      let passAbyssFlag = dm.findPic(444, 76, 680, 182, 'pass-abyss-flag-1.bmp|pass-abyss-flag-2.bmp', '000000', 0.8, 0)
      if (passAbyssFlag) {
        dm.moveTo(860, 30)
        click()
        setTimeout(
          () => {
            dm.moveTo(380, 460)
            click()
          },
          3000
        )
      }
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
          switch (vm.loop) {
            case 'abyss':
              nextState = 'enterIntoMysticPlace'
              break
            default:
              nextState = 'enterIntoOther'
              break
          }
        },
        90000
      )
    }
  },
  usePotion () {
    // let pos = fp('use-potion.bmp', 0)
    // if (pos) {
    //   move(pos, 34, 17)
    //   click()
    // }
    dm.moveTo(490, 110)
    click()
  }
}

let timer: NodeJS.Timeout

const start = () => {
  state = (vm.state as State)
  nextState = (vm.nextState as State)
  timer = setInterval(
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
}

const stop = () => {
  vm.state = state
  vm.nextState = nextState
  clearInterval(timer)
}

process.on(
  'exit',
  (code) => {
    console.log(`exit ${code}`)
    console.log(`unbind ${dm.unBindWindow()}`)
  }
)

export {
  hwnds,
  hwnd,
  fp,
  move,
  click,
  actions,
  start,
  stop
}
