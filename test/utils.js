
import chai from 'chai';
import json from 'json-stable-stringify';

const expect = chai.expect;

export function getJSON(value, separator) {
  // using json-stable-stringify to get a deterministic json output
  return json(value, {
    space: separator
  });
}

export function verifySchemaOutput(schema, expected) {
  expect(json(schema.generate({ obj: true }))).to.be.eql(getJSON(expected));
  expect(schema.generate({ obj: true })).to.be.eql(expected);
}
