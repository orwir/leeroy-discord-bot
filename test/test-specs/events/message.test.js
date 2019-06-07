const shared = require('../shared')
const sinon = shared.sinon
const expect = shared.expect
const rewire = shared.rewire

describe('message', () => {

    const tested = rewire('../../src/events/message')
    const global = tested.__get__('global')
    const action = sinon.fake()

    beforeEach(() => {
        shared.mock(global)
        action.resetHistory()
        global.features.test = {
            action: action
        }
    })

    it('call command', async () => {
        const msg = shared.msg()
        msg.content = 'e!test'

        await tested(msg)

        expect(action.calledOnce).to.ok
    })

    it('call command with old prefix if command is stable', async () => {
        const msg = shared.msg()
        msg.content = 'e!test'
        const config = global.obtainServerConfig()
        config.prefix = 'n!'
        global.features.test.stable = true
        
        await tested(msg)

        expect(action.calledOnce).to.ok
    })

    it('call command by alias', async () => {
        const msg = shared.msg()
        msg.content = 'e!alias'
        const config = global.obtainServerConfig()
        config.aliases.alias = 'test'

        await tested(msg)

        expect(action.calledOnce).to.ok
    })

    it('call command with arguments', async () => {
        const msg = shared.msg()
        msg.content = 'e!test arg1 arg2 arg3'

        await tested(msg)

        expect(action.calledOnceWithExactly(msg, 'arg1', 'arg2', 'arg3')).to.ok
    })

    it('call command with long argument', async () => {
        const msg = shared.msg()
        msg.content = 'e!test long argument with spaces'
        global.features.test.arguments = 1

        await tested(msg)

        expect(action.calledOnceWithExactly(msg, 'long argument with spaces')).to.ok
    })

    it('do not call command if author is bot', async () => {
        const msg = shared.msg()
        msg.author.bot = true
        
        await tested(msg)

        expect(action.called).to.not.ok
    })

    it('do not call command if content is empty', async () => {
        const msg = shared.msg()
        msg.content = ''

        await tested(msg)

        expect(action.called).to.not.ok
    })

    it('do not call command without prefix', async () => {
        const msg = shared.msg()
        msg.content = 'random message'

        await tested(msg)

        expect(action.called).to.not.ok
    })

    it('do not call not stable command with old prefix', async () => {
        const msg = shared.msg()
        msg.content = 'e!test'
        const server = global.obtainServerConfig()
        server.prefix = 'n!'

        await tested(msg)

        expect(action.called).to.not.ok
    })

    it('show message if command not found', async () => {
        const msg = shared.msg()
        msg.content = 'e!blabla'
        const config = global.obtainServerConfig()

        await tested(msg)

        expect(config.t.calledWith('global.command_not_found_title', { name: 'blabla' })).to.ok
        expect(config.t.calledWith('global.command_not_found_description')).to.ok
    })

    it('call debug command if debug is enabled',  async () => {
        const msg = shared.msg()
        msg.content = 'e!test'
        const config = global.obtainServerConfig()
        config.debug = 1
        global.features.test.debug = true
        
        await tested(msg)

        expect(action.called).to.ok
    })

    it('do not call debug command if debug is disabled', async () => {
        const msg = shared.msg()
        msg.content = 'e!test'
        global.features.test.debug = true
        
        await tested(msg)

        expect(action.called).to.not.ok
    })

    it('show error message if action throws exception', async () => {
        const msg = shared.msg()
        msg.content = 'e!test'
        global.features.test.action = sinon.fake.throws(new Error('Test Error'))
        
        await tested(msg)

        expect(global.features.test.action.called).to.ok
        expect(global.log.calledOnce).to.ok
    })

})