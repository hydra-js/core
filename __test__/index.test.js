const { bootstrapServer } = require('../src/index');

test('bootstrapServer - should return a function', () => {
  expect(typeof bootstrapServer).toBe('function');
});
