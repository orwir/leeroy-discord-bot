const shared = require('../../shared')
const rewire = shared.rewire
const expect = shared.expect

describe('wtf', () => {

    // tested
    const tested = rewire('../../src/features/utility/wtf')
    const common = tested.__get__('common')
    const wtf = common.features.wtf.action

    beforeEach(() => {
        shared.mock(common)
    })

    it('show information', () => {
        const msg = shared.msg()
        common.features.man = {
            name: 'man'
        }
        
        wtf(msg)

        expect(msg.channel.send.calledOnce).to.ok
    })

})