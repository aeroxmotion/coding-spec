// 25.6.1.5 NewPromiseCapability ( C )
// The abstract operation NewPromiseCapability takes argument C. It attempts to use C as a constructor
// in the fashion of the built-in Promise constructor to create a Promise object and extract its resolve and
// reject functions. The Promise object plus the resolve and reject functions are used to initialize a
// new PromiseCapability Record. It performs the following steps when called:
export function NewPromiseCapability (C) {
  // 1. If IsConstructor(C) is false, throw a TypeError exception. (omitted)
  // 2. NOTE: C is assumed to be a constructor function that supports the parameter conventions of the Promise constructor (see 25.6.3.1).
  // 3. Let promiseCapability be the PromiseCapability Record { [[Promise]]: undefined, [[Resolve]]: undefined, [[Reject]]: undefined }.
  var promiseCapability = {
    '[[Promise]]': undefined,
    '[[Resolve]]': undefined,
    '[[Reject]]': undefined
  }

  // 4. Let steps be the algorithm steps defined in GetCapabilitiesExecutor Functions.
  // 5. Let executor be ! CreateBuiltinFunction(steps, « [[Capability]] »).
  // 25.6.1.5.1 GetCapabilitiesExecutor Functions
  // A GetCapabilitiesExecutor function is an anonymous built-in function that has a [[Capability]] internal slot.
  // When a GetCapabilitiesExecutor function is called with arguments resolve and reject, the following steps are taken:
  var executor = function (resolve, reject) {
    // 1. - 3. omitted
    // 4. If promiseCapability.[[Resolve]] is not undefined, throw a TypeError exception.
    if (promiseCapability['[[Resolve]]'] !== undefined) {
      throw new TypeError('overriding resolve')
    }

    // 5. If promiseCapability.[[Reject]] is not undefined, throw a TypeError exception.
    if (promiseCapability['[[Reject]]'] !== undefined) {
      throw new TypeError('overriding reject')
    }

    // 6. Set promiseCapability.[[Resolve]] to resolve.
    promiseCapability['[[Resolve]]'] = resolve

    // 7. Set promiseCapability.[[Reject]] to reject.
    promiseCapability['[[Reject]]'] = reject

    // 8. Return undefined.
    return undefined
  }

  // 6. Set executor.[[Capability]] to promiseCapability.
  executor['[[Capability]]'] = promiseCapability

  // 7. Let promise be ? Construct(C, « executor »).
  var promise = new C(executor)

  // 8. If IsCallable(promiseCapability.[[Resolve]]) is false, throw a TypeError exception.
  if (typeof promiseCapability['[[Resolve]]'] !== 'function') {
    throw new TypeError('missing resolve')
  }

  // 9. If IsCallable(promiseCapability.[[Reject]]) is false, throw a TypeError exception.
  if (typeof promiseCapability['[[Reject]]'] !== 'function') {
    throw new TypeError('missing reject')
  }

  // 10. Set promiseCapability.[[Promise]] to promise.
  promiseCapability['[[Promise]]'] = promise

  // 11. Return promiseCapability.
  return promiseCapability
}
