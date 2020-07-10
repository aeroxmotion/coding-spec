import { RejectPromise } from './RejectPromise.mjs'
import { FulfillPromise } from './FulfillPromise.mjs'
import { NewPromiseResolveThenableJob } from './NewPromiseResolveThenableJob.mjs'
import { HostEnqueuePromiseJob } from './HostEnqueuePromiseJob.mjs'
import { isAbruptCompletion } from './utils.mjs'
import { getAbruptCompletionValue } from './utils.mjs'

// 25.6.1.3 CreateResolvingFunctions ( promise )
// The abstract operation CreateResolvingFunctions takes argument promise. It performs the following steps when called:
export function CreateResolvingFunctions (promise) {
  // 1. Let alreadyResolved be the Record { [[Value]]: false }.
  var alreadyResolved = { '[[Value]]': false }

  // 2. Let stepsResolve be the algorithm steps defined in Promise Resolve Functions.
  // 3. Let resolve be ! CreateBuiltinFunction(stepsResolve, « [[Promise]], [[AlreadyResolved]] »).
  // 25.6.1.3.2 Promise Resolve Functions
  // When a promise resolve function is called with argument resolution, the following steps are taken:
  var resolve = function (resolution) {
    // -- Here we omit from 1 to 4 irrelevant points --
    // 5. If alreadyResolved.[[Value]] is true, return undefined.
    if (alreadyResolved['[[Value]]']) {
      return undefined
    }

    // 6. Set alreadyResolved.[[Value]] to true.
    alreadyResolved['[[Value]]'] = true

    // 7. If SameValue(resolution, promise) is true, then
    if (resolution === promise) {
      // a. Let selfResolutionError be a newly created TypeError object.
      var selfResolutionError = new TypeError('Self resolution')

      // b. Return RejectPromise(promise, selfResolutionError).
      return RejectPromise(promise, selfResolutionError)
    }

    // 8. If Type(resolution) is not Object, then
    if (typeof resolution !== 'object' || resolution === null) {
      // a. Return FulfillPromise(promise, resolution).
      return FulfillPromise(promise, resolution)
    }

    // 9. Let then be Get(resolution, "then").
    var then = resolution.then

    // 10. If then is an abrupt completion, then
    if (isAbruptCompletion(then)) {
      // a. Return RejectPromise(promise, then.[[Value]]).
      return RejectPromise(getAbruptCompletionValue(then))
    }

    // 11. Let thenAction be then.[[Value]].
    var thenAction = then

    // 12. If IsCallable(thenAction) is false, then
    if (typeof thenAction !== 'function') {
      // a. Return FulfillPromise(promise, resolution).
      return FulfillPromise(promise, resolution)
    }

    // 13. Let job be NewPromiseResolveThenableJob(promise, resolution, thenAction).
    var job = NewPromiseResolveThenableJob(promise, resolution, thenAction)

    // 14. Perform HostEnqueuePromiseJob(job.[[Job]], job.[[Realm]]).
    HostEnqueuePromiseJob(job['[[Job]]'], job['[[Realm]]'])

    // 15. Return undefined.
    return undefined
  }

  // 4. Set resolve.[[Promise]] to promise.
  resolve['[[Promise]]'] = promise

  // 5. Set resolve.[[AlreadyResolved]] to alreadyResolved.
  resolve['[[AlreadyResolved]]'] = alreadyResolved

  // 6. Let stepsReject be the algorithm steps defined in Promise Reject Functions. (omitted)
  // 7. Let reject be ! CreateBuiltinFunction(stepsReject, « [[Promise]], [[AlreadyResolved]] »).
  // 25.6.1.3.1 Promise Reject Functions
  // When a promise reject function is called with argument reason, the following steps are taken:
  var reject = function (reason) {
    // -- Here we omit from 1 to 4 irrelevant points --
    // 5. If alreadyResolved.[[Value]] is true, return undefined.
    if (alreadyResolved['[[Value]]']) {
      return undefined
    }

    // 6. Set alreadyResolved.[[Value]] to true.
    alreadyResolved['[[Value]]'] = true

    // 7. Return RejectPromise(promise, reason).
    return RejectPromise(promise, reason)
  }

  // 8. Set resolve.[[Promise]] to promise.
  resolve['[[Promise]]'] = promise

  // 9. Set resolve.[[AlreadyResolved]] to alreadyResolved.
  resolve['[[AlreadyResolved]]'] = alreadyResolved

  // 10. Return the Record { [[Resolve]]: resolve, [[Reject]]: reject }.
  return {
    '[[Resolve]]': resolve,
    '[[Reject]]': reject
  }
}
