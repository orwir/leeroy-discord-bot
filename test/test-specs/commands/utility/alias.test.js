const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

describe('Alias', () => {

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
    tested.__set__('guilds', guilds)
    const send = sinon.fake()
    tested.__set__('send', send)

    beforeEach(() => {
        guilds['id'].aliases = {}
    })

    it('should call "man" if command not passed', () => {
        const man = {
            action: sinon.fake()
        }
        commands.man = man
        alias(msg, null, 'alias')
        
        expect(man.action.calledWithExactly(msg, 'alias')).to.be.ok
    })

    it('should add alias to command', () => {
        alias(msg, 'alias', 'one')
        alias(msg, 'alias', 'two')
        
        expect(guilds['id'].aliases['one']).to.be.ok
        expect(guilds['id'].aliases['two']).to.be.ok
    })

    it('should remove alias from command', () => {
        alias(msg, 'alias', 'one')
        alias(msg, 'alias', 'one')
        
        expect(guilds['id'].aliases['one']).to.be.undefined
    })

    it('should show list of aliases if only command passed', async () => {
        alias(msg, 'alias', 'one')
        alias(msg, 'alias', 'two')
        alias(msg, 'alias')
        await send

        const description = send.lastCall.args[0].embed.description
        expect(description).to.be.equals('one\ntwo')
    })

})