const path = require('path')
const dm = require('dm.dll')

const hwnds = dm.enumWindow('', '阿拉德', 1 + 2 + 4 + 8 + 16)
const hwnd = dm.getWindow(hwnds[0], 1)

console.log(hwnds, hwnd)

console.log(`set path ${dm.setPath(path.resolve('./data'))}`)

console.log(`bind ${dm.bindWindow(hwnd, 'dx2', 'windows', 'windows', 0)}`)

const fp = (name, dir) => dm.findPic(0, 0, 2000, 2000, name, '000000', 0.8, dir)

const move = (pos, x = 0, y = 0) => dm.moveTo(pos.x + Math.floor(x / 2), pos.y + Math.floor(y / 2))

const click = () => dm.leftClick()

// dm.keyDown(37)

// setTimeout(() => {
//   dm.keyUp(37)
// }, 1000);
// dm.dll.KeyPressChar('left')
// dm.dll.KeyUpChar('left')
// setTimeout(() => {
//   dm.dll.KeyUpChar('x')
// }, 1000);

// console.log(dm.findPic(0, 120, 2000, 560, 'forward.bmp|boss-new.bmp|entrance-new.bmp', '000000', 0.6, 0))
// console.log(dm.findColor(0, 120, 2000, 560, 'fe3a01|e2e29c|aaffff', 1, 0))
// console.log(dm.findPic(0, 95, 2000, 2000, 'role-new.bmp', '000000', 0.8, 2))

// console.log(dm.findColor(0, 0, 2000, 560, '00ff0e', 0.8, 0))

// console.log(dm.findPic(0, 120, 2000, 560, 'right-entrance.bmp', '000000', 0.8, 2))

console.log(fp('potion.bmp', 2))
console.log(fp('transfer.bmp', 2))

// const notifier = require('node-notifier')

// // notifier.notify('Message')

// // notifier.notify({
// //   title: 'My notification',
// //   message: 'Hello, there!'
// // })

// notifier.notify(
//   {
//     title: 'My awesome title',
//     message: 'Hello from node, Mr. User!',
//     // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
//     // sound: true, // Only Notification Center or Windows Toasters
//     wait: true // Wait with callback, until user action is taken against notification
//   },
//   function(...args) {
//     // Response is response from notification
//     console.log(args)
//   }
// )


const WindowsToaster = require('node-notifier').WindowsToaster;
 
var notifier = new WindowsToaster({
  withFallback: true, // Fallback to Growl or Balloons?
  customPath: void 0 // Relative/Absolute path if you want to use your fork of SnoreToast.exe
});
 
notifier.notify(
  {
    title: 'x', // String. Required
    message: 'xx', // String. Required if remove is not defined
    wait: true,
    id: 10,
    appName: 'Snore.DesktopToasts'
  },
  function(...args) {
    console.log(args);
  }
);