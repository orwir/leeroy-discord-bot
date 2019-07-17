const sinon = require('sinon')
const chai = require('chai')
chai.use(require('chai-as-promised'))

module.exports = {
    rewire: require('rewire'),
    sinon: sinon,
    chai: chai,
    assert: chai.assert,
    expect: chai.expect,
    should: chai.should,
    msg: () => new class {
        author = {
            bot: false
        }
        guild = {
            id: '1',
            member: sinon.fake()
        }
        channel = {
            send: sinon.fake()
        }
    }(),
    mock: (common) => {
        const config = {
            id: '1',
            language: 'en',
            prefix: 'e!',
            debug: 0,
            aliases: {},
            developers: [],
            t: sinon.fake()
        }

        common.config.prefix = 'e!'
        common.features = {}
        common.configureServer = sinon.fake.returns(config)
        common.obtainServerConfig = sinon.fake.returns(config)
        common.saveServerConfig = sinon.fake()
        common.man = sinon.fake()
        common.log = sinon.fake()
        common.updateRole = sinon.fake()
        common.storage = {
            save: sinon.fake.resolves(),
            obtain: async (id, def) => def,
            delete: sinon.fake.resolves()
        }
    }
}