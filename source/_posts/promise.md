---
title: promise
date: 2019-05-30
update: 2019-10-05 09:53:07
tags: promise
---

todo

<!--more-->

````javascript
class P {
  constructor(exector) {
    if (typeof exector !== 'function')
      throw TypeError(`Promise resolver ${arguments[0]} is not a function`)

    this.status = 'pending'
    this.value = null
    this.resolveList = []
    this.rejectList = []

    try {
      exector(this._resolve.bind(this), this._reject.bind(this))
    } catch (e) {
      this._reject(e)
      throw e
    }
  }

  _resolve(value) {
    if (this.status === 'pending') {
      this.value = value
      if (value instanceof P) {
        value.then(value => {
          this.value = value
        })
      }
      this.status = 'fulfilled'
      setTimeout(() => {
        this.resolveList.forEach(resolve => {
          resolve(this.value)
          this.resolveList.shift()
        })
      }, 0)
    }
  }

  _reject(value) {
    // console.log(value)
    if (this.status === 'pending') {
      this.status = 'rejected'
      this.value = value
      this.rejectList.forEach(reject => {
        reject(this.value)
        this.rejectList.shift()
      })
    }
  }

  then(resolveFn, rejectFn) {
    resolveFn = typeof resolveFn === 'function' ? resolveFn : value => value
    rejectFn = typeof rejectFn === 'function' ? rejectFn : value => value

    if (this.status === 'fulfilled') {
      return new P((resolve, reject) => {
        const result = resolveFn(this.value)
        if (result instanceof P) result.then(resolve, reject)
        resolve(result)
      })
    }

    if (this.status === 'rejected') {
      return new P((resolve, reject) => {
        const result = rejectFn(this.value)
        if (result instanceof P) result.then(resolve, reject)
        reject(result)
      })
    }

    if (this.status === 'pending') {
      return new P((resolve, reject) => {
        this.resolveList.push(() => {
          try {
            const result = resolveFn(this.value)
            resolve(result)
          } catch (e) {
            reject(e)
          }
        })

        this.rejectList.push(() => {
          try {
            const result = rejectFn(this.value)
            resolve(result)
          } catch (e) {
            reject(e)
          }
        })
      })
    }
  }

  static resolve(value) {
    if (value instanceof P) return value
    return new P(resolve => resolve(value))
  }

  static reject(value) {
    return new P((resolve, reject) => reject(value))
  }

  catch(rejectFn) {
    return this.then(undefined, rejectFn)
  }
}

new P((resolve, reject) => {
  setTimeout(() => reject('init'), 1000)
})
  .then(data => {
    console.log(data)
    return 'first'
  })
  .then(data => {
    console.log(data)
    return 'second'
  })
  .then(data => {
    console.log(data)
  })```
````
