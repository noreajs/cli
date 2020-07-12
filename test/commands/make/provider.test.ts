import {expect, test} from '@oclif/test'

describe('make:provider', () => {
  test
  .stdout()
  .command(['make:provider'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['make:provider', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
