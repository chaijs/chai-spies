/*!
 * chai-spies :: a chai plugin
 * Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai) {
  // Easy access
  var Assertion = chai.Assertion
    , i = chai.inspect

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

  Object.defineProperty(Assertion.prototype, 'spy',
    { get: function () {
        this.assert(
            undefined !== this.obj.__spy
          , 'expected ' + this.inspect + ' to be a stub'
          , 'expected ' + this.inspect + ' to not be a stub');
        return this;
      }
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
        new Assertion(this.obj).to.be.spy;
        var spy = this.obj.__spy;

        if (!this.negate) {
          this.assert(
              spy.called === true
            , 'expected spy to have been called'
            , 'expected spy to not have been called'
          );
        }
        return this;
      }
  });

  /**
   * # not_called
   *
   * Assert that a spy has not been called. Does not negate.
   *
   * @api public
   */

  Object.defineProperty(Assertion.prototype, 'not_called',
    { get: function () {
        new Assertion(this.obj).to.be.spy;
        var spy = this.obj.__spy;

        if (!this.negate) {
          this.assert(
              spy.called === false
            , 'expected spy to have been called'
            , 'expected spy to not have been called'
          );
        }
        return this;
      }
  });

  /**
   * # once
   *
   * Assert that a spy has been called exactly once
   *
   * @api public
   */

  Object.defineProperty(Assertion.prototype, 'once',
    { get: function () {
        new Assertion(this.obj).to.be.spy;
        var spy = this.obj.__spy;
        this.assert(
            spy.calls.length == 1
          , 'expected spy to have been called once but got ' + i(spy.calls.length)
          , 'expected spy to not have been called once' )
        return this;
      }
  });

  /**
   * # twice
   *
   * Assert that a spy has been called exactly twice.
   *
   * @api public
   */

  Object.defineProperty(Assertion.prototype, 'twice',
    { get: function () {
        new Assertion(this.obj).to.be.spy;
        var spy = this.obj.__spy;
        this.assert(
            spy.calls.length == 2
          , 'expected spy to have been called twice but got ' + i(spy.calls.length)
          , 'expected spy to not have been called twice' )
        return this;
      }
  });

  /**
   * # exactly (n)
   *
   * Assert that a spy has been called exactly `n` times.
   *
   * @param {Number} n times
   * @api public
   */

  Assertion.prototype.exactly = function (n) {
    new Assertion(this.obj).to.be.spy;
    var spy = this.obj.__spy;
    this.assert(
        spy.calls.length == n
      , 'expected spy to have been called ' + i(n) + ' times but got ' + i(spy.calls.length)
      , 'expected spy to not have been called ' + i(n) + ' times' );
    return this;
  };

  /**
   * # min (n)
   *
   * Assert that a spy has been called minimum of `n` times.
   *
   * @param {Number} n times
   * @api public
   */

  Assertion.prototype.min = function (n) {
    new Assertion(this.obj).to.be.spy;
    var spy = this.obj.__spy;
    this.assert(
        spy.calls.length >= n
      , 'expected spy to have been called minimum of ' + i(n) + ' times but got ' + i(spy.calls.length)
      , 'expected spy to have been called less than ' + i(n) + ' times but got ' + i(spy.calls.length) );
    return this;
  };

  /**
   * # max (n)
   *
   * Assert that a spy has been called a maximim of `n` times.
   *
   * @param {Number} n times
   * @api public
   */

  Assertion.prototype.max = function (n) {
    new Assertion(this.obj).to.be.spy;
    var spy = this.obj.__spy;
    this.assert(
        spy.calls.length <= n
      , 'expected spy to have been called maximum of ' + i(n) + ' times but got ' + i(spy.calls.length)
      , 'expected spy to have been called more than ' + i(n) + ' times but got ' + i(spy.calls.length) );
    return this;
  };
};
