import { NewPromiseReactionJob } from './NewPromiseReactionJob.mjs'
import { HostEnqueuePromiseJob } from './HostEnqueuePromiseJob.mjs'

// 25.6.1.8 TriggerPromiseReactions ( reactions, argument )
// The abstract operation TriggerPromiseReactions takes arguments reactions
// (a collection of PromiseReaction Records) and argument. It enqueues a new Job for each record in reactions.
// Each such Job processes the [[Type]] and [[Handler]] of the PromiseReaction Record, and
// if the [[Handler]] is a function, calls it passing the given argument. If the [[Handler]] is undefined,
// the behaviour is determined by the [[Type]]. It performs the following steps when called:
export function TriggerPromiseReactions (reactions, argument) {
  // 1. For each reaction in reactions, in original insertion order, do
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i]

    // a. Let job be NewPromiseReactionJob(reaction, argument).
    var job = NewPromiseReactionJob(reaction, argument)

    // b. Perform HostEnqueuePromiseJob(job.[[Job]], job.[[Realm]]).
    HostEnqueuePromiseJob(job['[[Job]]'], job['[[Realm]]'])
  }

  // 2. Return undefined.
  return undefined
}
