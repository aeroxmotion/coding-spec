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

  // Third column
//34   35   36   37   38   39   40   41   42   43   44   45   46   47   48   49   50
  'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',

  // Fourth column
//51   52   53   54   55   56   57   58   59   60   61   62   63
  'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
]

/**
 * Base64 padding char
 *
 * @type {string}
 */
BASE64_TABLE.pad = '='

export default BASE64_TABLE
