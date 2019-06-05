const shared = require('./shared')
const sinon = shared.sinon
const expect = shared.expect

// tested
const tested = require('../../src/common')

describe('Common Test Suite', () => {

    describe('#config', () => {

        it('have to be filled', () => {
            expect(tested.config.token, 'auth token is not set').to.ok
            expect(tested.config.prefix, 'prefix is not set').to.ok
        })

    })

    describe('#path(path) - safe access to nested values', () => {

        const tested = {
            node1: {
                node2: [4, 5, 6]
            },
            node5: [1]
        }

        it('return "array" from path "node1.node2"', () => {
            expect(tested.path('node1.node2')).to.have.members([4, 5, 6])
        })

        it('return undefined from path "node2.node3"', () => {
            expect(tested.path('node2.node3')).to.undefined
        })

        it('return "5" from path "node1.node2[1]"', () => {
            expect(tested.path('node1.node2[1]')).to.equals(5)
        })

        it('return "6" from path "node1.{node3|node2}[2]"', () => {
            expect(tested.path('node1.{node3|node2}[2]')).to.equals(6)
        })

        it('return "42" from path "node6.node7" and default value 42', () => {
            expect(tested.path('node6.node7', 42)).to.equals(42)
        })

        it('return "1" from path "node5[0]', () => {
            expect(tested.path('node5[0]')).to.equals(1)
        })

    })

})