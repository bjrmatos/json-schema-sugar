
import sugar from '../lib/index';
import { verifySchemaOutput } from './utils';

/* eslint-disable prefer-arrow-callback */
describe('string type', () => {
  it('should initialize without errors', () => {
    sugar.string();
  });

  it('should generate schema with string `type`', () => {
    const schema = sugar.string();

    const expected = {
      type: 'string'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with string `type` inside object', () => {
    const schema = sugar.object().keys({
      value: sugar.string()
    });

    const expected = {
      type: 'object',
      properties: {
        value: {
          type: 'string'
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with string `type` inside array', () => {
    const schema = sugar.array().items(sugar.string());

    const expected = {
      type: 'array',
      items: {
        type: 'string'
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with string `type` inside array with object items', () => {
    const schema = sugar.array().items({
      value: sugar.string()
    });

    const expected = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'string'
          }
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate string schema with `minLength`', () => {
    const schema = sugar.string().minLength(2);

    const expected = {
      type: 'string',
      minLength: 2
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate string schema with `maxLength`', () => {
    const schema = sugar.string().maxLength(8);

    const expected = {
      type: 'string',
      maxLength: 8
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate string schema with `minLength` and `maxLength`', () => {
    const schema = sugar.string().minLength(2).maxLength(8);

    const expected = {
      type: 'string',
      minLength: 2,
      maxLength: 8
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate string schema with `pattern`', () => {
    const schema = sugar.string().pattern('dummy');
    const schema2 = sugar.string().pattern(/dummy/);

    const expected = {
      type: 'string',
      pattern: 'dummy'
    };

    verifySchemaOutput(schema, expected);
    verifySchemaOutput(schema2, expected);
  });

  it('should generate string schema with `format`', () => {
    const schema = sugar.string().format('email');

    const expected = {
      type: 'string',
      format: 'email'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate string schema with `minLength`, `maxLength`, `pattern`', () => {
    const schema = (
      sugar.string()
      .minLength(2)
      .maxLength(8)
      .pattern(/dummy/)
    );

    const expected = {
      type: 'string',
      minLength: 2,
      maxLength: 8,
      pattern: 'dummy'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should not include type when used with `oneOf`', () => {
    const schema = sugar.string().oneOf([
      sugar.string().minLength(3),
      sugar.string().maxLength(5)
    ]);

    const expected = {
      type: 'string',
      oneOf: [{
        minLength: 3
      }, {
        maxLength: 5
      }]
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate string schema with metadata', () => {
    const schema = (
      sugar.string()
      .title('title')
      .description('description')
      .default('default value')
    );

    const expected = {
      type: 'string',
      title: 'title',
      description: 'description',
      default: 'default value'
    };

    verifySchemaOutput(schema, expected);
  });
});
