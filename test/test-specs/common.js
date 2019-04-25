const chai = require('chai')
chai.use(require('chai-as-promised'))

module.exports = {
    rewire: require('rewire'),
    sinon: require('sinon'),
    chai: chai,
    assert: chai.assert,
    expect: chai.expect,
    should: chai.should,
}