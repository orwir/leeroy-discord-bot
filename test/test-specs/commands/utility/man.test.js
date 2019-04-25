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
    'id': {
        t: t,
        aliases: { 'man-test-alias': commands.man }
    }
}
const send = sinon.fake()

tested.__set__('guilds', guilds)
tested.__set__('send', send)


describe('man', () => {

    beforeEach(() => {
        t.resetHistory()
        send.resetHistory()
    })

    it('should show manual for command if command exists', () => {
        man(msg, 'man')

        expect(t.calledWith(commands.man.description)).to.be.ok
    })

    it('should show manual for command if alias exists', () => {
        man(msg, 'man-test-alias')

        expect(t.calledWith(commands.man.description)).to.be.ok
    })

    it('should show commands list if command is not specified', () => {
        man(msg)

        expect(send.calledOnce).to.be.ok
        const args = send.lastCall.args[0]
        expect(args.embed).to.be.ok
        expect(args.embed.fields).to.be.ok
        expect(args.embed.fields.length).to.be.greaterThan(0)
    })

    it('should show error message if command not found', () => {
        man(msg, 'unknown-command')

        expect(t.calledWith('commandNotFound')).to.be.ok
        expect(t.calledWith('commandNotFoundDescription')).to.be.ok
    })

})