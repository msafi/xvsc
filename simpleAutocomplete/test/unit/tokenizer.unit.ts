import * as assert from 'assert'
import {tokenizer} from '../../src/tokenizer'

describe('tokenizer', () => {
  it('exists', () => {
    assert(tokenizer !== undefined)
  })

  it('works', () => {
    const wordSeparators = "~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?"

    assert.deepEqual(tokenizer('^^^&hello-man,this is me_haha/ok', wordSeparators), [
      {value: 'hello', character: 5},
      {value: 'man', character: 9},
      {value: 'this', character: 14},
      {value: 'is', character: 17},
      {value: 'me_haha', character: 22},
    ])
  })
})
