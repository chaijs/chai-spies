if (!chai) {
  var chai = require('chai')
    , spies = require('..');
  chai.use(spies);
}

var should = chai.should();

describe('Chai Spies', function () {

  describe('name', function() {
    it('defaults to undefined', function() {
      chai.expect(chai.spy().__spy.name).to.equal(undefined);
    });

    it('exposes the name', function() {
      chai.expect(chai.spy('007').__spy.name).to.equal('007');
    });

    it('executes the function sent to the spy', function() {
      var spy = chai.spy()
      chai.spy('007', spy)();
      spy.should.have.been.called.once
    });
  });

  describe('textual representation', function() {

    it('should print out nice', function() {
      chai.spy().toString().should.equal("{ Spy }");
    });
    it('should show the name', function() {
      chai.spy('Nikita').toString().should.equal("{ Spy 'Nikita' }");
    });
    it('should expose number of invokations', function() {
      var spy = chai.spy()
      spy(); // 1
      spy(); // 2
      spy.toString().should.equal("{ Spy, 2 calls }");
    });
    it('should expose name and number of invokations', function() {
      var spy = chai.spy('Nikita')
      spy(); // 1
      spy.toString().should.equal("{ Spy 'Nikita', 1 call }");
    });

  });

  it('should return the value of the mock function', function() {
    var spy = chai.spy(function() { return 'Jack Bauer'; });
    var jack = spy();
    chai.expect(jack).to.equal('Jack Bauer');
  });

  it('should invoke the function sent to the spy', function() {
    var spy = chai.spy()
    chai.spy(spy)()
    spy.should.have.been.called.once
  });

  it('should know when obj is a spy', function () {
    var spy = chai.spy();
    spy.should.be.spy;

    (function () {
      'hello'.should.be.a.spy;
    }).should.throw(chai.AssertionError);
  });

  it('should know when a spy has been called', function () {
    var spy = chai.spy();
    spy.should.be.spy;
    spy.__spy.called.should.be.false;
    spy();
    spy.should.have.been.called();
    (function () {
      spy.should.have.not.been.called();
    }).should.throw(chai.AssertionError);
  });

  it('should know when a spy has not been called', function () {
    var spy = chai.spy();
    spy.should.be.spy;
    spy.should.have.not.been.called();
    (function () {
      spy.should.have.been.called();
    }).should.throw(chai.AssertionError);
  });

  it('should know when a spy has been called once', function () {
    var spy1 = chai.spy()
      , spy2 = chai.spy();
    spy1();
    spy2();
    spy2();
    spy1.should.have.been.called.once;

    (function () {
      spy2.should.have.been.called.once;
    }).should.throw(chai.AssertionError);

    (function () {
      spy1.should.have.not.been.called.once;
    }).should.throw(chai.AssertionError);
  });

  it('should know when a spy has been called twice', function () {
    var spy1 = chai.spy()
      , spy2 = chai.spy();
    spy1();
    spy1();
    spy2();
    spy2();
    spy2();
    spy1.should.have.been.called.twice;
    (function () {
      spy2.should.have.been.called.twice;
    }).should.throw(chai.AssertionError);
    (function () {
      spy1.should.have.not.been.called.twice;
    }).should.throw(chai.AssertionError);
  });

  it('should know when a spy has been called exactly n times', function () {
    var spy1 = chai.spy();
    spy1();
    spy1.should.have.been.called.exactly(1);
    (function () {
      spy1.should.have.been.called.exactly(2);
    }).should.throw(chai.AssertionError);
    (function () {
      spy1.should.not.have.been.called.exactly(1);
    }).should.throw(chai.AssertionError);
  });

  it('should know when a spy has been called above n times', function () {
    var spy = chai.spy();
    spy();
    spy();
    spy.should.have.been.called.above(1);
    spy.should.have.been.called.gt(0);
    (2).should.be.above(1);
    (2).should.be.gt(1);
    (function () {
      spy.should.have.been.called.above(2);
    }).should.throw(chai.AssertionError);
    (function () {
      spy.should.not.have.been.called.above(1);
    }).should.throw(chai.AssertionError);
  });

  it('should know when a spy has been called below n times', function () {
    var spy = chai.spy();
    spy();
    spy();
    spy();
    spy.should.have.been.called.below(4);
    spy.should.have.not.been.called.lt(3);
    (1).should.be.below(2);
    (1).should.be.lt(2);
    (function () {
      spy.should.have.been.called.below(2);
    }).should.throw(chai.AssertionError);
    (function () {
      spy.should.not.have.been.called.below(4);
    }).should.throw(chai.AssertionError);
  });

  it('should know when a spy has been called at least n times', function () {
    var spy = chai.spy();
    spy();
    spy();
    spy.should.have.been.called.min(2);
    spy.should.have.been.called.at.least(1);
    (2).should.be.at.least(2);
    (2).should.be.at.least(1);
    (function () {
      spy.should.have.been.called.min(3);
    }).should.throw(chai.AssertionError);
    (function () {
      spy.should.not.have.been.called.above(1);
    }).should.throw(chai.AssertionError);
  });

  it('should know when a spy has been called at most n times', function () {
    var spy = chai.spy();
    spy();
    spy();
    spy();
    spy.should.have.been.called.max(3);
    spy.should.have.been.called.at.most(4);
    (1).should.be.at.most(3);
    (1).should.be.at.most(4);
    (function () {
      spy.should.have.been.called.max(2);
    }).should.throw(chai.AssertionError);
    (function () {
      spy.should.not.have.been.called.at.most(3);
    }).should.throw(chai.AssertionError);
  });

  it('should understand length', function () {
    var orig = function (a, b) {}
      , spy = chai.spy(orig)
      , spyClean = chai.spy();
    orig.should.have.length(2);
    spy.should.have.length(2);
    spyClean.should.have.length(0);
  });

  it('should create spy which returns static value', function() {
    var value = {};
    var spy = chai.spy.returns(value);

    spy.should.be.a.spy;
    spy().should.equal(value);
  });

  describe('.with', function () {
    it('should not interfere chai with' ,function () {
      (1).should.be.with.a('number');
    });
  });

  describe('.with(arg, ...)', function () {
    it('should pass when called with an argument', function () {
      var spy = chai.spy();
      spy(1);
      spy(2);
      spy(3);
      spy.should.have.been.called.with(1);
      spy.should.have.been.called.with(2);
      spy.should.have.been.called.with(3);
      spy.should.not.have.been.called.with(4);
      (function () {
        spy.should.have.been.called.with(4);
      }).should.throw(chai.AssertionError, /have been called with/);
      (function () {
        spy.should.have.not.been.called.with(1);
      }).should.throw(chai.AssertionError, /have not been called with/);
    });

    it('should pass with called with multiple arguments', function () {
      var spy = chai.spy();
      spy(1,2,3);
      spy(2,4,6);
      spy(3,6,9);
      spy.should.have.been.called.with(1,2);
      spy.should.have.been.called.with(2,4);
      spy.should.have.been.called.with(3,6);
      spy.should.have.been.called.with(3,1,2);
      spy.should.have.been.called.with(6,2,4);
      spy.should.have.been.called.with(9,3,6);
      spy.should.not.have.been.called.with(5);
      spy.should.not.have.been.called.with(1,9);
      spy.should.not.have.been.called.with(9,1,4);
      (function () {
        spy.should.have.been.called.with(1,2,5);
      }).should.throw(chai.AssertionError, /have been called with/);
      (function () {
        spy.should.have.not.been.called.with(3,6,9);
      }).should.throw(chai.AssertionError, /have not been called with/);
    });

    it('should pass when called with multiple identical arguments', function () {
      var spy = chai.spy();
      spy(1, 1);
      spy.should.have.been.called.with(1);
      spy.should.have.been.called.with(1, 1);
      spy.should.not.have.been.called.with(1, 2);
      spy.should.not.have.been.called.with(1, 1, 1);
    });
  });

  describe('.always.with(arg, ...)', function () {
    it('should pass when called with an argument', function () {
      var spy = chai.spy();
      spy(1);
      spy(1, 2);
      spy(3, 1);
      spy(4, 5, 1);
      spy.should.have.been.always.called.with(1);
      spy.should.not.always.have.been.called.with(2);
      spy.should.not.always.have.been.called.with(8);
      (function () {
        spy.should.have.been.always.called.with(2);
      }).should.throw(chai.AssertionError, /to have been always called with/);
      (function () {
        spy.should.not.have.been.always.called.with(1);
      }).should.throw(chai.AssertionError, /to have not always been called with/);
    });

    it('should pass when called with multiple arguments', function () {
      var spy = chai.spy();
      spy(1,2);
      spy(2,1);
      spy(1,3,2);
      spy(2,5,1);
      spy.should.have.been.always.called.with(1,2);
      spy.should.not.always.have.been.called.with(2,3);
      spy.should.not.always.have.been.called.with(4,6);
      (function () {
        spy.should.have.been.always.called.with(2,3);
      }).should.throw(chai.AssertionError, /to have been always called with/);
      (function () {
        spy.should.not.have.been.always.called.with(1,2);
      }).should.throw(chai.AssertionError, /to have not always been called with/);
    });

    it('should pass when called with multiple identical arguments', function () {
      var spy = chai.spy();
      spy(1, 3, 1);
      spy(1, 2, 1);
      spy.should.have.always.been.called.with(1);
      spy.should.have.always.been.called.with(1, 1);
      spy.should.not.have.always.been.called.with(1, 2);
      spy.should.not.have.always.been.called.with(1, 1, 1);
    });
  });

  describe('.with.exactly(arg, ...)', function () {
    it('should pass when called with an argument', function () {
      var spy = chai.spy();
      spy(1);
      spy(1, 2);
      spy.should.have.been.called.with.exactly(1);
      spy.should.have.not.been.called.with.exactly(2);
      (function () {
        spy.should.have.been.called.with.exactly(2);
      }).should.throw(chai.AssertionError, /to have been called with exactly/);
      (function () {
        spy.should.have.not.been.called.with.exactly(1);
      }).should.throw(chai.AssertionError, /to not have been called with exactly/);
    });

    it('shoud pass when called with multiple arguments', function () {
      var spy = chai.spy();
      spy(1);
      spy(3, 2);
      spy.should.have.been.called.with.exactly(3,2);
      spy.should.have.not.been.called.with.exactly(2,3);
      (function () {
        spy.should.have.been.called.with.exactly(2,3);
      }).should.throw(chai.AssertionError, /to have been called with exactly/);
      (function () {
        spy.should.have.not.been.called.with.exactly(3,2);
      }).should.throw(chai.AssertionError, /to not have been called with exactly/);
    });

    it('should pass when called with multiple identical arguments', function () {
      var spy = chai.spy();
      spy(1, 1);
      spy.should.have.been.called.with.exactly(1, 1);
      spy.should.not.have.been.called.with.exactly(1);
      spy.should.not.have.been.called.with.exactly(1, 2);
      spy.should.not.have.been.called.with.exactly(1, 1, 1);
    });
  });

  describe('.always.with.exactly(arg, ...)', function () {
    it('should pass when called with an argument', function () {
      var spy = chai.spy();
      spy(3);
      spy(3);
      spy.should.have.always.been.called.with.exactly(3);

      var spy2 = chai.spy();
      spy2(3);
      spy2(4);
      spy2.should.have.not.always.been.called.with.exactly(3);

      (function () {
        spy2.should.have.been.always.called.with.exactly(3);
      }).should.throw(chai.AssertionError, /to have been always called with exactly/);
    });

    it('should pass when called with multiple arguments', function () {
      var spy = chai.spy();
      spy(3,4);
      spy(3,4);
      spy.should.have.always.been.called.with.exactly(3,4);

      var spy2 = chai.spy();
      spy2(3);
      spy2(4,4);
      spy2.should.have.not.always.been.called.with.exactly(4,4);

      (function () {
        spy2.should.have.been.always.called.with.exactly(4,4);
      }).should.throw(chai.AssertionError, /to have been always called with exactly/);
    });

    it('should pass when called with multiple identical arguments', function () {
      var spy = chai.spy();
      spy(1, 1);
      spy(1, 1);
      spy.should.have.always.been.called.with.exactly(1, 1);
      spy.should.not.have.always.been.called.with.exactly(1);
      spy.should.not.have.always.been.called.with.exactly(1, 2);
      spy.should.not.have.always.been.called.with.exactly(1, 1, 1);
    });
  });

  describe('spy on', function () {
    var object;

    beforeEach(function () {
      object = []
    });

    it('should spy specified object method', function () {
      chai.spy.on(object, 'push');
      object.push(1, 2);

      object.push.should.be.a.spy;
      object.should.have.length(2);
    });

    it('should spy multiple object methods', function () {
      chai.spy.on(object, ['push', 'pop']);

      object.push.should.be.a.spy;
      object.pop.should.be.a.spy;
    });

    it('should allow to create spy for non-existing property', function () {
      chai.spy.on(object, 'nonExistingProperty');

      object.nonExistingProperty.should.be.a.spy;
    });

    it('should throw if non function property is passed', function () {
      (function () {
        chai.spy.on(object, 'length');
      }).should.throw(Error);
    });

    it('should throw if method is already a spy', function () {
      object.push = chai.spy();

      (function () {
        chai.spy.on(object, 'push');
      }).should.throw(Error)
    });

    it('should allow to overwrite method implementation', function () {
      chai.spy.on(object, 'push', function() {
        return 5;
      });

      object.push().should.equal(5);
    });

    it('should overwrite all methods with the same implementation', function () {
      chai.spy.on(object, ['push', 'pop'], function() {
        return 5;
      });

      object.push().should.equal(5);
      object.pop().should.equal(5);
    })
  });

  describe('spy interface', function () {

    it('should create a spy object with specified method names', function () {
      var array = chai.spy.interface('array', ['push', 'pop']);

      array.push.should.be.a.spy;
      array.pop.should.be.a.spy;
    });

    it('should wrap each method in spy', function () {
      var array = [];
      var object = chai.spy.interface({
        push: function() {
          return array.push.apply(array, arguments);
        }
      });

      object.push(1, 2, 3);

      object.push.should.be.a.spy;
      array.should.have.length(3);
    });

    it('should return value from spied method', function () {
      var object = chai.spy.interface({
        push: function () {
          return 'push';
        }
      });

      object.push().should.equal('push');
    });

    it('should create a plain object', function () {
      var object = chai.spy.interface('Object', ['method']);

      object.should.be.an('object');
    });
  });

  describe('reset method', function () {
    it('should reset spy object values to defaults when called', function() {
      var name = 'proxy';
      var spy = chai.spy(name);

      spy();
      spy.should.have.been.called();
      spy.__spy.called.should.be.true;
      spy.__spy.calls.should.have.length(1);
      spy.__spy.name.should.be.equal(name);

      spy.reset();

      spy.should.not.have.been.called();
      spy.__spy.called.should.be.false;
      spy.__spy.calls.should.have.length(0);
      spy.__spy.name.should.be.equal(name);
    });

    it('should setup spy with default values when spy is instantiated', function() {
      var name     = 'proxy';
      var spy      = chai.spy(name);

      spy.should.be.spy;
      spy.__spy.called.should.be.false;
      spy.__spy.calls.should.have.length(0);
      spy.__spy.name.should.be.equal(name);
    });
  });

  describe('spy restore', function () {
    var array;

    beforeEach(function () {
      array = [];
      chai.spy.on(array, 'push');
    })

    it('should restore all methods of tracked objects', function () {
      chai.spy.restore();

      array.push.should.not.be.spy;
    });

    it('should restore all methods on an object', function () {
      chai.spy.on(array, 'pop');
      chai.spy.restore(array);

      array.push.should.not.be.spy;
      array.pop.should.not.be.spy;
    });

    it('should restore a particular method on an particular object', function () {
      chai.spy.restore(array, 'push');

      array.push.should.not.be.spy;
    });

    it('should not throw if there are not tracked objects', function () {
      chai.spy.restore();

      chai.spy.restore.should.not.throw(Error);
    });
  });
});
