// 25.6.4.1.2 Runtime Semantics: PerformPromiseAll ( iteratorRecord, constructor, resultCapability, promiseResolve )
// The abstract operation PerformPromiseAll takes arguments iteratorRecord, constructor, resultCapability (a PromiseCapability Record),
// and promiseResolve. It performs the following steps when called:
export function PerformPromiseAll (iteratorRecord, constructor, resultCapability, promiseResolve) {
  // 1. Assert: IsConstructor(constructor) is true. (omitted)
  // 2. Assert: IsCallable(promiseResolve) is true. (omitted)
  // 3. Let values be a new empty List.
  var values = []

  // 4. Let remainingElementsCount be the Record { [[Value]]: 1 }.
  var remainingElementsCount = { '[[Value]]': 1 }

  // 5. Let index be 0.
  var index = 0

  // 6. Repeat,
  while (true) {
    // a. Let next be IteratorStep(iteratorRecord).
    var next = iteratorRecord.next()

    // TODO: b. If next is an abrupt completion, set iteratorRecord.[[Done]] to true.
    // TODO: c. ReturnIfAbrupt(next).
    // d. If next is false, then
    if (next.done) {
      // TODO: i. Set iteratorRecord.[[Done]] to true.
      // ii. Set remainingElementsCount.[[Value]] to remainingElementsCount.[[Value]] - 1.
      remainingElementsCount['[[Value]]'] -= 1

      // iii. If remainingElementsCount.[[Value]] is 0, then
      if (remainingElementsCount['[[Value]]'] === 0) {
        // 1. Let valuesArray be ! CreateArrayFromList(values).
        var valuesArray = values.slice()

        // 2. Perform ? Call(resultCapability.[[Resolve]], undefined, « valuesArray »).
        resultCapability['[[Resolve]]'].apply(undefined, valuesArray)
      }

      // iv. Return resultCapability.[[Promise]].
      return resultCapability['[[Promise]]']
    }

    // e. Let nextValue be IteratorValue(next).
    var nextValue = next.value

    // TODO: f. If nextValue is an abrupt completion, set iteratorRecord.[[Done]] to true.
    // TODO: g. ReturnIfAbrupt(nextValue).
    // h. Append undefined to values.
    values.push(undefined)

    // i. Let nextPromise be ? Call(promiseResolve, constructor, « nextValue »).
    var nextPromise = promiseResolve.call(constructor, nextValue)

    // j. Let steps be the algorithm steps defined in Promise.all Resolve Element Functions.
    // k. Let resolveElement be ! CreateBuiltinFunction(steps, « [[AlreadyCalled]], [[Index]], [[Values]], [[Capability]], [[RemainingElements]] »).
    // 25.6.4.1.3 Promise.all Resolve Element Functions
    // A Promise.all resolve element function is an anonymous built-in function that is used to resolve a specific Promise.all element.
    // Each Promise.all resolve element function has [[Index]], [[Values]], [[Capability]], [[RemainingElements]], and [[AlreadyCalled]] internal slots.
    // When a Promise.all resolve element function is called with argument x, the following steps are taken:
    var resolveElement = function (x) {
      // 1. Let F be the active function object.
      var F = resolveElement

      // 2. Let alreadyCalled be F.[[AlreadyCalled]].
      var alreadyCalled = F['[[AlreadyCalled]]']

      // 3. If alreadyCalled.[[Value]] is true, return undefined.
      if (alreadyCalled['[[Value]]']) {
        return undefined
      }

      // 4. Set alreadyCalled.[[Value]] to true.
      alreadyCalled['[[Value]]'] = true

      // 5. Let index be F.[[Index]].
      var index = F['[[Index]]']

      // 6. Let values be F.[[Values]].
      var values = F['[[Values]]']

      // 7. Let promiseCapability be F.[[Capability]].
      var promiseCapability = F['[[Capability]]']

      // 8. Let remainingElementsCount be F.[[RemainingElements]].
      var remainingElementsCount = F['[[RemainingElements]]']

      // 9. Set values[index] to x.
      values[index] = x

      // 10. Set remainingElementsCount.[[Value]] to remainingElementsCount.[[Value]] - 1.
      remainingElementsCount['[[Value]]'] -= 1

      // 11. If remainingElementsCount.[[Value]] is 0, then
      if (remainingElementsCount['[[Value]]'] === 0) {
        // a. Let valuesArray be ! CreateArrayFromList(values).
        var valuesArray = values.slice()

        // b. Return ? Call(promiseCapability.[[Resolve]], undefined, « valuesArray »).
        promiseCapability['[[Resolve]]'].call(undefined, valuesArray)
      }

      // 12. Return undefined.
      return undefined
    }

    // l. Set resolveElement.[[AlreadyCalled]] to the Record { [[Value]]: false }.
    resolveElement['[[AlreadyCalled]]'] = { '[[Value]]': false }

    // m. Set resolveElement.[[Index]] to index.
    resolveElement['[[Index]]'] = index

    // n. Set resolveElement.[[Values]] to values.
    resolveElement['[[Values]]'] = values

    // o. resolveElement.[[Capability]] to resultCapability.
    resolveElement['[[Capability]]'] = resultCapability

    // p. resolveElement.[[RemainingElements]] to remainingElementsCount.
    resolveElement['[[RemainingElements]]'] = remainingElementsCount

    // q. Set remainingElementsCount.[[Value]] to remainingElementsCount.[[Value]] + 1.
    remainingElementsCount['[[Value]]'] += 1

    // r. Perform ? Invoke(nextPromise, "then", « resolveElement, resultCapability.[[Reject]] »).
    nextPromise.then(resolveElement, resultCapability['[[Reject]]'])

    // s. Set index to index + 1.
    index++
  }
}
