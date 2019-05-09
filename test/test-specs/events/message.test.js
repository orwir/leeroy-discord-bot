const common = require('../common')
const sinon = common.sinon
const expect = common.expect
const rewire = common.rewire

//tested
const tested = rewire('../../src/events/message')
const commands = {
    'test': {
        action: sinon.fake()
    }
}
const guilds = {
    'id': {
        t: sinon.fake(),
        aliases: {
            'alias': 'test'
        },
        prefix: 'e!'
    }
}
const guild = guilds['id']
const send = sinon.fake()
const config = {
    prefix: 'e!'
}

tested.__set__('guilds', guilds)
tested.__set__('send', send)
tested.__set__('config', config)
tested.__set__('commands', commands)
tested.__set__('configure', sinon.fake())
tested.__set__('developers', [])
tested.__set__('permitted', sinon.fake.returns(true))


describe('message', () => {

    beforeEach(() => {
        config.dev = false
        guild.t.resetHistory()
        guild.prefix = config.prefix
        send.resetHistory()
        commands.test.action = sinon.fake()
        commands.test.stable = false
        commands.test.dev = false
        commands.test.arguments = null
    })

    it('call command', async () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        await tested(msg)

        expect(commands.test.action.calledOnce).to.ok
    })

    it('call command with old prefix if command is stable', async () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        guild.prefix = 'n!'
        commands.test.stable = true
        await tested(msg)

        expect(commands.test.action.calledOnce).to.ok
    })

    it('call command by alias', async () => {
        const msg = {
            author: { bot: false },
            content: 'e!alias',
            guild: { id: 'id' }
        }
        await tested(msg)

        expect(commands.test.action.calledOnce).to.ok
    })

    it('call command with arguments', async () => {
        const msg = {
            author: { bot: false },
            content: 'e!test arg1 arg2 arg3',
            guild: { id: 'id' }
        }
        await tested(msg)

        expect(commands.test.action.calledOnceWithExactly(msg, 'arg1', 'arg2', 'arg3')).to.be.ok
    })

    it('call command with long argument', async () => {
        const msg = {
            author: { bot: false },
            content: 'e!test long argument with spaces',
            guild: { id: 'id' }
        }
        commands.test.arguments = 1
        await tested(msg)

        expect(commands.test.action.calledOnceWithExactly(msg, 'long argument with spaces')).to.be.ok
    })

    it('do not call command if author is bot', async () => {
        const msg = {
            author: { bot: true }
        }
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('do not call command if content is empty', async () => {
        const msg = {
            author: { bot: false },
            content: ''
        }
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('do not call command without prefix', async () => {
        const msg = {
            author: { bot: false },
            content: 'random message',
            guild: { id: 'id' }
        }
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('do not call not stable command with old prefix', async () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        guild.prefix = 'n!'
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('show message if command not found', async () => {
        const msg = {
            author: { bot: false },
            content: 'e!blabla',
            guild: { id: 'id' }
        }
        await tested(msg)

        expect(guild.t.calledWith('commandNotFound', { name: 'blabla' })).to.ok
        expect(guild.t.calledWith('commandNotFoundDescription')).to.ok
    })

    it('do not call dev command if env is not dev', async () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        commands.test.dev = true
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('show detailed message about error if env is dev', async () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        config.dev = true
        commands.test.action = sinon.fake.throws(new Error('Test Error'))
        await tested(msg)

        expect(commands.test.action.called).to.ok
        expect(send.calledOnce).to.be.ok
        expect(guild.t.calledWith('internalErrorMessage')).to.ok
    })

    it('show short message about error if env is prod', async () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        commands.test.action = sinon.fake.throws(new Error('Test Error'))
        await tested(msg)

        expect(commands.test.action.called).to.ok
        expect(send.calledOnce).to.ok
        expect(guild.t.calledWith('internalErrorDescription')).to.ok
    })

})