// 25.6.1.9 HostPromiseRejectionTracker ( promise, operation )
// HostPromiseRejectionTracker is an implementation-defined abstract operation that allows host environments to track promise rejections.
// An implementation of HostPromiseRejectionTracker must complete normally in all cases.
// The default implementation of HostPromiseRejectionTracker is to unconditionally return an empty normal completion.

/**
 * Partial implementation took from: https://html.spec.whatwg.org/multipage/webappapis.html#the-hostpromiserejectiontracker-implementation
 */
// about-to-be-notified rejected promises list
var rejectedPromises = []

export function HostPromiseRejectionTracker (promise, operation) {
  // 4. If operation is "reject",
  if (operation === 'reject') {
    // 5. Add promise to settings object's about-to-be-notified rejected promises list.
    rejectedPromises.push(promise)

    // Unhandled rejections: https://html.spec.whatwg.org/multipage/webappapis.html#unhandled-promise-rejections
    // 1. Let list be a copy of settings object's about-to-be-notified rejected promises list.
    var list = rejectedPromises.slice()

    // 2. If list is empty, return.
    if (!list.length) {
      return
    }

    // 3. Clear settings object's about-to-be-notified rejected promises list.
    rejectedPromises.length = 0

    // 4. [omitted]
    // 5. Queue a global task on the DOM manipulation task source given global to run the following substep:
    process.nextTick(() => {
      // 1. For each promise p in list:
      for (var i = 0; i < list.length; i++) {
        var p = list[i]

        // 2. If p's [[PromiseIsHandled]] internal slot is true, continue to the next iteration of the loop.
        if (p['[[PromiseIsHandled]]']) {
          continue
        }

        // 3.Let notHandled be the result of firing an event named unhandledrejection at global ,
        // using PromiseRejectionEvent, with the cancelable attribute initialized to true,
        // the promise attribute initialized to p, and the reason attribute initialized to the
        // value of p's [[PromiseResult]] internal slot.
        // TODO:

        // 4. If p's [[PromiseIsHandled]] internal slot is false, add p to settings object's outstanding rejected promises weak set.
        if (!p['[[PromiseIsHandled]]']) {
          throw new Error(`Unhandled rejection: ${promise['[[PromiseResult]]']}`)
        }
      }
    })
  }
}
