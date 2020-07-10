/**
 * Implamentation fully based on: https://tc39.es/ecma262/#sec-promise-objects
 *
 * Note: Implementation assumes you are targeting old-javascript runtimes
 */

import { PROMISE_STATUS } from './constants.mjs'
import { CreateResolvingFunctions } from './CreateResolvingFunctions.mjs'
import { getAbruptCompletionObject } from './utils.mjs'
import { isAbruptCompletion } from './utils.mjs'
import { getAbruptCompletionValue } from './utils.mjs'
import { NewPromiseCapability } from './NewPromiseCapability.mjs'
import { PromiseResolve } from './PromiseResolve.mjs'
import { GetPromiseResolve } from './GetPromiseResolve.mjs'
import { PerformPromiseAll } from './PerformPromiseAll.mjs'
import { IsPromise } from './IsPromise.mjs'
import { PerformPromiseThen } from './PerformPromiseThen.mjs'

// 25.6.3.1 Promise ( executor )
// When the Promise function is called with argument executor, the following steps are taken:
function Promise (executor) {
  // 1. If NewTarget is undefined, throw a TypeError exception.
  if (new.target === undefined) {
    throw new TypeError('Promise must be invoked with the `new` operator')
  }

  // 2. If IsCallable(executor) is false, throw a TypeError exception.
  if (typeof executor !== 'function') {
    throw new TypeError('Invalid `executor` arg')
  }

  // 3. Let promise be ? OrdinaryCreateFromConstructor(NewTarget, "%Promise.prototype%", « [[PromiseState]],
  // [[PromiseResult]], [[PromiseFulfillReactions]], [[PromiseRejectReactions]], [[PromiseIsHandled]] »).
  var promise = this

  // 4. Set promise.[[PromiseState]] to pending.
  promise['[[PromiseState]]'] = PROMISE_STATUS.PENDING

  // 5. Set promise.[[PromiseFulfillReactions]] to a new empty List.
  promise['[[PromiseFulfillReactions]]'] = []

  // 6. Set promise.[[PromiseRejectReactions]] to a new empty List.
  promise['[[PromiseRejectReactions]]'] = []

  // 7. Set promise.[[PromiseIsHandled]] to false.
  promise['[[PromiseIsHandled]]'] = false

  // 8. Let resolvingFunctions be CreateResolvingFunctions(promise).
  var resolvingFunctions = CreateResolvingFunctions(promise)

  var completion

  try {
    // 9. Let completion be Call(executor, undefined, « resolvingFunctions.[[Resolve]], resolvingFunctions.[[Reject]] »).
    completion = executor.call(undefined, resolvingFunctions['[[Resolve]]'], resolvingFunctions['[[Reject]]'])
  } catch (error) {
    completion = getAbruptCompletionObject(error)
  }

  // 10. If completion is an abrupt completion, then
  if (isAbruptCompletion(completion)) {
    // a. Perform ? Call(resolvingFunctions.[[Reject]], undefined, « completion.[[Value]] »).
    resolvingFunctions['[[Reject]]'].call(undefined, getAbruptCompletionValue(completion))
  }

  return promise
}

// 25.6.4.5 Promise.reject ( r )
// The reject function returns a new promise rejected with the passed argument.
Promise.reject = function (r) {
  // 1. Let C be the this value.
  var C = this

  // 2. Let promiseCapability be ? NewPromiseCapability(C).
  var promiseCapability = NewPromiseCapability(C)

  // 3. Perform ? Call(promiseCapability.[[Reject]], undefined, « r »).
  promiseCapability['[[Reject]]'].call(undefined, r)

  // 4. Return promiseCapability.[[Promise]].
  return promiseCapability['[[Promise]]']
}

