
module.exports = function (chai) {
  var Assertion = chai.Assertion
    , i = chai.inspect

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

  Object.defineProperty(Assertion.prototype, 'spy',
    { get: function () {
        this.assert(
            undefined !== this.obj.__spy
          , 'expected ' + this.inspect + ' to be a stub'
          , 'expected ' + this.inspect + ' to not be a stub');
        return this;
      }
  });

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

  Assertion.prototype.exactly = function (n) {
    new Assertion(this.obj).to.be.spy;
    var spy = this.obj.__spy;
    this.assert(
        spy.calls.length == n
      , 'expected spy to have been called ' + i(n) + ' times but got ' + i(spy.calls.length)
      , 'expected spy to not have been called ' + i(n) + ' times' );
    return this;
  };

  Assertion.prototype.min = function (n) {
    new Assertion(this.obj).to.be.spy;
    var spy = this.obj.__spy;
    this.assert(
        spy.calls.length >= n
      , 'expected spy to have been called minimum of ' + i(n) + ' times but got ' + i(spy.calls.length)
      , 'expected spy to have been called less than ' + i(n) + ' times but got ' + i(spy.calls.length) );
    return this;
  };

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
