// Non-spec compliant utils

const abruptCompletionRefs = new WeakSet()

export function isAbruptCompletion (value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    abruptCompletionRefs.has(value)
  )
}

export function getAbruptCompletionObject (value) {
  const ret = { value }
  abruptCompletionRefs.add(ret)
  return ret
}

export function getAbruptCompletionValue (abruptCompletionObject) {
  return abruptCompletionObject.value
}
