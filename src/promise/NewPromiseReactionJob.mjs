import { getAbruptCompletionObject, isAbruptCompletion, getAbruptCompletionValue } from './utils.mjs'

// 25.6.2.1 NewPromiseReactionJob ( reaction, argument )
// The abstract operation NewPromiseReactionJob takes arguments reaction and argument. It returns a new Job Abstract Closure
// that applies the appropriate handler to the incoming value, and uses the handler's return value to resolve or reject the
// derived promise associated with that handler. It performs the following steps when called:
export function NewPromiseReactionJob (reaction, argument) {
  // 1. Let job be a new Job Abstract Closure with no parameters that captures reaction and argument and performs the following steps when called:
  var job = function () {
    // a. Assert: reaction is a PromiseReaction Record. (omitted)
    // b. Let promiseCapability be reaction.[[Capability]].
    var promiseCapability = reaction['[[Capability]]']

    // c. Let type be reaction.[[Type]].
    var type = reaction['[[Type]]']

    // d. Let handler be reaction.[[Handler]].
    var handler = reaction['[[Handler]]']

    var handlerResult

    // e. If handler is undefined, then
    if (handler === undefined) {
      // i. If type is Fulfill, let handlerResult be NormalCompletion(argument).
      if (type === 'Fulfill') {
        handlerResult = argument

      // ii. Else,
      } else {
        // 1. Assert: type is Reject. (omitted)

        // 2. Let handlerResult be ThrowCompletion(argument).
        handlerResult = getAbruptCompletionObject(argument)
      }

    // f. Else, let handlerResult be Call(handler, undefined, « argument »).
    } else {
      try {
        handlerResult = handler.call(undefined, argument)
      } catch (error) {
        handlerResult = getAbruptCompletionObject(handler)
      }
    }

    // g. If promiseCapability is undefined, then
    if (promiseCapability === undefined) {
      // i. Assert: handlerResult is not an abrupt completion.
      // ii. Return NormalCompletion(empty).
      return undefined
    }

    var status

    // h. Assert: promiseCapability is a PromiseCapability Record. (omitted)
    // i. If handlerResult is an abrupt completion, then
    if (isAbruptCompletion(handlerResult)) {
      // i. Let status be Call(promiseCapability.[[Reject]], undefined, « handlerResult.[[Value]] »).
      status = promiseCapability['[[Reject]]'].call(undefined, getAbruptCompletionValue(handlerResult))

    // j. Else,
    } else {
      // i. Let status be Call(promiseCapability.[[Resolve]], undefined, « handlerResult.[[Value]] »).
      status = promiseCapability['[[Resolve]]'].call(undefined, handlerResult)
    }

    // k. Return Completion(status).
    return status
  }

  // 2. Let handlerRealm be null.
  var handlerRealm = null

  // 3. If reaction.[[Handler]] is not undefined, then
  // a. Let getHandlerRealmResult be GetFunctionRealm(reaction.[[Handler]]).
  // b. If getHandlerRealmResult is a normal completion, then set handlerRealm to getHandlerRealmResult.[[Value]].
  // 4. Return the Record { [[Job]]: job, [[Realm]]: handlerRealm }.
  return {
    '[[Job]]': job,
    '[[Realm]]': handlerRealm
  }
}
