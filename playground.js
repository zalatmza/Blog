/**
 * Created by wconisan on 2020/4/17.
 */
// 用 Class 实现 EventEmitter，要求拥有 on，once，emit，off 方法
class EventEmitter {
  events = {}

  on (eventName, cb) {
    if (this.events[eventName] === undefined) {
      this.events[eventName] = []
    }

    this.events[eventName].push(cb)
  }

  emit(eventName, ...arg) {
    (this.events[eventName] || []).forEach(cb => {
      cb(...arg)
    })
  }

  once (eventName, cb) {
    const fn = (...arg) => {
      cb.apply(this, arg)
      this.off(eventName, fn)
    }

    this.on(eventName, fn)
  }

  off (eventName, cb) {
    if (this.events[eventName]) {
      this.events[eventName].splice(this.events[eventName].indexOf(cb) >>> 0, 1)
    }
  }
}

const ee = new EventEmitter()

ee.once('print', (e) => {
  console.log('1' + e)
})

const foo = () => {
  console.log('foo')
}
ee.on('foo', foo)

ee.emit('print', 1) // 11
ee.emit('print', 2) // unemit

ee.emit('foo') // foo
ee.off('foo', foo)

ee.emit('foo') // unemit