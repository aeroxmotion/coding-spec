import { PROMISE_STATUS } from './constants.mjs'
import { TriggerPromiseReactions } from './TriggerPromiseReactions.mjs'

// 25.6.1.4 FulfillPromise ( promise, value )
// The abstract operation FulfillPromise takes arguments promise and value. It performs the following steps when called:
export function FulfillPromise (promise, value) {
  // 1. Assert: The value of promise.[[PromiseState]] is pending. (omitted)
  // 2. Let reactions be promise.[[PromiseFulfillReactions]].
  var reactions = promise['[[PromiseFulfillReactions]]']

  // 3. Set promise.[[PromiseResult]] to value.
  promise['[[PromiseResult]]'] = value

  // 4. Set promise.[[PromiseFulfillReactions]] to undefined.
  promise['[[PromiseFulfillReactions]]'] = undefined

  // 5. Set promise.[[PromiseRejectReactions]] to undefined.
  promise['[[PromiseRejectReactions]]'] = undefined

  // 6. Set promise.[[PromiseState]] to fulfilled.
  promise['[[PromiseState]]'] = PROMISE_STATUS.FULFILLED

  // 7. Return TriggerPromiseReactions(reactions, value).
  return TriggerPromiseReactions(reactions, value)
}
