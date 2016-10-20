
import chai from 'chai';

const expect = chai.expect;

export function getJSON(value, separator) {
  return JSON.stringify(value, null, separator);
}

export function verifySchemaOutput(schema, expected) {
  expect(schema.generate()).to.be.eql(getJSON(expected));
  expect(schema.generate({ obj: true })).to.be.eql(expected);
}
