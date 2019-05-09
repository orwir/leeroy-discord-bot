const common = require('./common')
const sinon = common.sinon
const expect = common.expect

// tested
const tested = require('../../src/common')

describe('Common Test Suite', () => {

    beforeEach(() => {
        sinon.restore()
    })

    describe('#config', () => {

        it('have to be filled', () => {
            expect(tested.config.token, 'auth token is not set').to.be.ok
            expect(tested.config.prefix, 'prefix is not set').to.be.ok
        })

    })

    describe('#send()', () => {
        
        it('throw an exception if destination is not set', async () => {
            await expect(tested.send({})).eventually.be.rejected
        })

        it('send a message with arguments to channel and return promise', async () => {
            const send = sinon.fake.resolves(1)
            const channel = {
                send: send
            }
            const args = {
                channel: channel,
                text: 'text',
                embed: {
                    title: 'title',
                    description: 'description'
                }
            }
            await expect(tested.send(args)).eventually.be.fulfilled
            expect(send.calledOnceWithExactly(args.text, { embed: args.embed })).to.be.ok 
        })

    })

    describe('#path(path) - safe access to nested values', () => {

        const tested = {
            node1: {
                node2: [4, 5, 6]
            }
        }

        it('return "array" from path "node1.node2"', () => {
            expect(tested.path('node1.node2')).to.have.members([4, 5, 6])
        })

        it('return undefined from path "node2.node3"', () => {
            expect(tested.path('node2.node3')).to.be.undefined
        })

        it('return "5" from path "node1.node2[1]"', () => {
            expect(tested.path('node1.node2[1]')).to.be.equals(5)
        })

        it('return "6" from path "node1.{node3|node2}[2]"', () => {
            expect(tested.path('node1.{node3|node2}[2]')).to.be.equals(6)
        })

        it('return "42" from path "node6.node7" and default value 42', () => {
            expect(tested.path('node6.node7', 42)).to.be.equals(42)
        })

    })

})