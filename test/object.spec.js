
import sugar from '../lib/index';
import { verifySchemaOutput } from './utils';

/* eslint-disable prefer-arrow-callback */
describe('object type', () => {
  it('should initialize without errors', () => {
    sugar.object();
  });

  it('should generate schema with object `type`', () => {
    const schema = sugar.object();

    const expected = {
      type: 'object'
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with object `type` inside object', () => {
    const schema = sugar.object().keys({
      complex: sugar.object().keys({
        value: sugar.number()
      })
    });

    const expected = {
      type: 'object',
      properties: {
        complex: {
          type: 'object',
          properties: {
            value: {
              type: 'number'
            }
          }
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate schema with object `type` inside array', () => {
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

  it('should generate object schema with properties', () => {
    const schema = sugar.object().keys({
      foo: sugar.boolean(),
      value: sugar.number(),
      address: sugar.string(),
      unknown: sugar.nullable()
    });

    const expected = {
      type: 'object',
      properties: {
        foo: {
          type: 'boolean'
        },
        value: {
          type: 'number'
        },
        address: {
          type: 'string'
        },
        unknown: {
          type: 'null'
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with required properties', () => {
    const schema = sugar.object().keys({
      foo: sugar.boolean().required(),
      value: sugar.number(),
      address: sugar.string().required(),
      unknown: sugar.nullable()
    });

    const expected = {
      type: 'object',
      properties: {
        foo: {
          type: 'boolean'
        },
        value: {
          type: 'number'
        },
        address: {
          type: 'string'
        },
        unknown: {
          type: 'null'
        }
      },
      required: ['foo', 'address']
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with `additionalProperties`', () => {
    const schema = sugar.object().keys({
      foo: sugar.boolean(),
      value: sugar.number(),
      address: sugar.string(),
      unknown: sugar.nullable()
    }).additionalProperties(false);

    const expected = {
      type: 'object',
      properties: {
        foo: {
          type: 'boolean'
        },
        value: {
          type: 'number'
        },
        address: {
          type: 'string'
        },
        unknown: {
          type: 'null'
        }
      },
      additionalProperties: false
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with `additionalProperties` as schema', () => {
    const schema = sugar.object().keys({
      foo: sugar.boolean(),
      value: sugar.number(),
      address: sugar.string(),
      unknown: sugar.nullable()
    }).additionalProperties(sugar.string());

    const expected = {
      type: 'object',
      properties: {
        foo: {
          type: 'boolean'
        },
        value: {
          type: 'number'
        },
        address: {
          type: 'string'
        },
        unknown: {
          type: 'null'
        }
      },
      additionalProperties: {
        type: 'string'
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with `patternProperties`', () => {
    const schema = sugar.object().keys({
      foo: sugar.boolean(),
      value: sugar.number(),
      address: sugar.string(),
      unknown: sugar.nullable()
    }).patternProperties({
      '^S_': sugar.string(),
      '^I_': sugar.number().integer()
    });

    const expected = {
      type: 'object',
      properties: {
        foo: {
          type: 'boolean'
        },
        value: {
          type: 'number'
        },
        address: {
          type: 'string'
        },
        unknown: {
          type: 'null'
        }
      },
      patternProperties: {
        '^S_': {
          type: 'string'
        },
        '^I_': {
          type: 'integer'
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with `minProperties`', () => {
    const schema = sugar.object().keys({
      foo: sugar.boolean(),
      value: sugar.number(),
      address: sugar.string(),
      unknown: sugar.nullable()
    }).minProperties(2);

    const expected = {
      type: 'object',
      properties: {
        foo: {
          type: 'boolean'
        },
        value: {
          type: 'number'
        },
        address: {
          type: 'string'
        },
        unknown: {
          type: 'null'
        }
      },
      minProperties: 2
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with `maxProperties`', () => {
    const schema = sugar.object().keys({
      foo: sugar.boolean(),
      value: sugar.number(),
      address: sugar.string(),
      unknown: sugar.nullable()
    }).maxProperties(3);

    const expected = {
      type: 'object',
      properties: {
        foo: {
          type: 'boolean'
        },
        value: {
          type: 'number'
        },
        address: {
          type: 'string'
        },
        unknown: {
          type: 'null'
        }
      },
      maxProperties: 3
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with `minProperties` and `maxProperties`', () => {
    const schema = sugar.object().keys({
      foo: sugar.boolean(),
      value: sugar.number(),
      address: sugar.string(),
      unknown: sugar.nullable()
    }).minProperties(2)
    .maxProperties(3);

    const expected = {
      type: 'object',
      properties: {
        foo: {
          type: 'boolean'
        },
        value: {
          type: 'number'
        },
        address: {
          type: 'string'
        },
        unknown: {
          type: 'null'
        }
      },
      minProperties: 2,
      maxProperties: 3
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with property `dependencies`', () => {
    const schema = sugar.object().keys({
      name: sugar.string().required(),
      creditCard: sugar.number(),
      billingAddress: sugar.string().requiredWhen('creditCard')
    });

    const expected = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        creditCard: {
          type: 'number'
        },
        billingAddress: {
          type: 'string'
        }
      },
      required: ['name'],
      dependencies: {
        creditCard: ['billingAddress']
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with multiple property `dependencies`', () => {
    const schema = sugar.object().keys({
      name: sugar.string().required(),
      creditCard: sugar.number(),
      billingAddress: sugar.string().requiredWhen('creditCard', 'name'),
      billingDistrict: sugar.string().requiredWhen('creditCard')
    });

    const expected = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        creditCard: {
          type: 'number'
        },
        billingAddress: {
          type: 'string'
        },
        billingDistrict: {
          type: 'string'
        }
      },
      required: ['name'],
      dependencies: {
        creditCard: ['billingAddress', 'billingDistrict'],
        name: ['billingAddress']
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with bidirectional property `dependencies`', () => {
    const schema = sugar.object().keys({
      name: sugar.string().required(),
      creditCard: sugar.number().requiredWhen('billingAddress'),
      billingAddress: sugar.string().requiredWhen('creditCard')
    });

    const expected = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        creditCard: {
          type: 'number'
        },
        billingAddress: {
          type: 'string'
        }
      },
      required: ['name'],
      dependencies: {
        billingAddress: ['creditCard'],
        creditCard: ['billingAddress']
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with schema `dependencies`', () => {
    const schema = sugar.object().keys({
      name: sugar.string().required(),
      creditCard: sugar.number(),
      billingAddress: sugar.mixed().when('creditCard', sugar.string().required())
    });

    const expected = {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        creditCard: {
          type: 'number'
        }
      },
      required: ['name'],
      dependencies: {
        creditCard: {
          properties: {
            billingAddress: {
              type: 'string'
            }
          },
          required: ['billingAddress']
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with `definitions` and `ref`', () => {
    const schema = sugar.object().keys({
      billingAddress: sugar.any().ref('#/definitions/address'),
      shippingAddress: sugar.any().allOf([
        sugar.any().ref('#/definitions/address'),
        sugar.object().keys({
          type: sugar.any().enum(['residential', 'business']).required()
        })
      ])
    }).definitions({
      address: sugar.object().keys({
        streetAddress: sugar.string().required(),
        city: sugar.string().required(),
        state: sugar.string().required()
      })
    });

    const expected = {
      type: 'object',
      properties: {
        billingAddress: {
          $ref: '#/definitions/address'
        },
        shippingAddress: {
          allOf: [{
            $ref: '#/definitions/address'
          }, {
            properties: {
              type: {
                enum: ['residential', 'business']
              }
            },
            required: ['type']
          }]
        }
      },
      definitions: {
        address: {
          type: 'object',
          properties: {
            streetAddress: {
              type: 'string'
            },
            city: {
              type: 'string'
            },
            state: {
              type: 'string'
            }
          },
          required: ['streetAddress', 'city', 'state']
        }
      }
    };

    verifySchemaOutput(schema, expected);
  });

  it('should generate object schema with metadata', () => {
    const schema = sugar.object().keys({
      name: sugar.string().title('name title'),
      creditCard: sugar.number().description('number description'),
      value: sugar.string().default('default value')
    }).title('object title');

    const expected = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'name title'
        },
        creditCard: {
          type: 'number',
          description: 'number description'
        },
        value: {
          type: 'string',
          default: 'default value'
        }
      },
      title: 'object title'
    };

    verifySchemaOutput(schema, expected);
  });
});
