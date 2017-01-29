
import chai from 'chai';
import sugar from '../lib/index';
import { verifySchemaOutput } from './utils';

const expect = chai.expect;

/* eslint-disable prefer-arrow-callback */
describe('mixed type', () => {
  it('should initialize without errors', () => {
    sugar.mixed();
  });

  it('instance should be inmutable', () => {
    const schema = sugar.number(),
          schema2 = schema.integer();

    expect(schema).not.to.be.equal(schema2);
  });

  it('should generate schema with empty object by default', () => {
    const schema = sugar.mixed();

    const expected = {};

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with multiple `type`', () => {
    const schema = sugar.mixed().canBe(sugar.string(), sugar.number());

    const expected = {
      type: ['string', 'number']
    };

    verifySchemaOutput(schema, expected);
  });

  it('should not include type when using `noType`', () => {
    const schema = sugar.number().multipleOf(5).noType();

    const expected = {
      multipleOf: 5
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with meta info as object (custom fields)', () => {
    const schema = sugar.number().meta({
      customField: 'value',
      anotherField: 'value'
    });

    const expected = {
      type: 'number',
      customField: 'value',
      anotherField: 'value'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with meta info (custom fields)', () => {
    const schema = sugar.number().meta('customField', 'value');

    const expected = {
      type: 'number',
      customField: 'value'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with meta info (custom fields) (using extra alias)', () => {
    const schema = sugar.string().extra('customField', 'value');

    const expected = {
      type: 'string',
      customField: 'value'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with meta info in object type (custom fields)', () => {
    const schema = sugar.object().keys({
      name: sugar.string(),
      age: sugar.number().integer().minimum(0),
      domHand: sugar.string().enum(['left', 'right', 'ambidextrous'])
    }).meta('example', { name: 2 });

    const expected = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer', minimum: 0 },
        domHand: { type: 'string', enum: ['left', 'right', 'ambidextrous'] }
      },
      example: {
        name: 2
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with meta info in object type (custom fields) (using extra alias)', () => {
    const schema = sugar.object().keys({
      name: sugar.string(),
      age: sugar.number().integer().minimum(0),
      domHand: sugar.string().enum(['left', 'right', 'ambidextrous'])
    }).meta('example', { name: 2 });

    const expected = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer', minimum: 0 },
        domHand: { type: 'string', enum: ['left', 'right', 'ambidextrous'] }
      },
      example: {
        name: 2
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with meta info in complex object type (custom fields)', () => {
    const schema = sugar.object().keys({
      name: sugar.string().meta('example', 'Bob'),
      age: sugar.number().integer().minimum(0)
          .meta('example', 42),
      domHand: sugar.string().enum(['left', 'right', 'ambidextrous']).meta('example', 'left')
    });

    const expected = {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Bob' },
        age: { type: 'integer', minimum: 0, example: 42 },
        domHand: { type: 'string', enum: ['left', 'right', 'ambidextrous'], example: 'left' }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with only `enum`', () => {
    const schema = sugar.mixed().enum([1, 2, 3]);

    const expected = {
      enum: [1, 2, 3]
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with only `definitions`', () => {
    const schema = sugar.mixed().definitions({
      address: sugar.object().keys({
        street_address: sugar.string().required(),
        city: sugar.string().required(),
        state: sugar.string().required()
      })
    });

    const expected = {
      definitions: {
        address: {
          type: 'object',
          properties: {
            street_address: {
              type: 'string'
            },
            city: {
              type: 'string'
            },
            state: {
              type: 'string'
            }
          },
          required: ['street_address', 'city', 'state']
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with only `anyOf`', () => {
    const schema = sugar.mixed().anyOf([
      sugar.string().maxLength(5),
      sugar.number().minimum(0)
    ]);

    const expected = {
      anyOf: [{
        type: 'string',
        maxLength: 5
      }, {
        type: 'number',
        minimum: 0
      }]
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with only `allOf`', () => {
    const schema = sugar.mixed().allOf([
      sugar.string(),
      sugar.string().minLength(2),
      sugar.string().maxLength(5)
    ]);

    const expected = {
      allOf: [{
        type: 'string'
      }, {
        minLength: 2
      }, {
        maxLength: 5
      }]
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with only `oneOf`', () => {
    const schema = sugar.mixed().oneOf([
      sugar.number().multipleOf(3),
      sugar.number().multipleOf(5)
    ]);

    const expected = {
      oneOf: [{
        type: 'number',
        multipleOf: 3
      }, {
        type: 'number',
        multipleOf: 5
      }]
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with only `not`', () => {
    const schema = sugar.mixed().not(sugar.string());

    const expected = {
      not: {
        type: 'string'
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with `space` option', () => {
    const schema = sugar.number();

    const expected = {
      type: 'number'
    };

    expect(schema.generate({ space: 2 })).to.be.eql(JSON.stringify(expected, null, 2));
    expect(schema.generate({ obj: true })).to.be.eql(expected);
  });

  it('should generate schema with `$schema` option', () => {
    const schema = sugar.number();

    const expected = {
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: 'number'
    };

    expect(schema.generate({ $schema: 'http://json-schema.org/draft-04/schema#' })).to.be.eql(JSON.stringify(expected));
    expect(schema.generate({ obj: true, $schema: 'http://json-schema.org/draft-04/schema#' })).to.be.eql(expected);
  });

  it('should generate schema with `id` option', () => {
    const schema = sugar.number();

    const expected = {
      id: 'http://foo.bar/schemas/obj.json',
      type: 'number'
    };

    expect(schema.generate({ id: 'http://foo.bar/schemas/obj.json' })).to.be.eql(JSON.stringify(expected));
    expect(schema.generate({ obj: true, id: 'http://foo.bar/schemas/obj.json' })).to.be.eql(expected);
  });
});
