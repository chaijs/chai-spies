# Release Notes

## Note

As of 0.6.0, the ReleaseNotes.md file has been deprecated. [Please refer to the release notes available on Github](https://github.com/chaijs/chai-spies/releases).
---

## 0.6.0 / 2015-04-24

Added `.spy.on` and `.spy.object` to easily make new spies, for example:

```js
// Returns `fs` but with readFile and readFileSync spied on
var fs = chai.spy.object(fs, ['readFile', 'readFileSync']);

// Shortcut for `fs.writeFile = chai.spy(fs.writeFile)`
chai.spy.on(fs, 'writeFile');
```

Added new assertions:

 * `.called.min(n)/.at.least(n)` to assert a spy has been called a minimum of
   `n` many times.
 * `.called.max(n)/.at.most(n)` to assert that a spy has been called at most `n`
   number of times.

### Community Contributions

#### Code Features & Fixes

 * [#9](https://github.com/chaijs/chai/pull/9) Add support for component
   By [@pgherveou](https://github.com/pgherveou)

 * [#15](https://github.com/chaijs/chai/pull/15) Add `above`/`below`/`at.most`/
   `at.least` call count assertions.
   By [@brandonhorst](https://github.com/brandonhorst)

 * [#20](https://github.com/chaijs/chai/pull/20) Fix output for `.called()`
   By [@Ryckes](https://github.com/Ryckes)

 * [#21](https://github.com/chaijs/chai/pull/21) Add `.spy.on` and `.spy.object`
   methods.
   By [@stalniy](https://github.com/stalniy)

#### Documentation fixes

 * [#10](https://github.com/chaijs/chai/pull/10) Fix documentation with `once`
   By [@pgherveou](https://github.com/pgherveou)

 * [#16](https://github.com/chaijs/chai/pull/16) Add `.with` docs
   By [@plaxdan](https://github.com/plaxdan)

 * [#17](https://github.com/chaijs/chai/pull/17) Fix small typo in docs
   By [@Ryuno-Ki](https://github.com/Ryuno-Ki)

 * [#19](https://github.com/chaijs/chai/pull/19) Fix a handful of typos in
   README.md
   By [@sateffen](https://github.com/sateffen)

## 0.5.1 / 2012-11-15

Small bugfix, fixing the output of the `.called(n)` assertion error.

## 0.5.0 / 2012-11-14

A few new features:

 - Add `.with()` and `.exactly.with()` assertion for asserting what arguments
   a spy was called with.

## 0.4.0 / 2012-10-09

Ensure spies return the value of their wrapped functions

### Community Contributions

#### Code Features & Fixes

 * [#5](https://github.com/chaijs/chai/pull/5) Make spies have a return value.
   By [@tregusti](https://github.com/tregusti)

## 0.3.0 / 2012-07-11

Add ability for spies to have an (optional) name.

### Community Contributions

#### Code Features & Fixes

 * [#3](https://github.com/chaijs/chai/pull/3) Add an optional name to spies
   By [@tregusti](https://github.com/tregusti)

#### Documentation fixes

 * [#2](https://github.com/chaijs/chai-spies/pull/2) Fix typos in `called.twice`
   assertion
   By [@tregusti](https://github.com/tregusti)

 * [#3](https://github.com/chaijs/chai-spies/pull/2) Fix various typos
   By [@tregusti](https://github.com/tregusti)


## 0.2.3 / 2012-07-09

Small bugfixes, improving the AMD wraper

## 0.2.2 / 2012-05-17

Few minor bugfixes, no new features.

## 0.2.1 / 2012-05-17

Spies now mimic length of original function.

## 0.2.0 / 2012-05-16

Add Chai 1.0.0 compatibility.

### Community Contributions

#### Documentation fixes

 * [#1](https://github.com/chaijs/chai-spies/pull/1) Fix README typos and
   missing link
   By [@JamesMaroney](https://github.com/JamesMaroney)

## 0.1.0 / 2012-02-13

Initial release
