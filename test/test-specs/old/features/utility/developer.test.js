const shared = require('../../shared')
const rewire = shared.rewire
const expect = shared.expect

describe('developer', () => {

    // tested
    const tested = rewire('../../src/features/utility/developer')
    const global = tested.__get__('global')
    const developer = global.features.developer.action

    beforeEach(() => {
        shared.mock(global)
    })

    it('add developer to list', () => {
        const msg = shared.msg()
        const config = global.obtainServerConfig()

        developer(msg, 'user')

        expect(config.developers.length).to.equals(1)
        expect(config.developers[0]).to.equals('user')
        expect(msg.channel.send.calledOnce).to.ok
        expect(global.saveServerConfig.calledOnce).to.ok
    })

    it('remove developer from list', () => {
        const msg = shared.msg()
        const config = global.obtainServerConfig()

        developer(msg, 'user')
        developer(msg, 'user')

        expect(config.developers.length).to.equals(0)
        expect(msg.channel.send.calledTwice).to.ok
        expect(global.saveServerConfig.calledTwice).to.ok
    })

    it('show list of developers if user is not passed and developers list not empty', () => {
        const msg = shared.msg()
        
        developer(msg, 'user1')
        developer(msg, 'user2')
        developer(msg)

        expect(msg.channel.send.calledThrice).to.ok
        const description = msg.channel.send.lastCall.args[1].embed.description
        expect(description).to.equals('user1\nuser2')
    })

    it('show "empty" if user is not passed and developers list empty', () => {
        const msg = shared.msg()
        const config = global.obtainServerConfig()

        developer(msg)

        expect(msg.channel.send.calledOnce).to.ok
        expect(config.t.calledWith('developer.empty')).to.ok
    })

})