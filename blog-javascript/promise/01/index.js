const isFunction = obj => typeof obj === 'function'
const isObject = obj => !!(obj && typeof obj === 'object')
const isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj
const isPromise = promise => promise instanceof MyPromise

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  result = null
  state = PENDING
  callbacks = []
  ignore = false

  onFulfilled = (value) => this.transition(FULFILLED, value)
  onRejected = (reason) => this.transition(REJECTED, reason)

  constructor (exec) {
    try {
      exec(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }

  resolve (value) {
    if (this.ignore) return
    this.ignore = true

    if (value === this) {
      return this.onRejected(new TypeError('Can not fufill promise with itself'))
    }

    if (isPromise(value)) {
      return value.then(this.onFulfilled, this.onRejected)
    }

    if (isThenable(value)) {
      try {
        let then = value.then
        if (isFunction(then)) {
          return new MyPromise(then.bind(value)).then(this.onFulfilled, this.onRejected)
        }
      } catch (error) {
        return this.onRejected(error)
      }
    }

    this.onFulfilled(value)
  }

  reject (reason) {
    if (this.ignore) return
    this.ignore = true
    this.onRejected(reason)
  }

  then (onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      let callback = { onFulfilled, onRejected, resolve, reject }

      if (this.state === PENDING) {
        this.callbacks.push(callback)
      } else {
        setTimeout(() => this.handleCallback(callback, this.state, this.result), 0)
      }
    })
  }

  transition (state, result) {
    if (this.state !== PENDING) return
    this.state = state
    this.result = result
    setTimeout(() => this.handleCallbacks(state, result), 0)
  }

  handleCallback (callback, state, result) {
    let { onFulfilled, onRejected, resolve, reject } = callback
    try {
      if (state === FULFILLED) {
        isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
      } else if (state === REJECTED) {
        isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
      }
    } catch (error) {
      reject(error)
    }
  }

  handleCallbacks (state, result) {
    while (this.callbacks.length) this.handleCallback(this.callbacks.shift(), state, result)
  }
}

MyPromise.deferred  = function() {
  const defer = {}
  defer.promise = new MyPromise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

module.exports = MyPromise
