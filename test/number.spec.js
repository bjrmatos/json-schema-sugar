
import sugar from '../lib/index';
import { verifySchemaOutput } from './utils';

/* eslint-disable prefer-arrow-callback */
describe('number type', () => {
  it('should initialize without errors', () => {
    sugar.number();
  });

  it('should generate schema with number `type`', () => {
    const schema = sugar.number();

    const expected = {
      type: 'number'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with number `type` inside object', () => {
    const schema = sugar.object().keys({
      value: sugar.number()
    });

    const expected = {
      type: 'object',
      properties: {
        value: {
          type: 'number'
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with number `type` inside array', () => {
    const schema = sugar.array().items(sugar.number());

    const expected = {
      type: 'array',
      items: {
        type: 'number'
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with number `type` inside array with object items', () => {
    const schema = sugar.array().items({
      value: sugar.number()
    });

    const expected = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'number'
          }
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with integer `type`', () => {
    const schema = sugar.number().integer();

    const expected = {
      type: 'integer'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate number schema with `multipleOf`', () => {
    const schema = sugar.number().multipleOf(3);

    const expected = {
      type: 'number',
      multipleOf: 3
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate number schema with `minimum`', () => {
    const schema = sugar.number().minimum(5);

    const expected = {
      type: 'number',
      minimum: 5
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate number schema with `maximum`', () => {
    const schema = sugar.number().maximum(10);

    const expected = {
      type: 'number',
      maximum: 10
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate number schema with `minimum` and `maximum`', () => {
    const schema = sugar.number().minimum(5).maximum(10);

    const expected = {
      type: 'number',
      minimum: 5,
      maximum: 10
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate number schema with `exclusiveMinimum`', () => {
    const schema = sugar.number().exclusiveMinimum(true);

    const expected = {
      type: 'number',
      exclusiveMinimum: true
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate number schema with `minimum` and `exclusiveMinimum`', () => {
    const schema = sugar.number().minimum(5).exclusiveMinimum(true);

    const expected = {
      type: 'number',
      minimum: 5,
      exclusiveMinimum: true
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate number schema with `exclusiveMaximum`', () => {
    const schema = sugar.number().exclusiveMaximum(true);

    const expected = {
      type: 'number',
      exclusiveMaximum: true
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate number schema with `maximum` and `exclusiveMaximum`', () => {
    const schema = sugar.number().maximum(10).exclusiveMaximum(true);

    const expected = {
      type: 'number',
      maximum: 10,
      exclusiveMaximum: true
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate number schema with `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`', () => {
    const schema = (
      sugar.number()
      .minimum(5)
      .maximum(10)
      .exclusiveMinimum(true)
      .exclusiveMaximum(true)
    );

    const expected = {
      type: 'number',
      minimum: 5,
      maximum: 10,
      exclusiveMinimum: true,
      exclusiveMaximum: true
    };

    verifySchemaOutput(schema, expected);
  });

  it('should not include type when used with `oneOf`', () => {
    const schema = sugar.number().oneOf([
      sugar.number().multipleOf(3),
      sugar.number().multipleOf(5)
    ]);

    const expected = {
      type: 'number',
      oneOf: [{
        multipleOf: 3
      }, {
        multipleOf: 5
      }]
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate number schema with metadata', () => {
    const schema = (
      sugar.number()
      .title('title')
      .description('number description')
      .default('default value')
    );

    const expected = {
      type: 'number',
      title: 'title',
      description: 'number description',
      default: 'default value'
    };

    verifySchemaOutput(schema, expected);
  });
});
