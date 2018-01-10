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
    , STATE_KEY = typeof Symbol === 'undefined' ? '__state' : Symbol('state')
    , spyAmount = 0
    , DEFAULT_SANDBOX = new Sandbox()
    , noop = function () {}

  /**
   * # Sandbox constructor (function)
   *
   * Initialize new Sandbox instance
   *
   * @returns new sandbox
   * @api private
   */

  function Sandbox() {
    this[STATE_KEY] = {};
  }

  /**
   * # Sandbox.on (function)
   *
   * Wraps an object method into spy assigned to sandbox. All calls will
   * pass through to the original function.
   *
   *      var spy = chai.spy.sandbox();
   *      var isArray = spy.on(Array, 'isArray');
   *
   *      const array = []
   *      const spy = chai.spy.sandbox();
   *      const [push, pop] = spy.on(array, ['push', 'pop']);
   *
   *      spy.on(array, 'push', returns => 1)
   *
   * @param {Object} object
   * @param {String|String[]} method name or methods names to spy on
   * @param {Function} [fn] mock implementation
   * @returns created spy or created spies
   * @api public
   */

  Sandbox.prototype.on = function (object, methodName, fn) {
    if (Array.isArray(methodName)) {
      return methodName.map(function (name) {
        return this.on(object, name, fn);
      }, this);
    }

    var isMethod = typeof object[methodName] === 'function'

    if (methodName in object && !isMethod) {
      throw new Error([
        'Unable to spy property "', methodName,
        '". Only methods and non-existing properties can be spied.'
      ].join(''))
    }

    if (isMethod && object[methodName].__spy) {
      throw new Error('"' + methodName + '" is already a spy')
    }

    var method = chai.spy('object.' + methodName, fn || object[methodName]);
    var trackingId = ++spyAmount

    this[STATE_KEY][trackingId] = method;
    method.__spy.tracked = {
      object: object
      , methodName: methodName
      , originalMethod: object[methodName]
      , isOwnMethod: object.hasOwnProperty(methodName)
    };
    object[methodName] = method;

    return method;
  };

  /**
   * # Sandbox.restore (function)
   *
   * Restores previously wrapped object's method.
   * Restores all spied objects of a sandbox if called without parameters.
   *
   *      var spy = chai.spy.sandbox();
   *      var object = spy.on(Array, 'isArray');
   *      spy.restore(Array, 'isArray'); // or spy.restore();
   *
   * @param {Object} [object]
   * @param {String|String[]} [methods] method name or method names
   * @return {Sandbox} Sandbox instance
   * @api public
   */

  Sandbox.prototype.restore = function (object, methods) {
    var hasFilter = Boolean(object && methods);
    var sandbox = this;

    if (methods && !Array.isArray(methods)) {
      methods = [methods]
    }

    Object.keys(this[STATE_KEY]).some(function (spyId) {
      var spy = sandbox[STATE_KEY][spyId];
      var tracked = spy.__spy.tracked;
      var isObjectSpied = !object || object === tracked.object;
      var isMethodSpied = !methods || methods.indexOf(tracked.methodName) !== -1;

      delete sandbox[STATE_KEY][spyId];

      if (!isObjectSpied && !isMethodSpied) {
        return false;
      }

      sandbox.restoreTrackedObject(spy);

      if (hasFilter) {
        return true;
      }
    });

    return this;
  };

  /**
   * # Sandbox.restoreTrackedObject (function)
   *
   * Restores tracked object's method
   *
   *      var spy = chai.spy.sandbox();
   *      var isArray = spy.on(Array, 'isArray');
   *      spy.restoreTrackedObject(isArray);
   *
   * @param {Spy} spy
   * @api private
   */

  Sandbox.prototype.restoreTrackedObject = function (spy) {
    var tracked = spy.__spy.tracked;

    if (!tracked) {
      throw new Error('It is not possible to restore a non-tracked spy.')
    }

    if (tracked.isOwnMethod) {
      tracked.object[tracked.methodName] = tracked.originalMethod;
    } else {
      delete tracked.object[tracked.methodName];
    }

    spy.__spy.tracked = null;
  };

  /**
   * # chai.spy (function)
   *
   * Wraps a function in a proxy function. All calls will
   * pass through to the original function.
   *
   *      function original() {}
   *      var spy = chai.spy(original)
   *        , e_spy = chai.spy();
   *
   * @param {Function} function to spy on
   * @returns function to actually call
   * @api public
   */

  chai.spy = function (name, fn) {
    if (typeof name === 'function') {
      fn = name;
      name = undefined;
    }

    fn = fn || noop;

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
      return fn.apply(this, args);
    });

    proxy.prototype = fn.prototype;
    proxy.toString = function toString() {
      var state = this.__spy;
      var l = state.calls.length;
      var s = "{ Spy";
      if (state.name)
        s += " '" + state.name + "'";
      if (l > 0)
        s += ", " + l + " call" + (l > 1 ? 's' : '');
      s += " }";
      return s + (fn !== noop ? "\n" + fn.toString() : '');
    };

    proxy.__spy = {
      calls: []
      , called: false
      , name: name
    };

    return proxy;
  }

  /**
   * # chai.spy.sandbox (function)
   *
   * Creates sandbox which allow to restore spied objects with spy.on.
   * All calls will pass through to the original function.
   *
   *      var spy = chai.spy.sandbox();
   *      var isArray = spy.on(Array, 'isArray');
   *
   * @param {Object} object
   * @param {String} method name to spy on
   * @returns passed object
   * @api public
   */

  chai.spy.sandbox = function () {
    return new Sandbox()
  };

  /**
   * # chai.spy.on (function)
   *
   * The same as Sandbox.on.
   * Assignes newly created spy to DEFAULT sandbox
   *
   *      var isArray = chai.spy.on(Array, 'isArray');
   *
   * @see Sandbox.on
   * @api public
   */

  chai.spy.on = function () {
    return DEFAULT_SANDBOX.on.apply(DEFAULT_SANDBOX, arguments)
  };

  /**
   * # chai.spy.interface (function)
   *
   * Creates an object interface with spied methods.
   *
   *      var events = chai.spy.interface('Events', ['trigger', 'on']);
   *
   *      var array = chai.spy.interface({
   *        push(item) {
   *          this.items = this.items || [];
   *          return this.items.push(item);
   *        }
   *      });
   *
   * @param {String|Object} name object or object name
   * @param {String[]} [methods] method names
   * @returns object with spied methods
   * @api public
   */

  chai.spy.interface = function (name, methods) {
    var defs = {};

    if (name && typeof name === 'object') {
      methods = Object.keys(name);
      defs = name;
      name = 'mock';
    }

    return methods.reduce(function (object, methodName) {
      object[methodName] = chai.spy(name + '.' + methodName, defs[methodName]);
      return object;
    }, {});
  };

  /**
   * # chai.spy.restore (function)
   *
   * The same as Sandbox.restore.
   * Restores spy assigned to DEFAULT sandbox
   *
   *      var array = []
   *      chai.spy.on(array, 'push');
   *      expect(array.push).to.be.spy // true
   *
   *      chai.spy.restore()
   *      expect(array.push).to.be.spy // false
   *
   * @see Sandbox.restore
   * @api public
   */

  chai.spy.restore = function () {
    return DEFAULT_SANDBOX.restore.apply(DEFAULT_SANDBOX, arguments)
  };

  /**
   * # chai.spy.returns (function)
   *
   * Creates a spy which returns static value.
   *
   *      var method = chai.spy.returns(true);
   *
   * @param {*} value static value which is returned by spy
   * @returns new spy function which returns static value
   * @api public
   */

  chai.spy.returns = function (value) {
    return chai.spy(function () {
      return value;
    });
  };

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
      , 'expected ' + this._obj + ' to be a spy'
      , 'expected ' + this._obj + ' to not be a spy');
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

  function assertCalled (n) {
    new Assertion(this._obj).to.be.spy;
    var spy = this._obj.__spy;

    if (n) {
      this.assert(
          spy.calls.length === n
        , 'expected ' + this._obj + ' to have been called #{exp} but got #{act}'
        , 'expected ' + this._obj + ' to have not been called #{exp}'
        , n
        , spy.calls.length
      );
    } else {
      this.assert(
          spy.called === true
        , 'expected ' + this._obj + ' to have been called'
        , 'expected ' + this._obj + ' to not have been called'
      );
    }
  }

  function assertCalledChain () {
    new Assertion(this._obj).to.be.spy;
  }

  Assertion.addChainableMethod('called', assertCalled, assertCalledChain);

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
      , 'expected ' + this._obj + ' to have been called once but got #{act}'
      , 'expected ' + this._obj + ' to not have been called once'
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
      , 'expected ' + this._obj + ' to have been called twice but got #{act}'
      , 'expected ' + this._obj + ' to not have been called twice'
      , 2
      , this._obj.__spy.calls.length
    );
  });

  /**
   * # nth call (spy, n, arguments)
   *
   * Asserts that the nth call of the spy has been called with
   *
   */

  function nthCallWith(spy, n, expArgs) {
    if (spy.calls.length < n) return false;

    var actArgs = spy.calls[n].slice()
      , passed = 0;

    expArgs.forEach(function (expArg) {
      for (var i = 0; i < actArgs.length; i++) {
        if (_.eql(actArgs[i], expArg)) {
          passed++;
          actArgs.splice(i, 1);
          break;
        }
      }
    });

    return passed === expArgs.length
  }

  function numberOfCallsWith(spy, expArgs) {
    var found = 0
      , calls = spy.calls;

    for (var i = 0; i < calls.length; i++) {
      if (nthCallWith(spy, i, expArgs)) {
        found++;
      }
    }

    return found;
  }

  Assertion.addProperty('first', function () {
    if ('undefined' !== this._obj.__spy) {
      _.flag(this, 'spy nth call with', 1);
    }
  });

  Assertion.addProperty('second', function () {
    if ('undefined' !== this._obj.__spy) {
      _.flag(this, 'spy nth call with', 2);
    }
  });

  Assertion.addProperty('third', function () {
    if ('undefined' !== this._obj.__spy) {
      _.flag(this, 'spy nth call with', 3);
    }
  });

  Assertion.addProperty('on');

  Assertion.addChainableMethod('nth', function (n) {
    if ('undefined' !== this._obj.__spy) {
      _.flag(this, 'spy nth call with', n);
    }
  });

  function generateOrdinalNumber(n) {
    if (n === 1) return 'first';
    if (n === 2) return 'second';
    if (n === 3) return 'third';
    return n + 'th';
  }

  /**
   * ### .with
   *
   */

  function assertWith() {
    new Assertion(this._obj).to.be.spy;
    var expArgs = [].slice.call(arguments, 0)
      , spy = this._obj.__spy
      , calls = spy.calls
      , always = _.flag(this, 'spy always')
      , nthCall = _.flag(this, 'spy nth call with');

    if (always) {
      var passed = numberOfCallsWith(spy, expArgs);
      this.assert(
          passed === calls.length
        , 'expected ' + this._obj + ' to have been always called with #{exp} but got ' + passed + ' out of ' + calls.length
        , 'expected ' + this._obj + ' to have not always been called with #{exp}'
        , expArgs
      );
    } else if (nthCall) {
      var ordinalNumber = generateOrdinalNumber(nthCall),
          actArgs = calls[nthCall - 1];
      new Assertion(this._obj).to.be.have.been.called.min(nthCall);
      this.assert(
          nthCallWith(spy, nthCall - 1, expArgs)
        , 'expected ' + this._obj + ' to have been called at the ' + ordinalNumber + ' time with #{exp} but got #{act}'
        , 'expected ' + this._obj + ' to have not been called at the ' + ordinalNumber + ' time with #{exp}'
        , expArgs
        , actArgs
      );
    } else {
      var passed = numberOfCallsWith(spy, expArgs);
      this.assert(
          passed > 0
        , 'expected ' + this._obj + ' to have been called with #{exp}'
        , 'expected ' + this._obj + ' to have not been called with #{exp} but got ' + passed + ' times'
        , expArgs
      );
    }
  }

  function assertWithChain () {
    if ('undefined' !== this._obj.__spy) {
      _.flag(this, 'spy with', true);
    }
  }

  Assertion.addChainableMethod('with', assertWith, assertWithChain);

  Assertion.addProperty('always', function () {
    if ('undefined' !== this._obj.__spy) {
      _.flag(this, 'spy always', true);
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

  Assertion.addMethod('exactly', function () {
    new Assertion(this._obj).to.be.spy;
    var always = _.flag(this, 'spy always')
      , _with = _.flag(this, 'spy with')
      , args = [].slice.call(arguments, 0)
      , calls = this._obj.__spy.calls
      , nthCall = _.flag(this, 'spy nth call with')
      , passed;

    if (always && _with) {
      passed = 0
      calls.forEach(function (call) {
        if (call.length !== args.length) return;
        if (_.eql(call, args)) passed++;
      });

      this.assert(
          passed === calls.length
        , 'expected ' + this._obj + ' to have been always called with exactly #{exp} but got ' + passed + ' out of ' + calls.length
        , 'expected ' + this._obj + ' to have not always been called with exactly #{exp}'
        , args
      );
    } else if(_with && nthCall) {
      var ordinalNumber = generateOrdinalNumber(nthCall),
          actArgs = calls[nthCall - 1];
      new Assertion(this._obj).to.be.have.been.called.min(nthCall);
      this.assert(
          _.eql(actArgs, args)
        , 'expected ' + this._obj + ' to have been called at the ' + ordinalNumber + ' time with exactly #{exp} but got #{act}'
        , 'expected ' + this._obj + ' to have not been called at the ' + ordinalNumber + ' time with exactly #{exp}'
        , args
        , actArgs
      );
    } else if (_with) {
      passed = 0;
      calls.forEach(function (call) {
        if (call.length !== args.length) return;
        if (_.eql(call, args)) passed++;
      });

      this.assert(
          passed > 0
        , 'expected ' + this._obj + ' to have been called with exactly #{exp}'
        , 'expected ' + this._obj + ' to not have been called with exactly #{exp} but got ' + passed + ' times'
        , args
      );
    } else {
      this.assert(
          this._obj.__spy.calls.length === args[0]
        , 'expected ' + this._obj + ' to have been called #{exp} times but got #{act}'
        , 'expected ' + this._obj + ' to not have been called #{exp} times'
        , args[0]
        , this._obj.__spy.calls.length
      );
    }
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
          , 'expected ' + this._obj + ' to have been called more than #{exp} times but got #{act}'
          , 'expected ' + this._obj + ' to have been called at most #{exp} times but got #{act}'
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
          , 'expected ' + this._obj + ' to have been called fewer than #{exp} times but got #{act}'
          , 'expected ' + this._obj + ' to have been called at least #{exp} times but got #{act}'
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

  /**
   * # min (n)
   *
   * Assert that a spy has been called `n` or more times.
   *
   * @param {Number} n times
   * @api public
   */

  function min (_super) {
    return function (n) {
      if ('undefined' !== typeof this._obj.__spy) {
        new Assertion(this._obj).to.be.spy;

        this.assert(
            this._obj.__spy.calls.length >= n
          , 'expected ' + this._obj + ' to have been called at least #{exp} times but got #{act}'
          , 'expected ' + this._obj + ' to have been called fewer than #{exp} times but got #{act}'
          , n
          , this._obj.__spy.calls.length
        );
      } else {
        _super.apply(this, arguments);
      }
    }
  }

  Assertion.overwriteMethod('min', min);
  Assertion.overwriteMethod('least', min);

  /**
   * # max (n)
   *
   * Assert that a spy has been called `n` or fewer times.
   *
   * @param {Number} n times
   * @api public
   */

  function max (_super) {
    return function (n) {
      if ('undefined' !== typeof this._obj.__spy) {
        new Assertion(this._obj).to.be.spy;

        this.assert(
            this._obj.__spy.calls.length <=  n
          , 'expected ' + this._obj + ' to have been called at most #{exp} times but got #{act}'
          , 'expected ' + this._obj + ' to have been called more than #{exp} times but got #{act}'
          , n
          , this._obj.__spy.calls.length
        );
      } else {
        _super.apply(this, arguments);
      }
    }
  }

  Assertion.overwriteMethod('max', max);
  Assertion.overwriteMethod('most', max);
};
