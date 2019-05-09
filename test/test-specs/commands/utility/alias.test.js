const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

// tested
const tested = rewire('../../src/commands/utility/alias')

const commands = tested.__get__('commands')
const alias = commands.alias.action
const msg = { guild: {id: 'id' } }
const guilds = {
    'id': {
        t: sinon.fake(),
        aliases: {}
    }
}
const guild = guilds['id']
const send = sinon.fake()
const man = sinon.fake()

tested.__set__('guilds', guilds)
tested.__set__('send', send)
tested.__set__('man', man)


describe('alias', () => {

    beforeEach(() => {
        guilds['id'].aliases = {}
        guild.t.resetHistory()
        send.resetHistory()
        man.resetHistory()
    })

    it('call "man" if command not passed', () => {
        alias(msg, null, 'alias')
        
        expect(man.calledWithExactly(msg, 'alias')).to.be.ok
    })

    it('add alias to command', () => {
        alias(msg, 'alias', 'one')
        alias(msg, 'alias', 'two')
        
        expect(guild.aliases['one']).to.be.ok
        expect(guild.aliases['two']).to.be.ok
        expect(send.calledTwice).to.be.ok
    })

    it('remove alias from command', () => {
        alias(msg, 'alias', 'one')
        alias(msg, 'alias', 'one')
        
        expect(guild.aliases['one']).to.be.undefined
        expect(send.calledTwice).to.be.ok
    })

    it('show list of aliases if only command passed', async () => {
        alias(msg, 'alias', 'one')
        alias(msg, 'alias', 'two')
        alias(msg, 'alias')

        expect(send.calledThrice).to.be.ok
        const description = send.lastCall.args[0].embed.description
        expect(description).to.be.equals('one\ntwo')
    })

})