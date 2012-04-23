!function (name, definition) {
  if (typeof define == 'function' && typeof define.amd  == 'object') define(definition);
  else this[name] = definition();
}('chai_spies', function () {
  // CommonJS require()
  function require(p){
    var path = require.resolve(p)
      , mod = require.modules[path];
    if (!mod) throw new Error('failed to require "' + p + '"');
    if (!mod.exports) {
      mod.exports = {};
      mod.call(mod.exports, mod, mod.exports, require.relative(path));
    }
    return mod.exports;
  }

  require.modules = {};

  require.resolve = function (path){
    var orig = path
      , reg = path + '.js'
      , index = path + '/index.js';
    return require.modules[reg] && reg
      || require.modules[index] && index
      || orig;
  };

  require.register = function (path, fn){
    require.modules[path] = fn;
  };

  require.relative = function (parent) {
    return function(p){
      if ('.' != p[0]) return require(p);

      var path = parent.split('/')
        , segs = p.split('/');
      path.pop();

      for (var i = 0; i < segs.length; i++) {
        var seg = segs[i];
        if ('..' == seg) path.pop();
        else if ('.' != seg) path.push(seg);
      }

      return require(path.join('/'));
    };
  };


require.register("spy", function (module, exports, require) {
/*!
 * chai-spies :: a chai plugin
 * Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * We are going to export a function that can be used through chai
 */

module.exports = function (chai, _) {
  // Easy access
  var Assertion = chai.Assertion
    , flag = _.flag
    , i = _.inspect

  /**
   * # chai.spy (function)
   *
   * Wraps a function in a proxy function. All calls will
   * pass through to the original function.
   *
   *      function original() {}
   *      var spy = chai.spy(original)
   *        , e_spy = chia.spy();
   *
   * @param {Function} function to spy on
   * @returns function to actually call
   * @api public
   */

  chai.spy = function (fn) {
    if (!fn) fn = function() {};

    function proxy() {
      var args = Array.prototype.slice.call(arguments);
      proxy.__spy.calls.push(args);
      proxy.__spy.called = true;
      fn.apply(this, args);
    }

    proxy.prototype = fn.prototype;
    proxy.__spy = {
        calls: []
      , called: false
    };

    return proxy;
  }

  /**
   * # spy
   *
   * Assert the the object in question is an chai.spy
   * wrapped function by looking for internals.
   *
   *      expect(spy).to.be.spy;
   *      spy.should.be.spy;
   *
   * @api public
   */

  _.addProperty(Assertion, 'spy', function () {
    var obj = flag(this, 'object');
    this.assert(
        undefined !== obj.__spy
      , 'expected #{this} to be a spy'
      , 'expected #{this} to not be a spy');
    return this;
  });

  /**
   * # .called
   *
   * Assert that a spy has been called. Does not negate to allow for
   * pass through language.
   *
   * @api public
   */

  Object.defineProperty(Assertion.prototype, 'called',
    { get: function () {
        var assert = function () {
          var obj = flag(this, 'object');
          new Assertion(obj).to.be.spy;

          this.assert(
              obj.__spy.called === true
            , 'expected #{this} to have been called'
            , 'expected #{this} to not have been called'
          );

          return this;
        };

        assert.__proto__ = this;
        return assert;
      }
    , configurable: true
  });

  /**
   * # once
   *
   * Assert that a spy has been called exactly once
   *
   * @api public
   */

  _.addProperty(Assertion, 'once', function () {
    var obj = flag(this, 'object');
    new Assertion(obj).to.be.spy;

    this.assert(
        obj.__spy.calls.length === 1
      , 'expected #{this} to have been called once but got #{act}'
      , 'expected #{this} to not have been called once'
      , 1
      , obj.__spy.calls.length );

    return this;
  });

  /**
   * # twice
   *
   * Assert that a spy has been called exactly twice.
   *
   * @api public
   */

  _.addProperty(Assertion, 'twice', function () {
    var obj = flag(this, 'object');
    new Assertion(obj).to.be.spy;

    this.assert(
        obj.__spy.calls.length === 2
      , 'expected #{this} to have been called once but got #{act}'
      , 'expected #{this} to not have been called once'
      , 2
      , obj.__spy.calls.length
    );

    return this;
  });

  /**
   * # exactly (n)
   *
   * Assert that a spy has been called exactly `n` times.
   *
   * @param {Number} n times
   * @api public
   */

  _.addMethod(Assertion, 'exactly', function (n) {
    var obj = flag(this, 'object');
    new Assertion(obj).to.be.spy;

    this.assert(
        obj.__spy.calls.length === n
      , 'expected #{this} to have been called #{exp} times but got #{act}'
      , 'expected #{this} to not have been called #{exp} times'
      , n
      , obj.__spy.calls.length
    );

    return this;
  });

  /**
   * # gt (n)
   *
   * Assert that a spy has been called more than `n` times.
   *
   * @param {Number} n times
   * @api public
   */

  function above (_super) {
    return function (n) {
      var obj = flag(this, 'object');
      if ('undefined' !== obj.__spy) {
        new Assertion(obj).to.be.spy;

        this.assert(
            obj.__spy.calls.length > n
          , 'expected #{this} to have been called more than #{exp} times but got #{act}'
          , 'expected #{this} to have been called no more than than #{exp} times but got #{act}'
          , n
          , obj.__spy.calls.length
        );

        return this;
      } else {
        return _super.apply(this, arguments);
      }
    }
  }

  _.overwriteMethod(Assertion, 'above', above);
  _.overwriteMethod(Assertion, 'gt', above);

  /**
   * # lt (n)
   *
   * Assert that a spy has been called less than `n` times.
   *
   * @param {Number} n times
   * @api public
   */

  function below (_super) {
    return function (n) {
      var obj = flag(this, 'object');
      if ('undefined' !== obj.__spy) {
        new Assertion(obj).to.be.spy;

        this.assert(
            obj.__spy.calls.length <  n
          , 'expected #{this} to have been called less than #{exp} times but got #{act}'
          , 'expected #{this} to have been called at least #{exp} times but got #{act}'
          , n
          , obj.__spy.calls.length
        );

        return this;
      } else {
        return _super.apply(this, arguments);
      }
    }
  }

  _.overwriteMethod(Assertion, 'below', below);
  _.overwriteMethod(Assertion, 'lt', below);
};

}); // module spy
  return require('spy');
});

chai.use(chai_spies);
