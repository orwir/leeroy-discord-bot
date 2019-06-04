const shared = require('../../shared')
const rewire = shared.rewire
const expect = shared.expect

describe('debug', () => {

    // tested
    const tested = rewire('../../src/features/utility/debug')
    const common = tested.__get__('common')
    const debug = common.features.debug.action
    const log = common.features.debug.log

    beforeEach(() => {
        shared.mock(common)
    })

    describe('#action()', ()  => {
        
        it('enable debug', () => {
            const config = common.obtainServerConfig()
            config.debug = 0

            debug(shared.msg(), 1)

            expect(config.debug).to.equals(1)
        })

        it('disable debug', () => {
            const config = common.obtainServerConfig()
            config.debug = 1

            debug(shared.msg(), 0)

            expect(config.debug).to.equals(0)
        })

        it('show current status if argument not passed', () => {
            const config = common.obtainServerConfig()

            debug(shared.msg())

            expect(config.t.calledWith('debug.status'))
        })

        it('show current status if argument is not [0, 1]', () => {
            const config = common.obtainServerConfig()
            expect(config.debug).to.equals(0)

            debug(shared.msg(), 42)

            expect(config.debug).to.equals(0)
            expect(config.t.calledWith('debug.status'))
        })

    })

    describe('#log()', () => {

        it('show developers in the log message', () => {
            const msg = shared.msg()
            const config = common.obtainServerConfig()
            config.developers = ['user1', 'user2']
            config.debug = 1

            log(msg, new Error('test error'))

            const args = config.t.getCalls()[0].args
            expect(args[0]).to.eql('debug.call_developers')
            expect(args[1]).to.eql({ author: msg.author, developers: 'user1\nuser2' })
        })

        it('do not show developers if no one is set', () => {
            const msg = shared.msg()
            const config = common.obtainServerConfig()
            config.debug = 1

            log(msg, new Error('test error'))

            const args = config.t.getCalls()[0].args
            expect(args[0]).to.eql('debug.call_developers')
            expect(args[1]).to.eql({ author: msg.author, developers: '' })
        })

        it('show detailed message if debug is enabled', () => {
            const msg = shared.msg()
            const config = common.obtainServerConfig()
            config.debug = 1
            const error = new Error('test error')

            log(msg, error)

            const args = msg.channel.send.lastCall.args[1]
            expect(args.embed.description).to.equals(error.stack)
        })

        it('show short message if debug is disabled', ()  => {
            const msg = shared.msg()
            const error = new Error('test error')

            log(msg, error)

            const args = msg.channel.send.lastCall.args
            expect(args[0]).to.empty
            expect(args[1].embed.description).to.not.equals(error.stack)
        })

    })

})