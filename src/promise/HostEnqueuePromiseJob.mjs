// 8.4.1 HostEnqueuePromiseJob ( job, realm )
// HostEnqueuePromiseJob is a host-defined abstract operation that schedules the Job Abstract Closure job to be performed,
// at some future time. The Abstract Closures used with this algorithm are intended to be related to the handling of Promises,
// or otherwise, to be scheduled with equal priority to Promise handling operations.
// The realm parameter is passed through to hosts with no normative requirements; it is either null or a Realm.
export function HostEnqueuePromiseJob (job, realm) {
  process.nextTick(job)

  // Ignore realm
  realm
}
