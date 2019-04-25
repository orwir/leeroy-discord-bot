const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

describe('poll', () => {

    // tested
    const tested = rewire('../../src/commands/fun/poll')
    const commands = tested.__get__('commands')
    const poll = commands.poll.action

    it('should call "man" if question is not passed', () => {
        const man = {
            action: sinon.fake()
        }
        commands.man = man
        poll({}, '')
        expect(man.action.calledWithExactly({}, 'poll')).to.be.ok
    })

    it('should send message and set reactions', async () => {
        const result = {
            react: sinon.fake()
        }
        const send = sinon.fake.resolves(result)
        tested.__set__('send', send)

        poll({}, 'question')
        await send
        expect(send.calledWithExactly({ channel: undefined, text: '@here question' })).to.be.ok
        expect(result.react.calledWith('👍')).to.be.ok
        expect(result.react.calledWith('👎')).to.be.ok
    })

})