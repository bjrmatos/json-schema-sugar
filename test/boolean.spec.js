
import sugar from '../lib/index';
import { verifySchemaOutput } from './utils';

/* eslint-disable prefer-arrow-callback */
describe('boolean type', () => {
  it('should initialize without errors', () => {
    sugar.boolean();
  });

  it('should generate schema with boolean `type`', () => {
    const schema = sugar.boolean();

    const expected = {
      type: 'boolean'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with boolean `type` inside object', () => {
    const schema = sugar.object().keys({
      value: sugar.boolean()
    });

    const expected = {
      type: 'object',
      properties: {
        value: {
          type: 'boolean'
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with boolean `type` inside array', () => {
    const schema = sugar.array().items(sugar.boolean());

    const expected = {
      type: 'array',
      items: {
        type: 'boolean'
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with boolean `type` inside array with object items', () => {
    const schema = sugar.array().items({
      value: sugar.boolean()
    });

    const expected = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'boolean'
          }
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate boolean schema with metadata', () => {
    const schema = (
      sugar.boolean()
      .title('title')
      .description('description')
      .default('default value')
    );

    const expected = {
      type: 'boolean',
      title: 'title',
      description: 'description',
      default: 'default value'
    };

    verifySchemaOutput(schema, expected);
  });
});
