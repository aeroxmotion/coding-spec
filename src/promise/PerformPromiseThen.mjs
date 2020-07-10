import { PROMISE_STATUS } from './constants.mjs'
import { NewPromiseReactionJob } from './NewPromiseReactionJob.mjs'
import { HostPromiseRejectionTracker } from './HostPromiseRejectionTracker.mjs'
import { HostEnqueuePromiseJob } from './HostEnqueuePromiseJob.mjs'

// 25.6.5.4.1 PerformPromiseThen ( promise, onFulfilled, onRejected [ , resultCapability ] )
// The abstract operation PerformPromiseThen takes arguments promise, onFulfilled, and onRejected and optional
// argument resultCapability (a PromiseCapability Record). It performs the “then” operation on promise using
// onFulfilled and onRejected as its settlement actions. If resultCapability is passed, the result is stored
// by updating resultCapability's promise. If it is not passed, then PerformPromiseThen is being called by a
// specification-internal operation where the result does not matter. It performs the following steps when called:
export function PerformPromiseThen (promise, onFulfilled, onRejected, resultCapability) {
  // 1. Assert: IsPromise(promise) is true. (omitted)
  // 2. If resultCapability is not present, then (omitted)
  // a. Set resultCapability to undefined. (omitted)
  // 3. If IsCallable(onFulfilled) is false, then
  if (typeof onFulfilled !== 'function') {
    // a. Set onFulfilled to undefined.
    onFulfilled = undefined
  }

  // 4. If IsCallable(onRejected) is false, then
  if (typeof onRejected !== 'function') {
    // a. Set onRejected to undefined.
    onRejected = undefined
  }

  // 5. Let fulfillReaction be the PromiseReaction { [[Capability]]: resultCapability, [[Type]]: Fulfill, [[Handler]]: onFulfilled }.
  var fulfillReaction = {
    '[[Capability]]': resultCapability,
    '[[Type]]': 'Fulfill',
    '[[Handler]]': onFulfilled
  }

  // 6. Let rejectReaction be the PromiseReaction { [[Capability]]: resultCapability, [[Type]]: Reject, [[Handler]]: onRejected }.
  var rejectReaction = {
    '[[Capability]]': resultCapability,
    '[[Type]]': 'Reject',
    '[[Handler]]': onRejected
  }

  // 7. If promise.[[PromiseState]] is pending, then
  if (promise['[[PromiseState]]'] === PROMISE_STATUS.PENDING) {
    promise['[[PromiseFulfillReactions]]'].push(fulfillReaction)
    promise['[[PromiseRejectReactions]]'].push(rejectReaction)

  // 8. Else if promise.[[PromiseState]] is fulfilled, then
  } else if (promise['[[PromiseState]]'] === PROMISE_STATUS.FULFILLED) {
    // a. Let value be promise.[[PromiseResult]].
    var value = promise['[[PromiseResult]]']

    // b. Let fulfillJob be NewPromiseReactionJob(fulfillReaction, value).
    var fulfillJob = NewPromiseReactionJob(fulfillReaction, value)

    // c. Perform HostEnqueuePromiseJob(fulfillJob.[[Job]], fulfillJob.[[Realm]]).
    HostEnqueuePromiseJob(fulfillJob['[[Job]]'], fulfillJob['[[Realm]]'])

  // 9. Else,
  } else {
    // a. Assert: The value of promise.[[PromiseState]] is rejected. (omitted)
    // b. Let reason be promise.[[PromiseResult]].
    var reason = promise['[[PromiseResult]]']

    // c. If promise.[[PromiseIsHandled]] is false, perform HostPromiseRejectionTracker(promise, "handle").
    if (!promise['[[PromiseIsHandled]]']) {
      HostPromiseRejectionTracker(promise, 'handle')
    }

    // d. Let rejectJob be NewPromiseReactionJob(rejectReaction, reason).
    var rejectJob = NewPromiseReactionJob(rejectReaction, reason)

    // e. Perform HostEnqueuePromiseJob(rejectJob.[[Job]], rejectJob.[[Realm]]).
    HostEnqueuePromiseJob(rejectJob['[[Job]]'], rejectJob['[[Realm]]'])
  }

  // 10. Set promise.[[PromiseIsHandled]] to true.
  promise['[[PromiseIsHandled]]'] = true

  // 11. If resultCapability is undefined, then
  if (resultCapability === undefined) {
    // a. Return undefined.
    return undefined

  // 12 Else,
  } else {
    // a. Return resultCapability.[[Promise]].
    return resultCapability['[[Promise]]']
  }
}
