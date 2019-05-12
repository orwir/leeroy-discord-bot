const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

// tested
const tested = rewire('../../src/commands/utility/man')

const commands = tested.__get__('commands')
const man = commands.man.action
const msg = { guild: {id: 'id' } }
const t = sinon.fake()
const guilds = {
    id: {
        t: t,
        aliases: { 'man-test-alias': commands.man.name }
    }
}
const send = sinon.fake()

tested.__set__('guilds', guilds)
tested.__set__('send', send)
tested.__set__('commands', { man: commands.man })


describe('man', () => {

    beforeEach(() => {
        t.resetHistory()
        send.resetHistory()
        commands.man.debug = false
    })

    it('show manual for command if command exists', () => {
        man(msg, 'man')

        expect(t.calledWith(commands.man.description)).to.ok
    })

    it('show manual for command if alias exists', () => {
        man(msg, 'man-test-alias')

        expect(t.calledWith(commands.man.description)).to.ok
    })

    it('show commands list if command is not specified', () => {
        man(msg)

        expect(send.calledOnce).to.ok
        const args = send.lastCall.args[0]
        expect(args.embed).to.ok
        expect(args.embed.fields).to.ok
        expect(args.embed.fields.length).to.greaterThan(0)
    })

    it('show error message if command not found', () => {
        man(msg, 'unknown-command')

        expect(t.calledWith('global.command_not_found_title')).to.ok
        expect(t.calledWith('global.command_not_found_description')).to.ok
    })

    it('skip commands if they are debug and debug disabled on server', () => {
        commands.man.debug = true
        man(msg)

        expect(send.calledOnce).to.ok
        const args = send.lastCall.args[0]
        expect(args.embed.fields).to.empty
    })

})