// 25.6.4.6 Promise.resolve ( x )
// The resolve function returns either a new promise resolved with the passed argument, or the argument
// itself if the argument is a promise produced by this constructor.
Promise.resolve = function (x) {
  // 1. Let C be the this value.
  var C = this

  // 2. If Type(C) is not Object, throw a TypeError exception.
  if (typeof C !== 'object' || C === null) {
    throw new TypeError('Invalid promise')
  }

  // 3. Return ? PromiseResolve(C, x).
  return PromiseResolve(C, x)
}

// 25.6.4 Properties of the Promise Constructor
// 25.6.4.1 Promise.all ( iterable )
// The all function returns a new promise which is fulfilled with an array of fulfillment values for the passed promises,
// or rejects with the reason of the first passed promise that rejects. It resolves all elements of the passed iterable
// to promises as it runs this algorithm.
Promise.all = function (iterable) {
  // 1. Let C be the this value.
  var C = this

  // 2. Let promiseCapability be ? NewPromiseCapability(C).
  var promiseCapability = NewPromiseCapability(C)

  // 3. Let promiseResolve be GetPromiseResolve(C).
  var promiseResolve = GetPromiseResolve(C)

  // TODO: 4. IfAbruptRejectPromise(promiseResolve, promiseCapability).
  // 5. Let iteratorRecord be GetIterator(iterable).
  var iteratorRecord = iterable[Symbol.iterator]()

  // TODO: 6. IfAbruptRejectPromise(iteratorRecord, promiseCapability).
  // 7. Let result be PerformPromiseAll(iteratorRecord, C, promiseCapability, promiseResolve).
  var result = PerformPromiseAll(iteratorRecord, C, promiseCapability, promiseResolve)

  // TODO: 8. If result is an abrupt completion, then
  // TODO: a. If iteratorRecord.[[Done]] is false, set result to IteratorClose(iteratorRecord, result).
  // TODO: b. IfAbruptRejectPromise(result, promiseCapability).

  // 9. Return Completion(result).
  return result
}

