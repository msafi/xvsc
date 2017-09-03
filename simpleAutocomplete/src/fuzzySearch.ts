/*
The MIT License (MIT)

Copyright © 2015 Nicolas Bevacqua

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export function fuzzySearch(needle: string, haystack: string) {
  const hLen = haystack.length
  const nLen = needle.length
  if (nLen > hLen) {
    return false
  }
  if (nLen === hLen) {
    return needle === haystack
  }

  let j = 0
  outer: for (let i = 0; i < nLen; i++) {
    const nch = needle.charCodeAt(i)
    while (j < hLen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer
      }
    }
    return false
  }
  return true
}
