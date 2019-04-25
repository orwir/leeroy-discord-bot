const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

describe('debug', () => {

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
    tested.__set__('guilds', guilds)
    const send = sinon.fake()
    tested.__set__('send', send)

    beforeEach(() => {
        guilds['id'].developers = []
    })

    it('should add developer to list', () => {
        debug(msg, 'user')

        expect(guilds['id'].developers.length).to.be.equals(1)
        expect(guilds['id'].developers[0]).to.be.equals('user')
    })

    it('should remove developer from list', () => {
        debug(msg, 'user')
        debug(msg, 'user')
        expect(guilds['id'].developers.length).to.be.equals(0)
    })

    it('shoud show list of developers if user is not passed and developers added', () => {
        debug(msg, 'user1')
        debug(msg, 'user2')
        debug(msg)

        const description = send.lastCall.args[0].embed.description
        expect(description).to.be.equals('user1\nuser2')
    })

    it('should show "developers not set" if user is not passed and developers list is empty', () => {
        debug(msg)

        expect(guilds['id'].t.calledWith('debug.listDescriptionEmpty')).to.be.ok
    })

})