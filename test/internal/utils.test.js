import chai from 'chai'
import { path } from '../../src/internal/utils'

const expect = chai.expect

describe('Utils Test Suite', () => {

    describe('#find()', () => {

        const example = {
            zero: 'value',
            first: {
                inner: [4, 5, 6]
            },
            second: [{inner: 'value'}]
        }

        it('return value of property if present (node)', () => {
            expect(path(example, 'zero')).to.equal('value')
        })

        it('return value of nested property if present (node.node)', () => {
            expect(path(example, 'first.inner')).to.eql([4, 5, 6])
        })

        it('return undefined if property does not present', () => {
            expect(path(example, 'path.not.exists')).to.be.undefined
        })

        it('return value from array (node[index])', () => {
            expect(path(example, 'first.inner[1]')).to.equal(5)
        })

        it('return value from object property inside array (node[index].node)', () => {
            expect(path(example, 'second[0].inner')).to.equal('value')
        })

        it('return value from second variant if first not found ({node|node})', () => {
            expect(path(example, '{null|zero}')).to.equal('value')
        })

        it('return default value if property not found', () => {
            expect(path(example, 'null', 42)).to.equal(42)
        })

    })

})