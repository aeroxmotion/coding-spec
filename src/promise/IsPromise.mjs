// 25.6.1.6 IsPromise ( x )
// The abstract operation IsPromise takes argument x. It checks for the promise brand on an object.
// It performs the following steps when called:
export function IsPromise (x) {
  // 1. If Type(x) is not Object, return false.
  if (typeof x !== 'object' || x === null) {
    return false
  }

  // 2. If x does not have a [[PromiseState]] internal slot, return false.
  if (!Object.prototype.hasOwnProperty.call(x, '[[PromiseState]]')) {
    return false
  }

  // 3. Return true.
  return true
}
