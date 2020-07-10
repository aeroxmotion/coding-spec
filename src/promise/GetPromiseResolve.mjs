// 25.6.4.1.1 Runtime Semantics: GetPromiseResolve ( promiseConstructor )
// The abstract operation GetPromiseResolve takes argument promiseConstructor. It performs the following steps when called:
export function GetPromiseResolve (promiseConstructor) {
  // 1. Assert: IsConstructor(promiseConstructor) is true. (omitted)
  // 2. Let promiseResolve be ? Get(promiseConstructor, "resolve").
  var promiseResolve = promiseConstructor.resolve

  // 3. If IsCallable(promiseResolve) is false, throw a TypeError exception.
  if (typeof promiseResolve !== 'function') {
    throw new TypeError('missing `resolve`')
  }

  // 4. Return promiseResolve.
  return promiseResolve
}
