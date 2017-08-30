class Foo {
  constructor() {
    this.bar = () => console.log('bar called!')
  }

  callBar() {
    this.bar()
  }

  reassignBar() {
    this.bar = () => null
  }
}