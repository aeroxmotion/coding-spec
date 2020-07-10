import PromiseImpl from './index.mjs'

new PromiseImpl((resolve, reject) => {
  reject('Hello world!')
})
.catch(console.log)

console.log('Non-delayed')
