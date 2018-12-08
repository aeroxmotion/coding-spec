import BASE64_TABLE from './table.mjs'

/**
 * Encode base64 according to RFC-4648
 *
 * @see https://tools.ietf.org/html/rfc4648#page-6
 */
export default function encode (input) {

  // The encoding process represents 24-bit groups of input bits as output
  // strings of 4 encoded characters.
  let output = ''

  while (input.length >= 3) {

    // Proceeding from left to right, a 24-bit input group is formed by concatenating 3 8-bit input groups.
    // These 24 bits are then treated as 4 concatenated 6-bit groups, each
    // of which is translated into a single character in the base 64
    // alphabet.
    output += (
      // First 6 bits
      BASE64_TABLE[input.charCodeAt(0) >> 2] +

      // Last 2 bits + First 4 bits
      BASE64_TABLE[((input.charCodeAt(0) & 3) << 4) | (input.charCodeAt(1) >> 4)] +

      // Last 4 bits + First 2 bits
      BASE64_TABLE[((input.charCodeAt(1) & 15) << 2) | (input.charCodeAt(2) >> 6)] +

      // Last 6 bits
      BASE64_TABLE[input.charCodeAt(2) & 63]
    )

    input = input.slice(3)
  }

  // When fewer than 24 input
  // bits are available in an input group, bits with value zero are added
  // (on the right) to form an integral number of 6-bit groups.  Padding
  // at the end of the data is performed using the '=' character.  Since
  // all base 64 input is an integral number of octets, only the following
  // cases can arise:

  // (1) The final quantum of encoding input is an integral multiple of 24
  //     bits; here, the final unit of encoded output will be an integral
  //     multiple of 4 characters with no "=" padding.

  if (input.length >= 1) {

    // Append first six bits
    output += BASE64_TABLE[input.charCodeAt(0) >> 2]

    // Last 2 bits + pad 4 zeros
    const paddedLastTwoBits = (input.charCodeAt(0) & 3) << 4

    // (2) The final quantum of encoding input is exactly 8 bits; here, the
    //     final unit of encoded output will be two characters followed by
    //     two "=" padding characters.
    if (input.length === 1) {
      output += BASE64_TABLE[paddedLastTwoBits]

      // (3) The final quantum of encoding input is exactly 16 bits; here, the
      //     final unit of encoded output will be three characters followed by
      //     one "=" padding character.
    } else {
      output += (

        // Last 2 bits + First 4 bits
        BASE64_TABLE[paddedLastTwoBits | (input.charCodeAt(1) >> 4)] +

        // Last 4 bits + pad 2 zeros
        BASE64_TABLE[(input.charCodeAt(1) & 15) << 2]
      )
    }

    output += BASE64_TABLE.pad.repeat(3 - input.length)
  }

  return output
}
