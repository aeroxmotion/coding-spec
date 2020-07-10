import { PROMISE_STATUS } from './constants.mjs'
import { TriggerPromiseReactions } from './TriggerPromiseReactions.mjs'
import { HostPromiseRejectionTracker } from './HostPromiseRejectionTracker.mjs'

// 25.6.1.7 RejectPromise ( promise, reason )
// The abstract operation RejectPromise takes arguments promise and reason. It performs the following steps when called:
export function RejectPromise (promise, reason) {
  // 1. Assert: The value of promise.[[PromiseState]] is pending. (omitted)
  // 2. Let reactions be promise.[[PromiseRejectReactions]].
  var reactions = promise['[[PromiseRejectReactions]]']

  // 3. Set promise.[[PromiseResult]] to reason.
  promise['[[PromiseResult]]'] = reason

  // 4. Set promise.[[PromiseFulfillReactions]] to undefined.
  promise['[[PromiseFulfillReactions]]'] = undefined

  // 5. Set promise.[[PromiseRejectReactions]] to undefined.
  promise['[[PromiseRejectReactions]]'] = undefined

  // 6. Set promise.[[PromiseState]] to rejected.
  promise['[[PromiseState]]'] = PROMISE_STATUS.REJECTED

  // 7. If promise.[[PromiseIsHandled]] is false, perform HostPromiseRejectionTracker(promise, "reject").
  if (!promise['[[PromiseIsHandled]]']) {
    HostPromiseRejectionTracker(promise, 'reject')
  }

  // 8. Return TriggerPromiseReactions(reactions, reason).
  return TriggerPromiseReactions(reactions, reason)
}
