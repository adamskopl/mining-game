import test from 'tape';
import what from 'src/mainTest';

test('A passing test', (assert) => {
  const expected = 'something to test';
  const actual = what();

  assert.equal(actual, expected,
               'Given two mismatched values, .equal() should produce a nice bug report');

  assert.end();
});
