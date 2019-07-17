import chai from 'chai'
import * as tested from '../../src/internal/config.mjs'

const expect = chai.expect

describe('Config Test Suite', () => {

    it('token is present', () => {
        expect(tested.token).to.be.a('string')
    })

    it('prefix is present', () => {
        expect(tested.prefix).to.be.a('string')
    })

    it('languages at least have "en"', () => {
        expect(tested.languages).to.include.keys('en')
    })

    it('version is present', () => {
        expect(tested.version).to.be.a('string')
    })

})