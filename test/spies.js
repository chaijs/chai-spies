if (!chai) {
  var chai = require('chai')
    , spies = require('..');
  chai.use(spies);
}

var should = chai.should();

describe('Chai Spies', function () {

  it('should know when obj is a spy', function () {
    var spy = chai.spy();
    spy.should.be.spy;
  });
});
