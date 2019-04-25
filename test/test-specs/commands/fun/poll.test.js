const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

// tested
const tested = rewire('../../src/commands/fun/poll')

const commands = tested.__get__('commands')
const poll = commands.poll.action
const man = sinon.fake()
const result = { react: sinon.fake() }
const send = sinon.fake.resolves(result)

tested.__set__('send', send)
tested.__set__('man', man)

describe('poll', () => {

    it('should call "man" if question is not passed', () => {
        poll({}, '')
        
        expect(man.calledWithExactly({}, 'poll')).to.be.ok
    })

    it('should send message and set reactions', async () => {
        poll({}, 'question')
        await send

        expect(send.calledWithExactly({ channel: undefined, text: '@here question' })).to.be.ok
        expect(result.react.calledWith('👍')).to.be.ok
        expect(result.react.calledWith('👎')).to.be.ok
    })

})