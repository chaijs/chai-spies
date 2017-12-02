# Chai Spies

This is an addon plugin for the [chai](https://github.com/chaijs/chai) assertion library. It provides the
most basic function spy ability and tests.

This library is primarily meant to serve as a starting point for anyone interested in developing chai plugins. If
developing a module, you are welcome to use this as a starting point. I also encourage the use of the compile
tools to allow modules to work both in node.js and the browser.

## Installation

#### Node.js

Chai spies are available on npm.

      $ npm install chai-spies

#### Browser

Include `chai-spies.js` after including `chai.js`.

```xml
<script src="chai-spies.js"></script>
```

## Plug In

If you are using `chai-spies` in the browser, there is nothing you need to do. It will detect `chai` in the global
namespace and automatically get used.

If you are using node, here is a useful bit.

```js
var chai = require('chai')
  , spies = require('chai-spies');

chai.use(spies);

var should = chai.should()
  , expect = chai.expect;
```

## Building for the Browser

Currently this package uses [rollup](https://rollupjs.org/) to bundle source code. Just use `npm run build` to build browser version.

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

// or you can track an object's method
var array = [ 1, 2, 3 ];
chai.spy.on(array, 'push');

// or you can track multiple object's methods
chai.spy.on(array, 'push', 'pop');

array.push(5);

// and you can reset the object calls
array.push.reset();

// or you can create spy object
var object = chai.spy.interface([ 'push', 'pop' ]);
object.push(5);

// or you create spy which returns static value
var spy = chai.spy.returns(true);

spy(); // true
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
expect(spy).to.have.been.called();
spy.should.have.been.called();
```

Note that `called` can be used as a chainable method.

#### .with

Assert that a spy has been called with a given argument at least once,
even if more arguments were provided.

```js
spy('foo');
expect(spy).to.have.been.called.with('foo');
spy.should.have.been.called.with('foo');
```

Will also pass for `spy('foo', 'bar')` and `spy(); spy('foo')`.

If used with multiple arguments, assert that a spy has been called
with all the given arguments at least once.

```js
spy('foo', 'bar', 1);
expect(spy).to.have.been.called.with('bar', 'foo');
spy.should.have.been.called.with('bar', 'foo');
```

#### .with.exactly

Similar to .with, but will pass only if the list of arguments is
exactly the same as the one provided.

```js
spy();
spy('foo', 'bar');
expect(spy).to.have.been.called.with.exactly('foo', 'bar');
spy.should.have.been.called.with.exactly('foo', 'bar');
```

Will not pass for `spy('foo')`, `spy('bar')`, `spy('bar');
spy('foo')`, `spy('foo'); spy('bar')`, `spy('bar', 'foo')` or
`spy('foo', 'bar', 1)`.

Can be used for calls with a single argument too.

#### .always.with

Assert that every time the spy has been called the argument list
contained the given arguments.

```js
spy('foo');
spy('foo', 'bar');
spy(1, 2, 'foo');
expect(spy).to.have.been.called.always.with('foo');
spy.should.have.been.called.always.with('foo');
```

#### .always.with.exactly

Assert that the spy has never been called with a different list of
arguments than the one provided.

```js
spy('foo');
spy('foo');
expect(spy).to.have.been.called.always.with.exactly('foo');
spy.should.have.been.called.always.with.exactly('foo');
```

#### .nth(n).called.with

Asserts that the nth call of the spy has been made with the list of arguments provided. This assertion comes with other three flavors:

* .first.called.with
* .second.called.with
* .third.called.with

```js
spy('foo');
spy('bar');
spy('baz');
spy('foobar');
expect(spy).to.have.been.first.called.with('foo');
spy.should.have.been.first.called.with('foo');
expect(spy).on.nth(5).be.called.with('foobar');
spy.should.on.nth(5).be.called.with('foobar');
```

These assertions requires the spy to be called at least the
number of times required, for example

```js
spy('foo');
spy('bar');
expect(spy).to.have.been.third.called.with('baz');
spy.should.have.been.third.called.with('baz');
```

Won't pass because the spy has not been called a third time.

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

Assert that a spy has been called exactly `n` times.

```js
expect(spy).to.have.been.called.exactly(3);
expect(spy).to.not.have.been.called.exactly(3);
spy.should.have.been.called.exactly(3);
spy.should.not.have.been.called.exactly(3);
```

#### .min(n) / .at.least(n)

Assert that a spy has been called minimum of `n` times.

```js
expect(spy).to.have.been.called.min(3);
expect(spy).to.not.have.been.called.at.least(3);
spy.should.have.been.called.at.least(3);
spy.should.not.have.been.called.min(3);
```

#### .max(n) / .at.most(n)

Assert that a spy has been called maximum of `n` times.

```js
expect(spy).to.have.been.called.max(3);
expect(spy).to.not.have.been.called.at.most(3);
spy.should.have.been.called.at.most(3);
spy.should.not.have.been.called.max(3);
```
#### .above(n) / .gt(n)

Assert that a spy has been called more than `n` times.

```js
expect(spy).to.have.been.called.above(3);
expect(spy).to.not.have.been.called.gt(3);
spy.should.have.been.called.gt(3);
spy.should.not.have.been.called.above(3);
```

#### .below(n) / .lt(n)

Assert that a spy has been called fewer than `n` times.

```js
expect(spy).to.have.been.called.below(3);
expect(spy).to.not.have.been.called.lt(3);
spy.should.have.been.called.lt(3);
spy.should.not.have.been.called.below(3);
```

## Tests

Tests are written using [mocha](http://github.com/visionmedia/mocha) in the BDD interface.
Node tests can be executed using `npm test`. Browser tests can be seen by opening `test/browser/index.html`.

## Contributors

 project  : chai-spies
 repo age : 3 years, 2 months
 active   : 26 days
 commits  : 77
 files    : 12
 authors  :
    48  Jake Luer         62.3%
     7  Glenn Jorde       9.1%
     4  Keith Cirkel      5.2%
     3  =                 3.9%
     3  Sergiy Stotskiy   3.9%
     2  JamesMaroney      2.6%
     2  PG Herveou        2.6%
     2  Ryckes            2.6%
     1  Veselin Todorov   1.3%
     1  Steffen           1.3%
     1  Daniel Walker     1.3%
     1  Domenic Denicola  1.3%
     1  Andre Jaenisch    1.3%
     1  PG                1.3%

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
