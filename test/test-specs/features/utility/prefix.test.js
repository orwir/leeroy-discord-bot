const shared = require('../../shared')
const rewire = shared.rewire
const expect = shared.expect

describe('prefix', () => {

    // tested
    const tested = rewire('../../src/features/utility/prefix')
    const common = tested.__get__('common')
    const prefix = common.features.prefix.action

    beforeEach(() => {
        shared.mock(common)
    })

    it('change prefix', () => {
        const msg = shared.msg()
        const config = common.obtainServerConfig()

        prefix(msg, 'test')

        expect(config.prefix).to.equals('test')
        expect(msg.channel.send.calledOnce).to.ok
        expect(common.saveServerConfig.calledOnce).to.ok
    })

    it('show man if prefix not passed', () => {
        const msg = shared.msg()

        prefix(msg)

        expect(common.man.calledWithExactly(msg, 'prefix')).to.ok
    })

})