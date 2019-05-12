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
const msg = {
    author: { bot: false },
    guild: { id: 'id', member: sinon.fake() }
}
const send = sinon.fake()
const config = {
    prefix: 'e!'
}
const log = sinon.fake()

tested.__set__('guilds', guilds)
tested.__set__('send', send)
tested.__set__('config', config)
tested.__set__('commands', commands)
tested.__set__('configure', sinon.fake())
tested.__set__('developers', [])
tested.__set__('restricted', sinon.fake.returns(false))
tested.__set__('log', log)


describe('message', () => {

    beforeEach(() => {
        msg.content = ''
        msg.author.bot = false
        guild.debug = 0
        guild.t.resetHistory()
        guild.prefix = config.prefix
        send.resetHistory()
        commands.test.action = sinon.fake()
        commands.test.stable = false
        commands.test.debug = false
        commands.test.arguments = null
        tested.__set__('restricted', sinon.fake.returns(false))
    })

    it('call command', async () => {
        msg.content = 'e!test'
        await tested(msg)

        expect(commands.test.action.calledOnce).to.ok
    })

    it('call command with old prefix if command is stable', async () => {
        msg.content = 'e!test'
        guild.prefix = 'n!'
        commands.test.stable = true
        await tested(msg)

        expect(commands.test.action.calledOnce).to.ok
    })

    it('call command by alias', async () => {
        msg.content =  'e!alias'
        await tested(msg)

        expect(commands.test.action.calledOnce).to.ok
    })

    it('call command with arguments', async () => {
        msg.content = 'e!test arg1 arg2 arg3'
        await tested(msg)

        expect(commands.test.action.calledOnceWithExactly(msg, 'arg1', 'arg2', 'arg3')).to.be.ok
    })

    it('call command with long argument', async () => {
        msg.content = 'e!test long argument with spaces'
        commands.test.arguments = 1
        await tested(msg)

        expect(commands.test.action.calledOnceWithExactly(msg, 'long argument with spaces')).to.be.ok
    })

    it('do not call command if author is bot', async () => {
        msg.author.bot = true
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('do not call command if content is empty', async () => {
        msg.content = ''
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('do not call command without prefix', async () => {
        msg.content = 'random message'
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('do not call not stable command with old prefix', async () => {
        msg.content = 'e!test'
        guild.prefix = 'n!'
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('do not call command if command is restricted for user', async () => {
        tested.__set__('restricted', sinon.fake.returns(true))
        msg.content = 'e!test'
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('show message if command not found', async () => {
        msg.content = 'e!blabla'
        await tested(msg)

        expect(guild.t.calledWith('global.command_not_found_title', { name: 'blabla' })).to.ok
        expect(guild.t.calledWith('global.command_not_found_description')).to.ok
    })

    it('call debug command if debug is enabled',  async () => {
        guild.debug = 1
        msg.content = 'e!test'
        commands.test.debug = true
        await tested(msg)

        expect(commands.test.action.called).to.ok
    })

    it('do not call debug command if debug is disabled', async () => {
        msg.content = 'e!test'
        commands.test.debug = true
        await tested(msg)

        expect(commands.test.action.called).to.not.ok
    })

    it('show error message if action throws exception', async () => {
        msg.content = 'e!test'
        commands.test.action = sinon.fake.throws(new Error('Test Error'))
        await tested(msg)

        expect(commands.test.action.called).to.ok
        expect(log.calledOnce).to.be.ok
    })

})