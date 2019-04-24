require('./config')
const sinon = require('sinon')
const common = require('../src/common')

describe('common', () => {

    afterEach(() => {
        sinon.restore()
    })

    describe('#send()', () => {
        
        it('given destination not set when invoke send then throw Error', async () => {
            await common.send({}).should.eventually.be.rejected
        })

        it('given channel, message and embed when invoke send then return promise', async () => {
            const channel = {
                send: sinon.fake.resolves(1)
            }
            await common.send({ channel: channel }).should.eventually.be.fulfilled
        })

    })

})