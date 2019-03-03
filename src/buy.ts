import path from 'path'
import dm from 'dm.dll'

let hwnds = dm.enumWindow('', '阿拉德', 1 + 2 + 4 + 8 + 16)
let hwnd = hwnds[0]

console.log(hwnds)

console.log(`set path ${dm.setPath(path.resolve('./data'))}`)

console.log(`bind ${dm.dll.BindWindow(hwnd, 'dx2', 'windows', 'windows', 0)}`)

let init = 0
let count = 50

let timer = setInterval(
  () => {
    console.log(init)
    if (init >= count) {
      clearInterval(timer)
    } else {
      const pos = dm.findPic(0, 0, 2000, 2000, 'continue-buy-10.bmp', '000000', 0.8, 0)
      if (pos) {
        dm.moveTo(pos.x + 60, pos.y + 20)
        dm.leftClick()
        init++
      }
    }
  },
  2000
)

process.on(
  'exit',
  (code) => {
    console.log(`exit ${code}`)
    console.log(`unbind ${dm.unBindWindow()}`)
  }
)
