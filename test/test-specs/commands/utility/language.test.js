const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

// tested
const tested = rewire('../../src/commands/utility/language')

const commands = tested.__get__('commands')
const languages = tested.__get__('languages')
const i18n = tested.__get__('i18n')
const language = commands.language.action
const msg = { guild: {id: 'id' } }
const guilds = {
    'id': {
        language: 'en',
        t: sinon.fake(),
        aliases: {}
    }
}
const guild = guilds['id']
const send = sinon.fake()

tested.__set__('guilds', guilds)
tested.__set__('send', send)


describe('language', () => {

    beforeEach(() => {
        guild.t = sinon.fake()
        guild.language = 'en'
    })

    it('should show supported languages list', () => {
        language(msg)
        
        const description = send.lastCall.args[0].embed.description
        expect(description).to.be.equals(Object.keys(languages).join(', '))
    })

    it('should change language if language is supported', () => {
        language(msg, 'ru')

        expect(guild.language).to.be.equals('ru')
        expect(guild.t.language).to.be.equals(i18n.getFixedT('ru').language)
    })

    it('should show an error if language is already the same', () => {
        language(msg, 'en')
        expect(guild.t.calledWith('language.errorTitle')).to.be.ok
        expect(guild.t.calledWith('language.errorLanguageSame')).to.be.ok
    })

    it('should show an error if language is not supported', () => {
        language(msg, 'bla-bla')
        expect(guild.t.calledWith('language.errorTitle')).to.be.ok
        expect(guild.t.calledWith('language.errorLanguageNotSupported', { language: 'bla-bla' })).to.be.ok
    })

})