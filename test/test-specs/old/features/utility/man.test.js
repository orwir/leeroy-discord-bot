const shared = require('../../shared')
const rewire = shared.rewire
const expect = shared.expect


describe('man', () => {

    // tested
    const tested = rewire('../../src/features/utility/man')
    const global = tested.__get__('global')
    const feature = global.features.man
    const man = feature.action

    beforeEach(() => {
        shared.mock(global)
        global.features.man = feature
    })

    it('show manual for command if command exists', () => {
        const config = global.obtainServerConfig()

        man(shared.msg(), 'man')

        expect(config.t.calledWith(feature.description)).to.ok
    })

    it('show manual for command if alias exists', () => {
        const config = global.obtainServerConfig()
        config.aliases['man-test-alias'] = 'man'

        man(shared.msg(), 'man-test-alias')

        expect(config.t.calledWith(feature.description)).to.ok
    })

    it('show commands list if command is not specified', () => {
        const msg = shared.msg()

        man(msg)

        expect(msg.channel.send.calledOnce).to.ok
        const embed = msg.channel.send.lastCall.args[1].embed
        expect(embed).to.ok
        expect(embed.fields).to.ok
        expect(embed.fields.length).to.greaterThan(0)
    })

    it('show error message if command not found', () => {
        const config = global.obtainServerConfig()

        man(shared.msg(), 'unknown-command')

        expect(config.t.calledWith('global.command_not_found_title')).to.ok
        expect(config.t.calledWith('global.command_not_found_description')).to.ok
    })

    it('skip commands if they are debug and debug disabled on server', () => {
        const msg = shared.msg()
        feature.debug = true

        man(msg)

        expect(msg.channel.send.calledOnce).to.ok
        const args = msg.channel.send.lastCall.args[1]
        expect(args.embed.fields).to.empty
    })

})