const shared = require('../../shared')
const rewire = shared.rewire
const expect = shared.expect

describe('prefix', () => {

    // tested
    const tested = rewire('../../src/features/utility/prefix')
    const global = tested.__get__('global')
    const prefix = global.features.prefix.action

    beforeEach(() => {
        shared.mock(global)
    })

    it('change prefix', () => {
        const msg = shared.msg()
        const config = global.obtainServerConfig()

        prefix(msg, 'test')

        expect(config.prefix).to.equals('test')
        expect(msg.channel.send.calledOnce).to.ok
        expect(global.saveServerConfig.calledOnce).to.ok
    })

    it('show man if prefix not passed', () => {
        const msg = shared.msg()

        prefix(msg)

        expect(global.man.calledWithExactly(msg, 'prefix')).to.ok
    })

})