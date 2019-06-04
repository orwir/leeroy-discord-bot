const shared = require('../../shared')
const rewire = shared.rewire
const expect = shared.expect

describe('language', () => {

    // tested
    const tested = rewire('../../src/features/utility/language')
    const common = tested.__get__('common')
    const language = common.features.language.action
    common.init()

    beforeEach(() => {
        shared.mock(common)
    })

    it('change language if supported', () => {
        const msg = shared.msg()
        const config = common.obtainServerConfig()

        language(msg, 'ru')

        expect(config.language).to.equals('ru')
        expect(config.t.language).to.equals(common.i18n.getFixedT('ru').language)
        expect(msg.channel.send.calledOnce).to.ok
        expect(common.saveServerConfig.calledOnce).to.ok
    })

    it('show supported languages list', () => {
        const msg = shared.msg()

        language(msg)
        
        expect(msg.channel.send.calledOnce).to.ok
        const description = msg.channel.send.lastCall.args[1].embed.description
        expect(description).to.equals(Object.keys(common.config.languages).join(', '))
    })

    it('show an error if language is already the same', () => {
        const msg = shared.msg()
        const config = common.obtainServerConfig()

        language(msg, 'en')

        expect(msg.channel.send.calledOnce).to.ok
        expect(config.t.calledWith('language.error')).to.ok
        expect(config.t.calledWith('language.language_is_same')).to.ok
    })

    it('show an error if language not supported', () => {
        const msg = shared.msg()
        const config = common.obtainServerConfig()

        language(msg, 'bla-bla')

        expect(msg.channel.send.calledOnce).to.ok
        expect(config.t.calledWith('language.error')).to.ok
        expect(config.t.calledWith('language.language_not_supported', { language: 'bla-bla' })).to.ok
    })

})