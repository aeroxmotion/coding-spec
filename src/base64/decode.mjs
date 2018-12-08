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
 * ASCII alphanumeric char points
 *
 * @type {Array<string>}
 *
 * @see https://infra.spec.whatwg.org/#ascii-alphanumeric
 */
const ASCII_ALPHANUMERIC = [
  '\u0030-\u0039', // ASCII Digit (https://infra.spec.whatwg.org/#ascii-digit)
  '\u0041-\u005A', // ASCII Upper Alpha (https://infra.spec.whatwg.org/#ascii-upper-alpha)
  '\u0061-\u007A'  // ASCII Lower Alpha (https://infra.spec.whatwg.org/#ascii-lower-alpha)
]

/**
 * Padding base64 char
 *
 * @type {Array<string>}
 */
const PADDING_CHAR = '\u003D'

/**
 * Base64 char table
 *
 * @type {Array<string>}
 *
 * @see https://tools.ietf.org/html/rfc4648#section-4
 */
const BASE64_TABLE = [

  // First column
// 0    1    2    3    4    5   6     7    8    9   10   11   12   13   14   15   16
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',

  // Second column
//17   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32   33
  'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',

//34   35   36   37   38   39   40   41   42   43   44   45   46   47   48   49   50
  'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',

//51   52   53   54   55   56   57   58   59   60   61   62   63
  'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'

// (pad) =
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
    data = data.replace(new RegExp(`${PADDING_CHAR}{1,2}$`), '')
  } else if (
    remainder === 1 || // 3. If data’s length divides by 4 leaving a remainder of 1, then return failure.
    new RegExp(`[^${ASCII_ALPHANUMERIC.join('')}]`).test(data) // 4. If data contains a code point that is not one of: U+002B (+), U+002F (/), ASCII alphanumeric then return failure.
  ) {
    throw new Error('Invalid base64 codification')
  }

  // 5. Let output be an empty byte sequence.
  let output = ''

  // 6. Let buffer be an empty buffer that can have bits appended to it.
  const buffer = []

  // 7. Let position be a position variable for data, initially pointing at the start of data.
  let position = 0

  // 8. While position does not point past the end of data:
  while (position < data.length) {

    // 8.1. Find the code point pointed to by position in the second column of Table 1: The Base 64 Alphabet of RFC 4648.
    // Let n be the number given in the first cell of the same row. [RFC4648]
    const n = BASE64_TABLE.indexOf(data[position])

    // 8.2. Append the six bits corresponding to n, most significant bit first, to buffer.
    buffer.push(n)

    // 8.3. If buffer has accumulated 24 bits, interpret them as three 8-bit big-endian numbers.
    // Append three bytes with values equal to those numbers to output, in the same order, and then empty buffer.
    if (buffer.length === 4) {
      output += String.fromCharCode(
        // First byte = (6 bits, pad 2 bits) + 2 first bits
        (buffer[0] << 2) | (buffer[1] >> 4),

        // Second byte = (4 last bits, pad 4 bits) + 4 first bits
        ((buffer[1] & 15) << 4) | (buffer[2] >> 2),

        // Third byte = (2 last bits, pad 6 bits) + 6 bits
        ((buffer[2] & 3) << 6) | buffer[3]
      )

      buffer.length = 0
    }

    // 8.4. Advance position by 1.
    position++
  }

  // 9. If buffer is not empty, it contains either 12 or 18 bits. If it contains 12 bits,
  // then discard the last four and interpret the remaining eight as an 8-bit big-endian number.
  // If it contains 18 bits, then discard the last two and interpret the remaining 16 as two 8-bit big-endian numbers.
  // Append the one or two bytes with values equal to those one or two numbers to output, in the same order.
  if (buffer.length >= 2) {
    const bytes = [
      // First byte = (6 bits, pad 2 bits) + 2 first bits
      (buffer[0] << 2) | (buffer[1] >> 4)
    ]

    if (buffer.length === 3) {
      bytes.push(
        // Second byte = (4 last bits, pad 4 bits) + 4 first bits
        ((buffer[1] & 15) << 4) | (buffer[2] >> 2)
      )
    }

    output += String.fromCharCode(...bytes)
  }

  return output
}
