const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

// tested
const tested = rewire('../../src/commands/utility/debug')

const commands = tested.__get__('commands')
const debug = commands.debug.action
const log = commands.debug.log
const msg = { guild: {id: 'id', author: 'author' } }
const error = { stack: 'error' }
const guilds = {
    'id': {
        t: sinon.fake(),
        debug: 1,
        developers: []
    }
}
const guild = guilds['id']
const send = sinon.fake()
const save = sinon.fake()

tested.__set__('guilds', guilds)
tested.__set__('send', send)
tested.__set__('save', save)

describe('debug', () => {

    beforeEach(() => {
        guild.debug = 1
        guild.developers = []
        guild.t.resetHistory()
        send.resetHistory()
        save.resetHistory()
    })

    describe('#action()', ()  => {
        
        it('enable debug', () => {
            guild.debug = 0
            debug(msg, 1)

            expect(guild.debug).to.equals(1)
        })

        it('disable debug', () => {
            guild.debug = 1
            debug(msg, 0)

            expect(guild.debug).to.equals(0)
        })

        it('show current status if argument not passed', () => {
            debug(msg)

            expect(guild.debug).to.equals(1)
            expect(guild.t.calledWith('debug.status'))
        })

        it('show current status if argument is not [0, 1]', () => {
            debug(msg, 42)

            expect(guild.debug).to.equals(1)
            expect(guild.t.calledWith('debug.status'))
        })

    })

    describe('#log()', () => {

        it('show developers in the log message', () => {
            guild.developers = ['user1', 'user2']

            log(msg, error)
            const args = guild.t.getCalls()[0].args
            expect(args[0]).to.eql('debug.call_developers')
            expect(args[1]).to.eql({ author: msg.author, developers: 'user1\nuser2' })
        })

        it('do not show developers if no one is set', () => {
            log(msg, error)

            const args = guild.t.getCalls()[0].args
            expect(args[0]).to.eql('debug.call_developers')
            expect(args[1]).to.eql({ author: msg.author, developers: '' })
        })

        it('show detailed message if debug is enabled', () => {
            log(msg, error)

            const args = send.lastCall.args[0]
            expect(args.embed.description).to.equals(error.stack)
        })

        it('show short message if debug is disabled', ()  => {
            guild.debug = 0
            log(msg, error)

            const args = send.lastCall.args[0]
            expect(args.text).to.empty
            expect(args.embed.description).to.not.equals(error.stack)
        })

    })

})