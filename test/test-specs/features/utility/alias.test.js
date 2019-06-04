const shared = require('../../shared')
const rewire = shared.rewire
const expect = shared.expect

describe('alias', () => {

    // tested
    const tested = rewire('../../src/features/utility/alias')
    const common = tested.__get__('common')
    const feature = common.features.alias
    const alias = feature.action

    beforeEach(() => {
        shared.mock(common)
        common.features.alias = feature
    })

    it('call "man" if command not passed', () => {
        const msg = shared.msg()
        
        alias(msg, null, 'alias')
        
        expect(common.man.calledWithExactly(msg, 'alias')).to.ok
    })

    it('add alias to command', () => {
        const msg = shared.msg()
        const server = common.obtainServerConfig()

        alias(msg, 'alias', 'one')
        alias(msg, 'alias', 'two')
        
        expect(common.saveServerConfig.calledTwice).to.ok
        expect(msg.channel.send.calledTwice).to.ok
        expect(server.aliases['one']).to.ok
        expect(server.aliases['two']).to.ok
    })

    it('remove alias from command', () => {
        const msg = shared.msg()
        const server = common.obtainServerConfig()

        alias(msg, 'alias', 'one')
        alias(msg, 'alias', 'one')
        
        expect(server.aliases['one']).to.undefined
        expect(msg.channel.send.calledTwice).to.ok
        expect(common.saveServerConfig.calledTwice).to.ok
    })

    it('show list of aliases if only command passed', async () => {
        const msg = shared.msg()

        alias(msg, 'alias', 'one')
        alias(msg, 'alias', 'two')
        alias(msg, 'alias')

        expect(msg.channel.send.calledThrice).to.ok
        const description = msg.channel.send.lastCall.args[1].embed.description
        expect(description).to.equals('one\ntwo')
    })

    it('prevent creating alias if word is reserved', () => {
        const msg = shared.msg()
        const server = common.obtainServerConfig()

        alias(msg, 'alias', 'help')

        expect(msg.channel.send.calledOnce).to.ok
        expect(server.t.calledWith('alias.error')).to.ok
    })

})