// 25.6.5 Properties of the Promise Prototype Object
Promise.prototype = {
  // 25.6.5.2 Promise.prototype.constructor
  // The initial value of Promise.prototype.constructor is %Promise%.
  constructor: Promise,

  // 25.6.5.4 Promise.prototype.then ( onFulfilled, onRejected )
  // When the then method is called with arguments onFulfilled and onRejected, the following steps are taken:
  then: function (onFulfilled, onRejected) {
    // 1. Let promise be the this value.
    var promise = this

    // 2. If IsPromise(promise) is false, throw a TypeError exception.
    if (!IsPromise(promise)) {
      throw new TypeError('Target is not a promise')
    }

    // 3. Let C be ? SpeciesConstructor(promise, %Promise%).
    var C = promise.constructor

    // 4. Let resultCapability be ? NewPromiseCapability(C).
    var resultCapability = NewPromiseCapability(C)

    // 5. Return PerformPromiseThen(promise, onFulfilled, onRejected, resultCapability).
    return PerformPromiseThen(promise, onFulfilled, onRejected, resultCapability)
  },

  // 25.6.5.1 Promise.prototype.catch ( onRejected )
  // When the catch method is called with argument onRejected, the following steps are taken:
  catch: function (onRejected) {
    // 1. Let promise be the this value.
    var promise = this

    // 2. Return ? Invoke(promise, "then", « undefined, onRejected »).
    return promise.then(undefined, onRejected)
  },

  // 25.6.5.3 Promise.prototype.finally ( onFinally )
  // When the finally method is called with argument onFinally, the following steps are taken:
  finally: function (onFinally) {
    // 1. Let promise be the this value.
    var promise = this

    // 2. If Type(promise) is not Object, throw a TypeError exception.
    if (typeof promise !== 'object' || promise === null) {
      throw new TypeError('Invalid promise target')
    }

    // 3. Let C be ? SpeciesConstructor(promise, %Promise%).
    var C = promise.constructor

    var thenFinally
    var catchFinally

    // 4. Assert: IsConstructor(C) is true. (omitted)
    // 5. If IsCallable(onFinally) is false, then
    if (typeof onFinally !== 'function') {
      thenFinally = onFinally
      catchFinally = onFinally

    // 6. Else,
    } else {
      // a. Let stepsThenFinally be the algorithm steps defined in Then Finally Functions.
      // b. Let thenFinally be ! CreateBuiltinFunction(stepsThenFinally, « [[Constructor]], [[OnFinally]] »).
      // 25.6.5.3.1 Then Finally Functions
      // A Then Finally function is an anonymous built-in function that has a [[Constructor]] and an [[OnFinally]] internal slot.
      // The value of the [[Constructor]] internal slot is a Promise-like constructor function object, and the value of the
      // [[OnFinally]] internal slot is a function object.
      // When a Then Finally function is called with argument value, the following steps are taken:
      thenFinally = function (value) {
        // 1. Let F be the active function object.
        var F = thenFinally

        // 2. Let onFinally be F.[[OnFinally]].
        var onFinally = F['[[OnFinally]]']

        // 3. Assert: IsCallable(onFinally) is true. (omitted)
        // 4. Let result be ? Call(onFinally, undefined).
        var result = onFinally.call(undefined)

        // 5. Let C be F.[[Constructor]].
        var C = F['[[Constructor]]']

        // 6. Assert: IsConstructor(C) is true. (omitted)
        // 7. Let promise be ? PromiseResolve(C, result).
        var promise = PromiseResolve(C, result)

        // 8. Let valueThunk be equivalent to a function that returns value.
        var valueThunk = function () {
          return value
        }

        // 9. Return ? Invoke(promise, "then", « valueThunk »).
        return promise.then(valueThunk)
      }

      // c. Set thenFinally.[[Constructor]] to C.
      thenFinally['[[Constructor]]'] = C

      // d. Set thenFinally.[[OnFinally]] to onFinally.
      thenFinally['[[OnFinally]]'] = onFinally

      // e. Let stepsCatchFinally be the algorithm steps defined in Catch Finally Functions.
      // f. Let catchFinally be ! CreateBuiltinFunction(stepsCatchFinally, « [[Constructor]], [[OnFinally]] »).
      // 25.6.5.3.2 Catch Finally Functions
      // A Catch Finally function is an anonymous built-in function that has a [[Constructor]] and an [[OnFinally]] internal slot.
      // The value of the [[Constructor]] internal slot is a Promise-like constructor function object, and the value of the
      // [[OnFinally]] internal slot is a function object.
      // When a Catch Finally function is called with argument reason, the following steps are taken:
      catchFinally = function (reason) {
        // 1. Let F be the active function object.
        var F = catchFinally

        // 2. Let onFinally be F.[[OnFinally]].
        var onFinally = F['[[OnFinally]]']

        // 3. Assert: IsCallable(onFinally) is true. (omitted)
        // 4. Let result be ? Call(onFinally, undefined).
        var result = onFinally.call(undefined)

        // 5. Let C be F.[[Constructor]].
        var C = F['[[Constructor]]']

        // 6. Assert: IsConstructor(C) is true. (omitted)
        // 7. Let promise be ? PromiseResolve(C, result).
        var promise = PromiseResolve(C, result)

        // 8. Let thrower be equivalent to a function that throws reason.
        var thrower = function () {
          throw reason
        }

        // 9. Return ? Invoke(promise, "then", « thrower »).
        return promise.then(thrower)
      }

      // g. Set catchFinally.[[Constructor]] to C.
      catchFinally['[[Constructor]]'] = C

      // h, Set catchFinally.[[OnFinally]] to onFinally.
      catchFinally['[[OnFinally]]'] = onFinally
    }

    // 7. Return ? Invoke(promise, "then", « thenFinally, catchFinally »).
    return promise.then(thenFinally, catchFinally)
  }
}

export default Promise
