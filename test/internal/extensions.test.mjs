import chai from 'chai'
import '../../src/internal/extensions.mjs'

const expect = chai.expect

describe('Extensions Test Suite', () => {

    describe('String', () => {

        describe('#isBlank()', () => {

            it('return true if string is empty', () => {
                expect(''.isBlank()).to.be.true
            })

            it('return true if string contains only spaces', () => {
                expect(' '.isBlank()).to.be.true
            })

            it('return false if string is not empty', () => {
                expect('some value'.isBlank()).to.be.false
            })

        })

    })

    describe('Object', () => {

        describe('#path()', () => {

            const example = {
                zero: 'value',
                first: {
                    inner: [4, 5, 6]
                },
                second: [{inner: 'value'}]
            }

            it('return value of property if present (node)', () => {
                expect(example.path('zero')).to.equal('value')
            })

            it('return value of nested property if present (node.node)', () => {
                expect(example.path('first.inner')).to.eql([4, 5, 6])
            })

            it('return undefined if property does not present', () => {
                expect(example.path('path.not.exists')).to.be.undefined
            })

            it('return value from array (node[index])', () => {
                expect(example.path('first.inner[1]')).to.equal(5)
            })

            it('return value from object property inside array (node[index].node)', () => {
                expect(example.path('second[0].inner')).to.equal('value')
            })

            it('return value from second variant if first not found ({node|node})', () => {
                expect(example.path('{null|zero}')).to.equal('value')
            })

            it('return default value if property not found', () => {
                expect(example.path('null', 42)).to.equal(42)
            })

        })

    })

})