const test = require('ava');
const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('app');
  require('../../generators/app/index');
});

test.beforeEach(() => {
  context.mergeJson['package.json'] = {};
  context.config = {
    set: () => {}
  };
});

test('Call this.config.set twice', () => {
  context.config = {
    set: () => {}
  };
  const spy = chai.spy.on(context.config, 'set');
  TestUtils.call(context, 'configuring');
  expect(spy).to.have.been.called.twice();
  expect(spy).to.have.been.called.with('version');
  expect(spy).to.have.been.called.with('props');
});

test(`Add angular deps to package.json dependencies`, t => {
  context.props = {js: 'babel'};
  TestUtils.call(context, 'configuring');
  t.is(context.mergeJson['package.json'].dependencies.angular, '^1.5.0');
  t.is(context.mergeJson['package.json'].devDependencies['angular-mocks'], '^1.5.0');
  t.is(context.mergeJson['package.json'].devDependencies['gulp-angular-templatecache'], '^1.8.0');
});

test(`Add 'angular-ui-router' to package.json dependencies`, t => {
  context.props = {router: 'uirouter'};
  TestUtils.call(context, 'configuring');
  t.is(context.mergeJson['package.json'].dependencies['angular-ui-router'], '1.0.0-beta.1');
});

test(`Not add any router to package.json dependencies`, t => {
  context.props = {router: 'none'};
  TestUtils.call(context, 'configuring');
  t.is(context.mergeJson['package.json'].dependencies['angular-ui-router'], undefined);
});
