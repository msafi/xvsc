import * as assert from 'assert'
import {_tokenize} from '../../src/lineScanner'

describe('lineScanner', () => null)

describe('tokenizer', () => {
  it('works', () => {
    const wordSeparators = "~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?"

    assert.deepEqual(_tokenize('^^^&hello-man,this is me_haha/ok', wordSeparators), [
      {value: 'hello', character: 5},
      {value: 'man', character: 9},
      {value: 'this', character: 14},
      {value: 'is', character: 17},
      {value: 'me_haha', character: 25},
    ])
  })
})
