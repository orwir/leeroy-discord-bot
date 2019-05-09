const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

// tested
const tested = rewire('../../src/commands/utility/prefix')

const commands = tested.__get__('commands')
const prefix = commands.prefix.action
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

describe('prefix', () => {

    beforeEach(() => {
        send.resetHistory()
        man.resetHistory()
        guild.t.resetHistory()
    })

    it('change prefix', () => {
        prefix(msg, 'test')

        expect(guild.prefix).to.be.equals('test')
        expect(send.calledOnce).to.be.ok
    })

    it('show man if prefix not passed', () => {
        prefix(msg)

        expect(man.calledWithExactly(msg, 'prefix')).to.be.ok
    })

})