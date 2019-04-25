const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

describe('language', () => {

    // tested
    const tested = rewire('../../src/commands/utility/language')
    const commands = tested.__get__('commands')
    const languages = tested.__get__('languages')
    const language = commands.language.action
    const msg = { guild: {id: 'id' } }
    const guilds = {
        'id': {
            language: 'en',
            t: sinon.fake(),
            aliases: {}
        }
    }
    tested.__set__('guilds', guilds)
    const send = sinon.fake()
    tested.__set__('send', send)
    const i18n = tested.__get__('i18n')

    beforeEach(() => {
        guilds['id'].t = sinon.fake()
        guilds['id'].language = 'en'
    })

    it('should show supported languages list', () => {
        language(msg)
        
        const description = send.lastCall.args[0].embed.description
        expect(description).to.be.equals(Object.keys(languages).join(', '))
    })

    it('should change language if language is supported', () => {
        language(msg, 'ru')

        expect(guilds['id'].language).to.be.equals('ru')
        expect(guilds['id'].t.language).to.be.equals(i18n.getFixedT('ru').language)
    })

    it('should show an error if language is already the same', () => {
        language(msg, 'en')
        expect(guilds['id'].t.calledWith('language.errorTitle')).to.be.ok
        expect(guilds['id'].t.calledWith('language.errorLanguageSame')).to.be.ok
    })

    it('should show an error if language is not supported', () => {
        language(msg, 'bla-bla')
        expect(guilds['id'].t.calledWith('language.errorTitle')).to.be.ok
        expect(guilds['id'].t.calledWith('language.errorLanguageNotSupported', { language: 'bla-bla' })).to.be.ok
    })

})