# Chai Spies

This is a addon plugin for the [chai](http://github.com/logicalparadox/chai) assertion library. It provides the 
most basic function spy ability and tests. Though useful for small modules, you are probably going to want something
more robust. Check out [jack](http://github.com/vesln/jack) for a full featured mock/stub/spy assertion library for use with chai.

This library is primarily meant to serve as a starting point for anyone interested in developing chai plugins. If
developing a module, you are welcome to use this as a starting point. I also encourage the use of the compile
tools to allow modules to work both in node.js and the browser.

## Installation

#### Node.js

Chai spies are available on npm.

      $ npm install chai-spies

#### Browser

Include `chai-spies.js` after including `chai.js`. 

```html
<script src="chai-spies.js"></script>
```

## Plug In

If you are using `chai-spies` in the browser, there is nothing you need to do. It will detect `chai` in the global
namespace and automagically get used.

If you are using node, here is a useful bit.

```js
var chai = require('chai')
  , spies = require('chai-spies');

chai.use(spies);

var should = chai.should()
  , expect = chai.expect; 
```

## Building for the Browser

If you are developing an addon for chai, one thing you might find useful is the contents of the `support` folder.
This directly contains everything that is needed to package all js files in a directory for browser use. Provided
there are no external dependencies, everything will be packaged and wrapped with a CommonJS `require` style loader
by [folio](https://github.com/logicalparadox/folio), a small JS packaging tool. Please consult the comments in `support/compile.js`.

## Chai Spies Api Reference

### Creating Spies

In this module, a spy is either an empty function, or a wrapped named function.
Once chai has been extended, you can create a spy through chai's own interface.

```js
function original () {
  // do something cool
}

var spy = chai.spy(original);

// then use in place of original
ee.on('some event', spy);

// or use without original
var spy_again = chai.spy();
ee.on('some other event', spy_again);
```

### Assertions

#### .spy

Asserts that object is a spy.

```js
expect(spy).to.be.spy;
spy.should.be.spy;
```

#### .called

Assert that a spy has been called. Negation passes through.

```js
expect(spy).to.have.been.called;
spy.should.have.been.called;
```

#### .not_called

Assert that a spy has not been called. 

```js
expect(spy).to.have.been.not_called;
spy.should.have.been.not_called;
```

#### .once

Assert that a spy has been called exactly once.

```js
expect(spy).to.have.been.called.once;
expect(spy).to.not.have.been.called.once;
spy.should.have.been.called.once;
spy.should.not.have.been.called.once;
```

#### .twice

Assert that a spy has been called exactly twice.

```js
expect(spy).to.have.been.called.twice;
expect(spy).to.not.have.been.called.twice;
spy.should.have.been.called.twice;
spy.should.not.have.been.called.twice;
```

#### .exactly(n)

Assert that a spy has been called exactly n times.

```js
expect(spy).to.have.been.called.exactly(3);
expect(spy).to.not.have.been.called.exactly(3);
spy.should.have.been.called.exactly(3);
spy.should.not.have.been.called.exactly(3);
```

#### .min(n)

Assert that a spy has been called minimum of `n` times.

```js
expect(spy).to.have.been.called.min(3);
expect(spy).to.not.have.been.called.min(3);
spy.should.have.been.called.min(3);
spy.should.not.have.been.called.min(3);
```

#### .max(n)

Assert that a spy has been called maximum of `n` times.

```js
expect(spy).to.have.been.called.max(3);
expect(spy).to.not.have.been.called.max(3);
spy.should.have.been.called.max(3);
spy.should.not.have.been.called.max(3);
```

## Tests 

Tests are written using [mocha](http://github.com/visionmedia/mocha) in the BDD itnerface.
Node tests can be executed using `make test`. Browser tests can be seen by opening `test/browser/index.html`.

## License

(The MIT License)

Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
