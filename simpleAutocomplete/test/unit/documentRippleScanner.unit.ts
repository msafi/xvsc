import {TextDocument} from 'vscode'
import * as assert from 'assert'
import {documentRippleScanner} from '../../src/documentRippleScanner'

describe('documentRippleScanner', () => {
  function createDocument(lines: {text: string}[]) {
    return {
      lines,
      lineAt(index: number) {
        const line = lines[index]

        if (!line) {
          throw new Error('Error: Illegal value for `line`')
        }

        return line
      },
      lineCount: lines.length,
    } as any as TextDocument
  }

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

    const documentRippleScannerIterator = documentRippleScanner(
      createDocument(lines),
      5,
    )

    assert.deepEqual([...documentRippleScannerIterator].map(line => line.text), expectedLines)
  })

  it('works when the starting line is closer to the top', () => {
    const lines = ['function someFunction(arg) {',
      '  return arg',
      '}',
      '',
      'someFunction',
      'const someVariable = 2',
      'console.log(someVariable)',
      'const somevak = someFunction(someVariable)',
      'const ok = 1',
      'const someVariableFoo = 3',
      '',
    ].map((line) => ({text: line}))
    const expectedLines = [
      'someFunction',
      '',
      'const someVariable = 2',
      '}',
      'console.log(someVariable)',
      '  return arg',
      'const somevak = someFunction(someVariable)',
      'function someFunction(arg) {',
      'const ok = 1',
      'const someVariableFoo = 3',
      '',
    ]

    const documentRippleScannerIterator = documentRippleScanner(
      createDocument(lines),
      4,
    )

    assert.deepEqual([...documentRippleScannerIterator].map(line => line.text), expectedLines)
  })
})
