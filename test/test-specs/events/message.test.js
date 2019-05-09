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
            'alias': commands.test
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

    it('call command', () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        tested(msg)

        expect(commands.test.action.calledOnce).to.be.ok
    })

    it('call command with old prefix if command is stable', () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        guild.prefix = 'n!'
        commands.test.stable = true
        tested(msg)

        expect(commands.test.action.calledOnce).to.be.ok
    })

    it('call command by alias', () => {
        const msg = {
            author: { bot: false },
            content: 'e!alias',
            guild: { id: 'id' }
        }
        tested(msg)

        expect(commands.test.action.calledOnce).to.be.ok
    })

    it('call command with arguments', () => {
        const msg = {
            author: { bot: false },
            content: 'e!test arg1 arg2 arg3',
            guild: { id: 'id' }
        }
        tested(msg)

        expect(commands.test.action.calledOnceWithExactly(msg, 'arg1', 'arg2', 'arg3')).to.be.ok
    })

    it('call command with long argument', () => {
        const msg = {
            author: { bot: false },
            content: 'e!test long argument with spaces',
            guild: { id: 'id' }
        }
        commands.test.arguments = 1
        tested(msg)

        expect(commands.test.action.calledOnceWithExactly(msg, 'long argument with spaces')).to.be.ok
    })

    it('do not call command if author is bot', () => {
        const msg = {
            author: { bot: true }
        }
        tested(msg)

        expect(commands.test.action.called).to.be.not.ok
    })

    it('do not call command if content is empty', () => {
        const msg = {
            author: { bot: false },
            content: ''
        }
        tested(msg)

        expect(commands.test.action.called).to.be.not.ok
    })

    it('do not call command without prefix', () => {
        const msg = {
            author: { bot: false },
            content: 'random message',
            guild: { id: 'id' }
        }
        tested(msg)

        expect(commands.test.action.called).to.be.not.ok
    })

    it('do not call not stable command with old prefix', () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        guild.prefix = 'n!'
        tested(msg)

        expect(commands.test.action.called).to.be.not.ok
    })

    it('show message if command not found', () => {
        const msg = {
            author: { bot: false },
            content: 'e!blabla',
            guild: { id: 'id' }
        }
        tested(msg)

        expect(guild.t.calledWith('commandNotFound', { name: 'blabla' })).to.be.ok
        expect(guild.t.calledWith('commandNotFoundDescription')).to.be.ok
    })

    it('do not call dev command if env is not dev', () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        commands.test.dev = true
        tested(msg)

        expect(commands.test.action.called).to.be.not.ok
    })

    it('show detailed message about error if env is dev', () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        config.dev = true
        commands.test.action = sinon.fake.throws(new Error('Test Error'))
        tested(msg)

        expect(commands.test.action.called).to.be.ok
        expect(send.calledOnce).to.be.ok
        expect(guild.t.calledWith('internalErrorMessage')).to.be.ok
    })

    it('show short message about error if env is prod', () => {
        const msg = {
            author: { bot: false },
            content: 'e!test',
            guild: { id: 'id' }
        }
        commands.test.action = sinon.fake.throws(new Error('Test Error'))
        tested(msg)

        expect(commands.test.action.called).to.be.ok
        expect(send.calledOnce).to.be.ok
        expect(guild.t.calledWith('internalErrorDescription')).to.be.ok
    })

})