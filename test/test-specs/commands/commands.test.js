const common = require('../common')
const sinon = common.sinon
const expect = common.expect

// tested
const tested = require('../../../src/common').commands

describe('Commands Test Suite', () => {

    describe('commands integrity', () => {

        it('should contains required fields', () => {
            Object.keys(tested)
                .forEach(name => {
                    const command = tested[name]
                    
                    expect(command.name, 'name is not defined').to.be.ok
                    expect(command.group, 'group is not defined').to.be.ok
                    expect(command.description, 'description is not defined').to.be.ok
                    expect(command.usage, 'usage is not defined').to.be.ok
                    expect(command.examples, 'examples is not defined').to.be.ok
                    expect(command.action, 'action is not defined').to.be.ok
                })
        })

    })

    require('./fun')

    require('./utility')

})