
import sugar from '../lib/index';
import { verifySchemaOutput } from './utils';

/* eslint-disable prefer-arrow-callback */
describe('nullable type', () => {
  it('should initialize without errors', () => {
    sugar.nullable();
  });

  it('should generate schema with null `type`', () => {
    const schema = sugar.nullable();

    const expected = {
      type: 'null'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with null `type` inside object', () => {
    const schema = sugar.object().keys({
      value: sugar.nullable()
    });

    const expected = {
      type: 'object',
      properties: {
        value: {
          type: 'null'
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with null `type` inside array', () => {
    const schema = sugar.array().items(sugar.nullable());

    const expected = {
      type: 'array',
      items: {
        type: 'null'
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with null `type` inside array with object items', () => {
    const schema = sugar.array().items({
      value: sugar.nullable()
    });

    const expected = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'null'
          }
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate nullable schema with metadata', () => {
    const schema = (
      sugar.nullable()
      .title('title')
      .description('description')
      .default('default value')
    );

    const expected = {
      type: 'null',
      title: 'title',
      description: 'description',
      default: 'default value'
    };

    verifySchemaOutput(schema, expected);
  });
});
