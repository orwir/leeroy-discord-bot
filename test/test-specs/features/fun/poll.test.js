const shared = require('../../shared')
const sinon = shared.sinon
const rewire = shared.rewire
const expect = shared.expect

describe('poll', () => {

    // tested
    const tested = rewire('../../src/features/fun/poll')
    const common = tested.__get__('common')
    const poll = common.features.poll.action

    beforeEach(() => {
        shared.mock(common)
    })

    it('call "man" if question is not passed', () => {
        const msg = shared.msg()
        
        poll(msg, '')
        
        expect(common.man.calledWithExactly(msg, 'poll')).to.ok
    })

    it('send message and set reactions', async () => {
        const msg = shared.msg()
        const react = sinon.fake.resolves()
        msg.channel.send = sinon.fake.resolves({
            react: react
        })

        poll(msg, 'question')
        await msg.channel.send

        expect(msg.channel.send.calledWith('@here question')).to.ok
        expect(react.calledWith('👍')).to.ok
        await react
        expect(react.calledWith('👎')).to.ok
    })

})