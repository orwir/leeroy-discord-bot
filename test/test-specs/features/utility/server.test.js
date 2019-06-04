const shared = require('../../shared')
const rewire = shared.rewire
const expect = shared.expect

describe('server', () => {

    // tested
    const tested = rewire('../../src/features/utility/server')
    const common = tested.__get__('common')
    const servers = tested.__get__('servers')
    const feature = common.features.server

    beforeEach(() => {
        shared.mock(common)
        Object.keys(servers).forEach(key => delete servers[key])
    })

    describe('#action()', () => {

    })

    describe('#obtain()', () => {
        it('return server config if it exists', () => {
            servers[1] = common.obtainServerConfig()

            expect(feature.obtain(1)).to.eql(servers[1])
        })
    })

    describe('#configure()', () => {
        it('return default config if server not found', async () => {
            common.features.wtf = {
                name: 'wtf'
            }

            const config = await feature.configure({id: 1})
            
            expect(config).to.eql({
                id: 1,
                language: 'en',
                prefix: common.config.prefix,
                debug: 0,
                aliases: {
                    help: common.features.wtf.name
                },
                developers: [],
                t: config.t
            })
        })

        it('return cached config if server config already loaded', async () => {
            servers[1] = common.obtainServerConfig()
            servers[1].modified = 42

            const config = await feature.configure({id: 1})

            expect(config.modified).to.eql(42)
        })
    })

    describe('#save()', () => {
        it('call save method on storage', async () => {
            feature.save()

            expect(common.storage.save.calledOnce).to.ok
        })
    })

    describe('#delete()', () => {
        it('call delete method on storage', async () => {
            feature.delete()

            expect(common.storage.delete.calledOnce).to.ok
        })
    })

})