const common = require('../../common')
const rewire = common.rewire
const sinon = common.sinon
const expect = common.expect

// tested
const tested = rewire('../../src/commands/access/allow')

const commands = tested.__get__('commands')
const allow = commands.allow.action
const test = commands.allow.test
const msg = { guild: {id: 'id' } }
const guilds = {
    'id': {
        t: sinon.fake(),
        restrictions: {}
    }
}
const guild = guilds['id']
const send = sinon.fake()
const man = sinon.fake()

tested.__set__('guilds', guilds)
tested.__set__('send', send)
tested.__set__('man', man)

describe('allow', () => {

    beforeEach(() => {
        guild.restrictions = {}
        guild.t.resetHistory()
        send.resetHistory()
        man.resetHistory()
    })

    describe('#action() - general', () => {

        it.skip('show all restrictions if nothing passed and restrictions exists', () => {
            allow(msg)

            expect(guild.t.calledWith('allow.allTitle')).to.ok
        })

        it.skip('show that restrictions not found if they are not added', () => {
        })

        it.skip('show restrictions for concrete command if only it passed', () => {
            allow(msg, 'allow')
        })

        it.skip('show that command does not have any restrictions if they are not added', () => {
            
        })

        it.skip('show man if user/group is not passed', () => {
            allow(msg, 'command', 'channel')

            expect(man.calledWithExactly(msg, 'allow')).to.ok
        })

        it('add user to restriction rules', () => {
            guild.restrictions = {}

            allow(msg, 'command1', 'channel1', 'someone')

            expect(guild.restrictions).to.eql({ command1: { channel1: ['someone'] } })
        })

        it('remove user from restriction rules', () => {
            guild.restrictions = { command1: { channel1: ['someone'] } }

            allow(msg, 'command1', 'channel1', 'someone')

            expect(guild.restrictions).to.eql({})
        })

    })

    describe('#action() - update restrictions', () => {

        it('all all all -> clear restrictions', () => {
            guild.restrictions = {
                all: { all: ['user1'] },
                command1: {
                    channel1: ['user2'],
                    channel2: ['user3']
                },
                command2: { all: ['user4'] }
            }

            allow(msg, 'all', 'all', 'all')

            expect(guild.restrictions).to.eql({})
        })

        it('all all @someone -> allow someone to use everything and clear specific rules for user', () => {
            guild.restrictions = {
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            }

            allow(msg, 'all', 'all', 'user2')

            expect(guild.restrictions).to.eql({
                all: {
                    all: ['user1', 'user2']
                },
                command3: {
                    channel1: ['user1']
                }
            })
        })

        it('all #channel all -> remove restriction for #channel', () => {
            guild.restrictions = {
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            }

            allow(msg, 'all', 'channel1', 'all')

            expect(guild.restrictions).to.eql({
                command3: { channel2: ['user2'] }
            })
        })

        it('all #channel @someone -> add restriction for @someone to all commands for #channel and remove from others for #channel', () => {
            guild.restrictions = {
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            }

            allow(msg, 'all', 'channel1', 'user2')

            expect(guild.restrictions).to.eql({
                all: {
                    all: ['user1'],
                    channel1: ['user2']
                },
                command3: {
                    channel1: ['user1'],
                    channel2: ['user2']
                }
            })
        })

        it('command all all -> remove command from restrictions', () => {
            guild.restrictions = {
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            }

            allow(msg, 'command3', 'all', 'all')

            expect(guild.restrictions).to.eql({
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] }
            })
        })

        it.skip('command all @someone -> add @someone to #all for command', () => {
            guild.restrictions = {
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            }

            allow(msg, 'command2', 'all', 'user1')

            expect(guild.restrictions).to.eql({
                command1: { all: ['user2'] },
                command2: {
                    all: ['user1'],
                    channel1: ['user2']
                },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            })
        })

        it.skip('command all @someone -> do not add @someone to #all for command if he has more general rule', () => {
            guild.restrictions = {
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            }

            allow(msg, 'command2', 'all', 'user1')

            expect(guild.restrictions).to.eql({
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            })
        })

        it('command #channel all -> remove restrictions from command in #channel', () => {
            guild.restrictions = {
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            }

            allow(msg, 'command3', 'channel1', 'all')

            expect(guild.restrictions).to.eql({
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: { channel2: ['user2'] }
            })
        })

        it('command #channel @someone -> add @someone to restriction for command in #channel', () => {
            guild.restrictions = {
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            }

            allow(msg, 'command3', 'channel2', 'user5')

            expect(guild.restrictions).to.eql({
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2', 'user5']
                }
            })
        })

        it('revoke all restrictions for concrete user', () => {
            guild.restrictions = {
                all: { all: ['user1'] },
                command1: { all: ['user2'] },
                command2: { channel1: ['user2'] },
                command3: {
                    channel1: ['user1', 'user2'],
                    channel2: ['user2']
                }
            }

            allow(msg, 'all', 'all', 'user2')
            allow(msg, 'all', 'all', 'user2')

            expect(guild.restrictions).to.eql({
                all: { all: ['user1'] },
                command3: {
                    channel1: ['user1']
                }
            })
        })

    })

    describe('#test()', () => {

        it('grant access if @someone is allowed to use command in #channel', () => {
            allow(msg, 'command1', 'channel1', 'user1')

            expect(test(guild, 'command1', 'channel1', 'user1')).to.be.true
        })

        it('grant access if anyone able to use command in #channel', () => {
            allow(msg, 'command1', 'channel2', 'user2')

            expect(test(guild, 'command1', 'channel1', 'user1')).to.be.true
        })

        it('grant access if anyone able to use any command in #channel', () => {
            allow(msg, 'all', 'command1', 'channel2', 'user2')

            expect(test(guild, 'command1', 'channel1', 'user1'))
        })

        it.skip('grant access if @someone has allowed @role', () => {

        })

        it.skip('grant access if @someone is admin', () => {

        })

        it('deny access if @someone is not allowed to use command in the #channel', () => {
            allow(msg, 'command1', 'channel1', 'user2')

            expect(test(guild, 'command1', 'channel1', 'user1')).to.be.false
        })

        it('deny access if command allowed only for specific users for all channels', () => {
            allow(msg, 'command1', 'all', 'user2')

            expect(test(guild, 'command1', 'channel1', 'user1')).to.be.false
        })

        it('deny access if all commands allowed only for specific users in #channel', () => {
            allow(msg, 'all', 'channel1', 'user2')

            expect(test(guild, 'command1', 'channel1', 'user1')).to.be.false
        })

        it('deny access if all commands allowed only for specific users anywhere', () => {
            allow(msg, 'all', 'all', 'user2')

            expect(test(guild, 'command1', 'channel1', 'user1')).to.be.false
        })

    })

})