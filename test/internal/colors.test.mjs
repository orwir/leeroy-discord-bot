import chai from 'chai'
import tested from '../../src/internal/colors.mjs'

const expect = chai.expect

describe('Colors Test Suite', () => {

    it('base colors are present', () => {
        expect(tested).to.include.all.keys('highlightDefault', 'highlightSuccess', 'highlightError')
    })

    it('all colors are numbers', () => {
        Object.entries(tested).forEach(([key, value]) => expect(value, `color '${key}'`).to.be.a('number'))
    })

})