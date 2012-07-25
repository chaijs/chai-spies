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

  it('should know when a spy has been called max n times', function () {
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

  it('should understand length', function () {
    var orig = function (a, b) {

    };

    var spy = chai.spy(orig);
    orig.should.have.length(2);
    spy.should.have.length(2);

    var spyClean = chai.spy();
    spyClean.should.have.length(0);
  });
});