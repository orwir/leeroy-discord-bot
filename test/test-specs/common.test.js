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

        it('should be filled', () => {
            expect(tested.config.token, 'auth token is not set').to.be.ok
            expect(tested.config.prefix, 'prefix is not set').to.be.ok
        })

    })

    describe('#send()', () => {
        
        it('should throw an exception if destination is not set', async () => {
            await expect(tested.send({})).eventually.be.rejected
        })

        it('should send a message with arguments to channel and return promise', async () => {
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

})