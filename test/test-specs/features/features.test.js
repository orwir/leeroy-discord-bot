const shared = require('../shared')
const expect = shared.expect

// tested
const tested = require('../../../src/global').features
require('../../../src/features')

describe('Features Test Suite', () => {
    describe('features integrity', () => {
        it('contains required fields', () => {
            Object.entries(tested)
                .forEach(([key, feature]) => {
                    expect(key).eq(feature.name)
                    expect(feature.name, `${key}: name is not defined`).to.ok
                    expect(feature.group, `${key}: group is not defined`).to.ok
                    expect(feature.description, `${key}: description is not defined`).to.ok
                    expect(feature.usage, `${key}: usage is not defined`).to.ok
                    expect(feature.examples, `${key}: examples is not defined`).to.ok
                    expect(feature.action, `${key}: name is not defined`).to.ok
                })
        })
    })
    require('./access')
    require('./fun')
    require('./utility')
})