const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

// tested
const tested = rewire('../../src/commands/utility/developer')

const commands = tested.__get__('commands')
const developer = commands.developer.action
const msg = { guild: {id: 'id' } }
const guilds = {
    'id': {
        t: sinon.fake(),
        developers: []
    }
}
const guild = guilds['id']
const send = sinon.fake()
const save = sinon.fake()

tested.__set__('guilds', guilds)
tested.__set__('send', send)
tested.__set__('save', save)


describe('developer', () => {

    beforeEach(() => {
        guild.developers = []
        send.resetHistory()
        save.resetHistory()
    })

    it('add developer to list', () => {
        developer(msg, 'user')

        expect(guild.developers.length).to.equals(1)
        expect(guild.developers[0]).to.equals('user')
        expect(send.calledOnce).to.ok
        expect(save.calledOnce).to.ok
    })

    it('remove developer from list', () => {
        developer(msg, 'user')
        developer(msg, 'user')

        expect(guild.developers.length).to.equals(0)
        expect(send.calledTwice).to.ok
        expect(save.calledTwice).to.ok
    })

    it('show list of developers if user is not passed and developers list not empty', () => {
        developer(msg, 'user1')
        developer(msg, 'user2')
        developer(msg)

        expect(send.calledThrice).to.ok
        const description = send.lastCall.args[0].embed.description
        expect(description).to.equals('user1\nuser2')
    })

    it('show "empty" if user is not passed and developers list empty', () => {
        developer(msg)

        expect(send.calledOnce).to.ok
        expect(guild.t.calledWith('developer.empty')).to.ok
    })

})