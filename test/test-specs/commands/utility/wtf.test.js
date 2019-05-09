const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

// tested
const tested = rewire('../../src/commands/utility/wtf')

const commands = tested.__get__('commands')
const wtf = commands.wtf.action
const msg = { guild: {id: 'id' } }
const guilds = {
    'id': {
        t: sinon.fake(),
        aliases: {}
    }
}
const send = sinon.fake()

tested.__set__('guilds', guilds)
tested.__set__('send', send)

describe('wtf', () => {

    it('show information', () => {
        wtf(msg)

        expect(send.calledOnce).to.be.ok
    })

})