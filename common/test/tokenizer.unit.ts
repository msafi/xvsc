import * as assert from 'assert'
import {tokenizer} from '../src/tokenizer'

describe('tokenizer', () => {
  const wordSeparators = "~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?"

  it('exists', () => {
    assert(tokenizer !== undefined)
  })

  it('works as a generator', () => {
    assert.deepEqual([...tokenizer('^^^&hello-man,this is me_haha/ok', wordSeparators)], [
      'hello',
      'man',
      'this',
      'is',
      'me_haha',
      'ok',
    ])
  })

  it('works with `const someVariable = args`', () => {
    assert.deepEqual([...tokenizer('const someVariable = args', wordSeparators)], [
      'const',
      'someVariable',
      'args',
    ])
  })
})
