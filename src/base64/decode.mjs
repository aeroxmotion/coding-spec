import BASE64_TABLE from './table.mjs'

/**
 * Encoding error message
 *
 * @type {string}
 */
const INVALID_ENCODING_ERR = 'Invalid base64 input encoding'

/**
 * ASCII whitespace char points
 *
 * @type {Array<string>}
 *
 * @see https://infra.spec.whatwg.org/#ascii-whitespace
 */
const ASCII_WHITESPACE = [
  '\u0009', // Tab
  '\u000A', // Line Feed
  '\u000C', // FF
  '\u000D', // Carriage return
  '\u0020'  // Space
]

/**
 * Decode base64 data
 *
 * @param {string} data
 *
 * @return {string}
 *
 * @see https://infra.spec.whatwg.org/#forgiving-base64
 */
export default function decode (data) {

  // 1. Remove all ASCII whitespace from data.
  data = data.replace(new RegExp(ASCII_WHITESPACE.join('|'), 'g'), '')

  const remainder = data.length % 4

  // 2. If data’s length divides by 4 leaving no remainder, then:
  if (!remainder) {
    // 2.1. If data ends with one or two U+003D (=) code points, then remove them from data.
    data = data.replace(new RegExp(`${BASE64_TABLE.pad}{1,2}$`), '')

  // 3. If data’s length divides by 4 leaving a remainder of 1, then return failure.
  } else if (remainder === 1) {
    throw new Error(INVALID_ENCODING_ERR)
  }

  // 4. If data contains a code point that is not one of: U+002B (+), U+002F (/), ASCII alphanumeric then return failure.
  if (new RegExp(`[^${BASE64_TABLE.join('')}]`).test(data)) {
    throw new Error(INVALID_ENCODING_ERR)
  }

  // 5. Let output be an empty byte sequence.
  let output = ''

  // 6. Let buffer be an empty buffer that can have bits appended to it.
  let buffer = 0

  // 7. Let position be a position variable for data, initially pointing at the start of data.
  let position = 0

  // 8. While position does not point past the end of data:
  while (position < data.length) {

    // 8.1. Find the code point pointed to by position in the second column of Table 1: The Base 64 Alphabet of RFC 4648.
    // Let n be the number given in the first cell of the same row. [RFC4648]
    const n = BASE64_TABLE.indexOf(data[position])

    // 8.2. Append the six bits corresponding to n, most significant bit first, to buffer.
    buffer = (buffer << 6) | n

    // 8.3. If buffer has accumulated 24 bits, interpret them as three 8-bit big-endian numbers.
    // Append three bytes with values equal to those numbers to output, in the same order, and then empty buffer.
    if (buffer >= (1 << 18)) {
      output += String.fromCharCode(buffer >> 16, (buffer >> 8) & 255, buffer & 255)
      buffer = 0
    }

    // 8.4. Advance position by 1.
    position++
  }

  // 9. If buffer is not empty, it contains either 12 or 18 bits. If it contains 12 bits,
  // then discard the last four and interpret the remaining eight as an 8-bit big-endian number.
  // If it contains 18 bits, then discard the last two and interpret the remaining 16 as two 8-bit big-endian numbers.
  // Append the one or two bytes with values equal to those one or two numbers to output, in the same order.
  if (buffer >= (1 << 12)) {
    output += String.fromCharCode(buffer >> 10, buffer >> 2 & 255)
  } else if (buffer >= (1 << 6)) {
    output += String.fromCharCode(buffer >> 4)
  }

  return output
}
