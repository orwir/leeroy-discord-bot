import chai from 'chai'
import tested from '../../src/internal/groups.mjs'

const expect = chai.expect

describe('Groups Test Suite', () => {

    it('each group has name, icon and order', () => {
        Object.entries(tested).forEach(([name, group]) => {
            expect(group, `group "${name}"`).to.include.keys(['name', 'icon', 'order'])
        })
    })

    it('each group has every property initialized', () => {
        Object.entries(tested).forEach(([name, group]) => {
            Object.entries(group).forEach(([property, value]) => {
                expect(value, `group "${name}" should have "${property}"`).to.not.undefined
            })
        })
    })

})