import chai from 'chai'
import * as tested from '../../src/internal/config'

const expect = chai.expect

describe('Config Test Suite', () => {

    it('token is present', () => {
        expect(tested.TOKEN).to.be.a('string')
    })

    it('prefix is present', () => {
        expect(tested.PREFIX).to.be.a('string')
    })

    it('languages at least have "en"', () => {
        expect(tested.LANGUAGES).to.include.keys('en')
    })

    it('version is present', () => {
        expect(tested.VERSION).to.be.a('string')
    })

})