import {TextDocument} from 'vscode'
import * as assert from 'assert'
import {documentRippleScanner} from '../../src/documentRippleScanner'

describe('documentRippleScanner', () => {
  it('exists', () => {
    assert(documentRippleScanner !== undefined)
  })

  it('works as a generator', () => {
    const lines = [
      'function someFunction(arg) {',
      '  return arg',
      '}',
      '',
      'const someVariable = 2',
      'const somevak = someFunction(someva)',
      'const ok = 1',
      'const someVariableFoo = 3',
    ].map((line) => ({text: line}))
    const expectedLines = [
      'const somevak = someFunction(someva)',
      'const someVariable = 2',
      'const ok = 1',
      '',
      'const someVariableFoo = 3',
      '}',
      '  return arg',
      'function someFunction(arg) {',
    ]

    const document = {
      lines,
      lineAt(index: number) {
        return lines[index]
      },
      lineCount: lines.length,
    } as any as TextDocument

    const documentRippleScannerIterator = documentRippleScanner(
      document,
      5,
    )

    assert.deepEqual([...documentRippleScannerIterator].map(line => line.text), expectedLines)
  })
})
