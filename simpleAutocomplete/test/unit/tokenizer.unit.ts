import * as assert from 'assert'
import {tokenizer} from '../../src/tokenizer'

describe('tokenizer', () => {
  it('exists', () => {
    assert(tokenizer !== undefined)
  })

  it('works as a generator', () => {
    const wordSeparators = "~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?"

    assert.deepEqual([...tokenizer('^^^&hello-man,this is me_haha/ok', wordSeparators)], [
      {value: 'hello', character: 9},
      {value: 'man', character: 13},
      {value: 'this', character: 18},
      {value: 'is', character: 21},
      {value: 'me_haha', character: 29},
    ])
  })
})
