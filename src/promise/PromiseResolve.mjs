import { IsPromise } from './IsPromise.mjs'
import { NewPromiseCapability } from './NewPromiseCapability.mjs'

// 25.6.4.6.1 PromiseResolve ( C, x )
// The abstract operation PromiseResolve takes arguments C (a constructor) and x (an ECMAScript language value).
// It returns a new promise resolved with x. It performs the following steps when called:
export function PromiseResolve (C, x) {
  // 1. Assert: Type(C) is Object. (omitted)
  // 2. If IsPromise(x) is true, then
  if (IsPromise(x)) {
    // a. Let xConstructor be ? Get(x, "constructor").
    var xConstructor = x.constructor

    // b. If SameValue(xConstructor, C) is true, return x.
    if (xConstructor === C) {
      return x
    }
  }

  // 3. Let promiseCapability be ? NewPromiseCapability(C).
  var promiseCapability = NewPromiseCapability(C)

  // 4. Perform ? Call(promiseCapability.[[Resolve]], undefined, « x »).
  promiseCapability['[[Resolve]]'].call(undefined, x)

  // 5. Return promiseCapability.[[Promise]].
  return promiseCapability['[[Promise]]']
}
