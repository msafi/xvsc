import * as assert from 'assert'
import {tokenizer} from '../../src/tokenizer'

describe('tokenizer', () => {
  const wordSeparators = "~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?"

  it('exists', () => {
    assert(tokenizer !== undefined)
  })

  it('works as a generator', () => {
    assert.deepEqual([...tokenizer('^^^&hello-man,this is me_haha/ok', wordSeparators)], [
      {value: 'hello', character: 9},
      {value: 'man', character: 13},
      {value: 'this', character: 18},
      {value: 'is', character: 21},
      {value: 'me_haha', character: 29},
      {value: 'ok', character: 32},
    ])
  })

  it('works with `const someVariable = args`', () => {
    assert.deepEqual([...tokenizer('const someVariable = args', wordSeparators)], [
      {value: 'const', character: 5},
      {value: 'someVariable', character: 18},
      {value: 'args', character: 25},
    ])
  })
})
