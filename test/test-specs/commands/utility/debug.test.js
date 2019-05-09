const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

// tested
const tested = rewire('../../src/commands/utility/debug')

const commands = tested.__get__('commands')
const debug = commands.debug.action
const msg = { guild: {id: 'id' } }
const guilds = {
    'id': {
        t: sinon.fake(),
        aliases: {}
    }
}
const guild = guilds['id']
const send = sinon.fake()

tested.__set__('guilds', guilds)
tested.__set__('send', send)


describe('debug', () => {

    beforeEach(() => {
        guild.developers = []
        guild.t.resetHistory()
        send.resetHistory()
    })

    it('add developer to list', () => {
        debug(msg, 'user')

        expect(guild.developers.length).to.be.equals(1)
        expect(guild.developers[0]).to.be.equals('user')
        expect(send.calledOnce).to.be.ok
    })

    it('remove developer from list', () => {
        debug(msg, 'user')
        debug(msg, 'user')

        expect(guild.developers.length).to.be.equals(0)
        expect(send.calledTwice).to.be.ok
    })

    it('show list of developers if user is not passed and developers list not empty', () => {
        debug(msg, 'user1')
        debug(msg, 'user2')
        debug(msg)

        expect(send.calledThrice).to.be.ok
        const description = send.lastCall.args[0].embed.description
        expect(description).to.be.equals('user1\nuser2')
    })

    it('show "developers not set" if user is not passed and developers list empty', () => {
        debug(msg)

        expect(send.calledOnce).to.be.ok
        expect(guild.t.calledWith('debug.listDescriptionEmpty')).to.be.ok
    })

})