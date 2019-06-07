const shared = require('../../shared')
const rewire = shared.rewire
const expect = shared.expect

describe('wtf', () => {

    // tested
    const tested = rewire('../../src/features/utility/wtf')
    const global = tested.__get__('global')
    const wtf = global.features.wtf.action

    beforeEach(() => {
        shared.mock(global)
    })

    it('show information', () => {
        const msg = shared.msg()
        global.features.man = {
            name: 'man'
        }
        
        wtf(msg)

        expect(msg.channel.send.calledOnce).to.ok
    })

})