import { CreateResolvingFunctions } from './CreateResolvingFunctions.mjs'
import { isAbruptCompletion } from './utils.mjs'
import { getAbruptCompletionObject } from './utils.mjs'

// 25.6.2.2 NewPromiseResolveThenableJob ( promiseToResolve, thenable, then )
export function NewPromiseResolveThenableJob (promiseToResolve, thenable, then) {
  // 1. Let job be a new Job Abstract Closure with no parameters that captures promiseToResolve, thenable, and then and performs the following steps when called:
  var job = function () {
    // a. Let resolvingFunctions be CreateResolvingFunctions(promiseToResolve).
    var resolvingFunctions = CreateResolvingFunctions(promiseToResolve)

    var thenCallResult

    try {
      // b. Let thenCallResult be Call(then, thenable, « resolvingFunctions.[[Resolve]], resolvingFunctions.[[Reject]] »).
      thenCallResult = then.call(thenable, resolvingFunctions['[[Resolve]]'], resolvingFunctions['[[Reject]]'])
    } catch (error) {
      // Non-spec compliant
      thenCallResult = getAbruptCompletionObject(error)
    }

    // c. If thenCallResult is an abrupt completion, then
    if (isAbruptCompletion(thenCallResult)) {
      var status

      try {
        // i. Let status be Call(resolvingFunctions.[[Reject]], undefined, « thenCallResult.[[Value]] »).
        status = resolvingFunctions['[[Reject]]'].call(undefined, thenCallResult)
      } catch (error) {
        status = getAbruptCompletionObject(error)
      }

      // ii. Return Completion(status).
      return status
    }

    // d. Return Completion(thenCallResult).
    return thenCallResult
  }

  // 2. Let getThenRealmResult be GetFunctionRealm(then).
  // 3. If getThenRealmResult is a normal completion, then let thenRealm be getThenRealmResult.[[Value]].
  // 4. Otherwise, let thenRealm be null.
  var thenRealm = null

  return {
    '[[Job]]': job,
    '[[Realm]]': thenRealm
  }
}
