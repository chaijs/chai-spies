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
    if (!fn) fn = function () {};

    function makeProxy (length, fn) {
      switch (length) {
        case 0 : return function () { return fn.apply(this, arguments); };
        case 1 : return function (a) { return fn.apply(this, arguments); };
        case 2 : return function (a,b) { return fn.apply(this, arguments); };
        case 3 : return function (a,b,c) { return fn.apply(this, arguments); };
        case 4 : return function (a,b,c,d) { return fn.apply(this, arguments); };
        case 5 : return function (a,b,c,d,e) { return fn.apply(this, arguments); };
        case 6 : return function (a,b,c,d,e,f) { return fn.apply(this, arguments); };
        case 7 : return function (a,b,c,d,e,f,g) { return fn.apply(this, arguments); };
        case 8 : return function (a,b,c,d,e,f,g,h) { return fn.apply(this, arguments); };
        case 9 : return function (a,b,c,d,e,f,g,h,i) { return fn.apply(this, arguments); };
        default : return function (a,b,c,d,e,f,g,h,i,j) { return fn.apply(this, arguments); };
      }
    };

    var proxy = makeProxy(fn.length, function () {
      var args = Array.prototype.slice.call(arguments);
      proxy.__spy.calls.push(args);
      proxy.__spy.called = true;
      fn.apply(this, args);
    });

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

  Assertion.addProperty('spy', function () {
    this.assert(
        'undefined' !== typeof this._obj.__spy
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

  Assertion.addProperty('called', function () {
    var assert = function () {
      new Assertion(this._obj).to.be.spy;

      this.assert(
          this._obj.__spy.called === true
        , 'expected #{this} to have been called'
        , 'expected #{this} to not have been called'
      );

      return this;
    };

    assert.__proto__ = this;
    return assert;
  });

  /**
   * # once
   *
   * Assert that a spy has been called exactly once
   *
   * @api public
   */

  Assertion.addProperty('once', function () {
    new Assertion(this._obj).to.be.spy;
    this.assert(
        this._obj.__spy.calls.length === 1
      , 'expected #{this} to have been called once but got #{act}'
      , 'expected #{this} to not have been called once'
      , 1
      , this._obj.__spy.calls.length );
  });

  /**
   * # twice
   *
   * Assert that a spy has been called exactly twice.
   *
   * @api public
   */

  Assertion.addProperty('twice', function () {
    new Assertion(this._obj).to.be.spy;
    this.assert(
        this._obj.__spy.calls.length === 2
      , 'expected #{this} to have been called twice but got #{act}'
      , 'expected #{this} to not have been called twice'
      , 2
      , this._obj.__spy.calls.length
    );
  });

  /**
   * # exactly (n)
   *
   * Assert that a spy has been called exactly `n` times.
   *
   * @param {Number} n times
   * @api public
   */

  Assertion.addMethod('exactly', function (n) {
    new Assertion(this._obj).to.be.spy;
    this.assert(
        this._obj.__spy.calls.length === n
      , 'expected #{this} to have been called #{exp} times but got #{act}'
      , 'expected #{this} to not have been called #{exp} times'
      , n
      , this._obj.__spy.calls.length
    );
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
      if ('undefined' !== typeof this._obj.__spy) {
        new Assertion(this._obj).to.be.spy;

        this.assert(
            this._obj.__spy.calls.length > n
          , 'expected #{this} to have been called more than #{exp} times but got #{act}'
          , 'expected #{this} to have been called no more than than #{exp} times but got #{act}'
          , n
          , this._obj.__spy.calls.length
        );
      } else {
        _super.apply(this, arguments);
      }
    }
  }

  Assertion.overwriteMethod('above', above);
  Assertion.overwriteMethod('gt', above);

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
      if ('undefined' !== typeof this._obj.__spy) {
        new Assertion(this._obj).to.be.spy;

        this.assert(
            this._obj.__spy.calls.length <  n
          , 'expected #{this} to have been called less than #{exp} times but got #{act}'
          , 'expected #{this} to have been called at least #{exp} times but got #{act}'
          , n
          , this._obj.__spy.calls.length
        );
      } else {
        _super.apply(this, arguments);
      }
    }
  }

  Assertion.overwriteMethod('below', below);
  Assertion.overwriteMethod('lt', below);
};
