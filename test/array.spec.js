
import sugar from '../lib/index';
import { verifySchemaOutput } from './utils';

/* eslint-disable prefer-arrow-callback */
describe('array type', () => {
  it('should initialize without errors', () => {
    sugar.array();
  });

  it('should generate schema with array `type`', () => {
    const schema = sugar.array();

    const expected = {
      type: 'array'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with array `type` and simple items', () => {
    const schema = sugar.array().items(sugar.number());

    const expected = {
      type: 'array',
      items: {
        type: 'number'
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with array `type` and simple items (tuple)', () => {
    const schema = sugar.array().items([
      sugar.number(),
      sugar.string()
    ]);

    const expected = {
      type: 'array',
      items: [{
        type: 'number'
      }, {
        type: 'string'
      }]
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with array `type` and simple and object items (tuple)', () => {
    const schema = sugar.array().items([{
      address: sugar.string()
    }, sugar.number()]);

    const expected = {
      type: 'array',
      items: [{
        type: 'object',
        properties: {
          address: {
            type: 'string'
          }
        }
      }, {
        type: 'number'
      }]
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with array `type` and object items', () => {
    const schema = sugar.array().items({
      address: sugar.string()
    });

    const schema2 = sugar.array().items(sugar.object().keys({
      address: sugar.string()
    }));

    const expected = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          address: {
            type: 'string'
          }
        }
      }
    };

    verifySchemaOutput(schema, expected);
    verifySchemaOutput(schema2, expected);
  });

  it('should generate schema with array `type` inside object', () => {
    const schema = sugar.object().keys({
      value: sugar.array()
    });

    const expected = {
      type: 'object',
      properties: {
        value: {
          type: 'array'
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with array `type` inside array', () => {
    const schema = sugar.array().items(sugar.array());

    const expected = {
      type: 'array',
      items: {
        type: 'array'
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with array `type` inside array with object items', () => {
    const schema = sugar.array().items({
      value: sugar.array()
    });

    const expected = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'array'
          }
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate array schema with `additionalItems`', () => {
    const schema = sugar.array().items([
      sugar.string(),
      sugar.number()
    ]).additionalItems(false);

    const expected = {
      type: 'array',
      items: [{
        type: 'string'
      }, {
        type: 'number'
      }],
      additionalItems: false
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate array schema with `minItems`', () => {
    const schema = sugar.array().items({
      value: sugar.number()
    }).minItems(2);

    const expected = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'number'
          }
        }
      },
      minItems: 2
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate array schema with `maxItems`', () => {
    const schema = sugar.array().items({
      value: sugar.number()
    }).maxItems(2);

    const expected = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'number'
          }
        }
      },
      maxItems: 2
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate array schema with `minItems` and `maxItems`', () => {
    const schema = sugar.array().items({
      value: sugar.number()
    }).minItems(1)
    .maxItems(2);

    const expected = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'number'
          }
        }
      },
      minItems: 1,
      maxItems: 2
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate array schema with `uniqueItems`', () => {
    const schema = sugar.array().items({
      value: sugar.number()
    }).uniqueItems(true);

    const expected = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'number'
          }
        }
      },
      uniqueItems: true
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate array schema with metadata', () => {
    const schema = sugar.array().items([
      sugar.number().title('title example').description('A test description'),
      sugar.string().default('default value')
    ]).title('array title');

    const expected = {
      type: 'array',
      items: [{
        type: 'number',
        title: 'title example',
        description: 'A test description'
      }, {
        type: 'string',
        default: 'default value'
      }],
      title: 'array title'
    };

    verifySchemaOutput(schema, expected);
  });
});
