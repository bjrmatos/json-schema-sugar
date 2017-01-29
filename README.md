json-schema-sugar
=================

[![NPM Version](http://img.shields.io/npm/v/json-schema-sugar.svg?style=flat-square)](https://npmjs.com/package/json-schema-sugar)[![License](http://img.shields.io/npm/l/json-schema-sugar.svg?style=flat-square)](http://opensource.org/licenses/MIT)[![Build Status](https://travis-ci.org/bjrmatos/json-schema-sugar.png?branch=master)](https://travis-ci.org/bjrmatos/json-schema-sugar)

> **Create a JSON Schema without the pain of writing it**

This module let you write [JSON Schemas v4](http://json-schema.org/) in a "sugar" way (using a chainable API).
The API and style is ~~stolen~~ heavily inspired by [Joi](https://github.com/hapijs/joi) and [Yup](https://github.com/jquense/yup).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
- [API](#api)
  - [`sugar`](#sugar)
  - [mixed](#mixed)
    - [`mixed.clone(): Schema`](#mixedclone-schema)
    - [`mixed.title(title: string): Schema`](#mixedtitletitle-string-schema)
    - [`mixed.description(description: string): Schema`](#mixeddescriptiondescription-string-schema)
    - [`mixed.default(default: any): Schema`](#mixeddefaultdefault-any-schema)
    - [`mixed.meta(field: string | object, value: ?any): Schema` Alias: `extra`](#mixedmetafield-string--object-value-any-schema-alias-extra)
    - [`mixed.enum(values: Array<any>): Schema`](#mixedenumvalues-arrayany-schema)
    - [`mixed.required(): Schema`](#mixedrequired-schema)
    - [`mixed.requiredWhen(dependantProp: string | Array<string>): Schema`](#mixedrequiredwhendependantprop-string--arraystring-schema)
    - [`mixed.when(dependantProp: string | Array<string>): Schema`](#mixedwhendependantprop-string--arraystring-schema)
    - [`mixed.definitions(definitions: object): Schema`](#mixeddefinitionsdefinitions-object-schema)
    - [`mixed.allOf(schemas: Array<Schema>): Schema`](#mixedallofschemas-arrayschema-schema)
    - [`mixed.anyOf(schemas: Array<Schema>): Schema`](#mixedanyofschemas-arrayschema-schema)
    - [`mixed.oneOf(schemas: Array<Schema>): Schema`](#mixedoneofschemas-arrayschema-schema)
    - [`mixed.not(schema: Schema): Schema`](#mixednotschema-schema-schema)
    - [`mixed.noType(): Schema`](#mixednotype-schema)
    - [`mixed.canBe(type: Schema | Array<Schema>): Schema`](#mixedcanbetype-schema--arrayschema-schema)
    - [`mixed.ref(refUri: string): Schema`](#mixedrefrefuri-string-schema)
    - [`mixed.generate(options: ?object): string`](#mixedgenerateoptions-object-string)
  - [nullable](#nullable)
  - [boolean](#boolean)
  - [number](#number)
    - [`number.integer(): Schema`](#numberinteger-schema)
    - [`number.multipleOf(value: number): Schema`](#numbermultipleofvalue-number-schema)
    - [`number.minimum(value: number): Schema`](#numberminimumvalue-number-schema)
    - [`number.maximum(value: number): Schema`](#numbermaximumvalue-number-schema)
    - [`number.exclusiveMinimum(value: boolean): Schema`](#numberexclusiveminimumvalue-boolean-schema)
    - [`number.exclusiveMaximum(value: boolean): Schema`](#numberexclusivemaximumvalue-boolean-schema)
  - [string](#string)
    - [`string.minLength(value: number): Schema`](#stringminlengthvalue-number-schema)
    - [`string.maxLength(value: number): Schema`](#stringmaxlengthvalue-number-schema)
    - [`string.pattern(pattern: string | RegExp): Schema`](#stringpatternpattern-string--regexp-schema)
    - [`string.format(format: string): Schema`](#stringformatformat-string-schema)
  - [object](#object)
    - [`object.keys(properties: object): Schema`](#objectkeysproperties-object-schema)
    - [`object.additionalProperties(value: boolean | Schema): Schema`](#objectadditionalpropertiesvalue-boolean--schema-schema)
    - [`object.patternProperties(value: object): Schema`](#objectpatternpropertiesvalue-object-schema)
    - [`object.minProperties(value: number): Schema`](#objectminpropertiesvalue-number-schema)
    - [`object.maxProperties(value: number): Schema`](#objectmaxpropertiesvalue-number-schema)
  - [array](#array)
    - [`array.items(items: object | Schema | Array<Schema>): Schema`](#arrayitemsitems-object--schema--arrayschema-schema)
    - [`array.additionalItems(value: boolean): Schema`](#arrayadditionalitemsvalue-boolean-schema)
    - [`array.minItems(value: number): Schema`](#arrayminitemsvalue-number-schema)
    - [`array.maxItems(value: number): Schema`](#arraymaxitemsvalue-number-schema)
    - [`array.uniqueItems(value: boolean): Schema`](#arrayuniqueitemsvalue-boolean-schema)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

Define and create schema objects. Schema objects are immutable, so each call of a method returns a _new_ schema object.

```js
var sugar = require('json-schema-sugar');

var schema = sugar.object().keys({
  name: sugar.string().required(),
  age: sugar.number().integer().required(),
  email: sugar.string(),
  website: sugar.string()
});

var jsonSchema = schema.generate({
  name: 'jimmy',
  age: 24
});

console.log(jsonSchema);
```

Output:

```js
{
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    age: {
      type: 'integer'
    },
    email: {
      type: 'string'
    },
    website: {
      type: 'string'
    }
  },
  required: ['name', 'age']
}
```

## API

### `sugar`

The module export.

```js
var sugar = require('json-schema-sugar');

sugar.mixed // also aliased as sugar.any
sugar.nullable
sugar.string
sugar.number
sugar.boolean
sugar.object
sugar.array
```

### mixed

Creates a schema that matches a general type. All types inherit from this base type

```js
var schema = sugar.mixed();
schema.generate();
// => {}
```

#### `mixed.clone(): Schema`

Creates a deep copy of the schema. Clone is used internally to return a new schema with every schema state change (making schema instances inmutable).

#### `mixed.title(title: string): Schema`

Adds a title in the schema.

#### `mixed.description(description: string): Schema`

Adds a description in the schema.

#### `mixed.default(default: any): Schema`

Adds a default value in the schema.

#### `mixed.meta(field: string | object, value: ?any): Schema` Alias: `extra`

Adds custom fields to the schema, multiple calls to `.meta` will accumulate data with previous calls.

With field:

```js
var schema = sugar.object().keys({
  name: sugar.string().required().meta('example', 'Bob').meta('isMain', true),
});

schema.generate();
```

Output:

```js
{
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Bob',
      isMain: true
    }
  }
}
```

With an Object:

```js
var schema = sugar.object().keys({
  name: sugar.string().required().meta({ example: 'Bob', isMain: true }),
});

schema.generate();
```

Output:

```js
{
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Bob',
      isMain: true
    }
  }
}
```

#### `mixed.enum(values: Array<any>): Schema`

Restricts a value in the schema to a fixed set of values.

#### `mixed.required(): Schema`

When used inside an object schema specifies that a property is required.

```js
var schema = sugar.object().keys({
  name: sugar().string().required(),
  email: sugar().string().required(),
  address: sugar.string()
});

schema.generate();
```

Output:

```js
{
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    address: {
      type: 'string'
    }
  },
  required: ['name', 'email']
}
```

#### `mixed.requiredWhen(dependantProp: string | Array<string>): Schema`

When used inside an object schema specifies that a property must be present (required)
when another property/properties are present, making a `property dependency`.
`dependantProp` can be an array of strings, or multiple strings can be passed as individual arguments.

```js
var schema = sugar.object().keys({
  name: sugar.string().required(),
  creditCard: sugar.number(),
  billingAddress: sugar.string().requiredWhen('creditCard', 'name'),
  billingDistrict: sugar.string().requiredWhen('creditCard')
});

schema.generate();
```

Output:

```js
{
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
}
```

#### `mixed.when(dependantProp: string | Array<string>): Schema`

When used inside an object schema specifies that when a property is present the schema
should be different, making a `schema dependency`.
`dependantProp` can be an array of strings, or multiple strings can be passed as individual arguments.

```js
var schema = sugar.object().keys({
  name: sugar.string(),
  creditCard: sugar.number(),
  billingAddress: sugar.mixed().when('creditCard', sugar.string().required())
});

schema.generate();
```

Output:

```js
{
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    creditCard: {
      type: 'number'
    }
  },
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
}
```

#### `mixed.definitions(definitions: object): Schema`

Adds definitions to the schema, definitions are standardized placeholder in which you can define inline subschemas to be used in a schema.

```js
var schema = sugar.object().keys({
  billingAddress: sugar.any().ref('#/definitions/address')
}).definitions({
  address: sugar.object().keys({
    streetAddress: sugar.string().required(),
    city: sugar.string().required(),
    state: sugar.string().required()
  })
});

schema.generate();
```

Output:

```js
{
  type: 'object',
  properties: {
    billingAddress: {
      $ref: '#/definitions/address'
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
}
```

#### `mixed.allOf(schemas: Array<Schema>): Schema`

Adds a restriction that the given data must be valid against all of the given subschemas.

```js
var schema = sugar.mixed().allOf([
  sugar.string(),
  sugar.string().minLength(2),
  sugar.string().maxLength(5)
]);
```

Output:

```js
{
  allOf: [{
    type: 'string'
  }, {
    minLength: 2
  }, {
    maxLength: 5
  }]
}
```

#### `mixed.anyOf(schemas: Array<Schema>): Schema`

Adds a restriction that the given data must be valid against any (one or more) of the given subschemas.

```js
var schema = sugar.mixed().anyOf([
  sugar.string().maxLength(5),
  sugar.number().minimum(0)
]);
```

Output:

```js
{
  anyOf: [{
    type: 'string',
    maxLength: 5
  }, {
    type: 'number',
    minimum: 0
  }]
}
```

#### `mixed.oneOf(schemas: Array<Schema>): Schema`

Adds a restriction that the given data must be valid against exactly one of the given subschemas.

```js
var schema = sugar.mixed().oneOf([
  sugar.number().multipleOf(3),
  sugar.number().multipleOf(5)
]);
```

Output:

```js
{
  oneOf: [{
    type: 'number',
    multipleOf: 3
  }, {
    type: 'number',
    multipleOf: 5
  }]
}
```

#### `mixed.not(schema: Schema): Schema`

Declares that a instance validates if it doesn’t validate against the given subschema.

```js
var schema = sugar.mixed().not(sugar.string());
```

Output:

```js
{
  not: {
    type: 'string'
  }
}
```

#### `mixed.noType(): Schema`

Declares that a schema should not include the `type` property in the output.

```js
var schema = sugar.number().multipleOf(5).noType();
```

Output:

```js
{
  multipleOf: 5
}
```

#### `mixed.canBe(type: Schema | Array<Schema>): Schema`

Specify multiple types for a schema. `type` can be an array of schemas, or multiple schemas can be passed as individual arguments.
**This method is only available to `mixed` schemas (schemas created directly with `sugar.mixed()`)**

```js
var schema = sugar.mixed().canBe(sugar.string(), sugar.number());
schema.generate();
// => { type: ['string', 'number'] }
```

#### `mixed.ref(refUri: string): Schema`

Creates a reference to a schema located in `refUri`. **This method is only available to `mixed` schemas (schemas created directly with `sugar.mixed()`)**

```js
var schema = sugar.object().keys({
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
```

Output:

```js
{
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
}
```

#### `mixed.generate(options: ?object): string`

Generates a `JSON Schema` based on the constructed schema.

The `options` (optional) argument is an object hash and can contain the following properties:

```js
options = {
  obj: boolean = false,
  removeType: boolean = false,
  space: ?number = undefined,
  $schema: ?string = undefined,
  id: ?string = undefined
};
```

- `obj`: return the `JSON Schema` as object instead of string.
- `removeType`: don't include the `type` property in the `JSON Schema`.
- `space`: Specifies the `space` option for `JSON.stringify`, adding the ability to return the json string with white space.
- `$schema`: Specifies a custom `$schema` entry in the `JSON Schema`.
- `id`: Specifies an `id` entry in the `JSON Schema`.

### nullable

Creates a schema that matches a `null` type. Supports all the same methods as [`mixed`](#mixed).

```js
var schema = sugar.nullable();
schema.generate();
// => { type: 'null' }
```

### boolean

Creates a schema that matches a `boolean` type. Supports all the same methods as [`mixed`](#mixed).

```js
var schema = sugar.boolean();
schema.generate();
// => { type: 'boolean' }
```

### number

Creates a schema that matches a `number` type. Supports all the same methods as [`mixed`](#mixed).

```js
var schema = sugar.number();
schema.generate();
// => { type: 'number' }
```

#### `number.integer(): Schema`

Defines that the schema should be an `integer`.

```js
var schema = sugar.number().integer();
schema.generate();
```

Output:

```js
{
  type: 'integer'
}
```

#### `number.multipleOf(value: number): Schema`

Defines that the schema should be multiple of `value`.

```js
var schema = sugar.number().multipleOf(3);
schema.generate();
```

Output:

```js
{
  type: 'number',
  multipleOf: 3
}
```

#### `number.minimum(value: number): Schema`

Defines that the schema should be a minimum numeric `value`.

```js
var schema = sugar.number().minimum(5);
schema.generate();
```

Output:

```js
{
  type: 'number',
  minimum: 5
}
```

#### `number.maximum(value: number): Schema`

Defines that the schema should be a maximum numeric `value`.

```js
var schema = sugar.number().maximum(10);
schema.generate();
```

Output:

```js
{
  type: 'number',
  maximum: 10
}
```

#### `number.exclusiveMinimum(value: boolean): Schema`

When `value` is `true`, it indicates that the range excludes the `minimum` value,
i.e., `x > minx > min`. When `false` (or not included), it indicates that the range includes the `minimum` value, i.e., `x ≥ minx ≥ min`.

```js
var schema = sugar.number().minimum(5).exclusiveMinimum(true);
schema.generate();
```

Output:

```js
{
  type: 'number',
  minimum: 5,
  exclusiveMinimum: true
}
```

#### `number.exclusiveMaximum(value: boolean): Schema`

When `value` is `true`, it indicates that the range excludes the `maximum` value,
i.e., `x < maxx <max`. When `false` (or not included), it indicates that the range includes the `maximum` value, i.e., `x ≤ maxx ≤ max`.

```js
var schema = sugar.number().maximum(10).exclusiveMaximum(true);
schema.generate();
```

Output:

```js
{
  type: 'number',
  maximum: 10,
  exclusiveMaximum: true
}
```

### string

Creates a schema that matches a `string` type. Supports all the same methods as [`mixed`](#mixed).

```js
var schema = sugar.string();
schema.generate();
// => { type: 'string' }
```

#### `string.minLength(value: number): Schema`

Defines that a string should have a minimum length of `value`.

```js
var schema = sugar.string().minLength(2);
schema.generate();
```

Output:

```js
{
  type: 'string',
  minLength: 2
}
```

#### `string.maxLength(value: number): Schema`

Defines that a string should have a maximum length of `value`.

```js
var schema = sugar.string().maxLength(8);
schema.generate();
```

Output:

```js
{
  type: 'string',
  maxLength: 8
}
```

#### `string.pattern(pattern: string | RegExp): Schema`

Defines that a string should satisfies a `pattern`.

```js
var schema = sugar.string().pattern(/abc/);
schema.generate();
```

Output:

```js
{
  type: 'string',
  pattern: 'abc'
}
```

#### `string.format(format: string): Schema`

Defines a format for the string. `format` can be any standardized format like `date-time`, `email`, etc.

```js
var schema = sugar.string().format('email');
schema.generate();
```

Output:

```js
{
  type: 'string',
  format: 'email'
}
```

### object

Creates a schema that matches a `object` type. Supports all the same methods as [`mixed`](#mixed).

```js
var schema = sugar.object().keys({
  name: sugar.string()
});

schema.generate();
// => { type: 'object', properties: { name: { type: 'string' } } }
```

#### `object.keys(properties: object): Schema`

Defines properties for the object. Each key in the `properties` hash object must have a `Schema` as value.

```js
var schema = sugar.object().keys({
  foo: sugar.boolean(),
  value: sugar.number(),
  address: sugar.string(),
  unknown: sugar.nullable()
});

schema.generate();
```

Output:

```js
{
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
}
```

#### `object.additionalProperties(value: boolean | Schema): Schema`

Defines if an object can have additional properties or not.
If `value` is a `Schema` then all additional properties must be valid against the given schema.

```js
var schema = sugar.object().keys({
  foo: sugar.boolean(),
  value: sugar.number(),
  address: sugar.string(),
  unknown: sugar.nullable()
}).additionalProperties(sugar.string());

schema.generate();
```

Output:

```js
{
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
}
```

#### `object.patternProperties(value: object): Schema`

Defines that if there is any property in an object that match a given pattern, that property must be valid against a schema.

Each key in the `value` hash object must have a `Schema` as value.

```js
var schema = sugar.object().keys({
  foo: sugar.boolean(),
  value: sugar.number(),
  address: sugar.string(),
  unknown: sugar.nullable()
}).patternProperties({
  '^S_': sugar.string(),
  '^I_': sugar.number().integer()
});

schema.generate();
```

Output:

```js
{
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
}
```

#### `object.minProperties(value: number): Schema`

Defines that an object should have a minimum number of properties.

```js
var schema = sugar.object().keys({
  foo: sugar.boolean(),
  value: sugar.number(),
  address: sugar.string(),
  unknown: sugar.nullable()
}).minProperties(2);

schema.generate();
```

Output:

```js
{
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
}
```

#### `object.maxProperties(value: number): Schema`

Defines that an object should have a maximum number of properties.

```js
var schema = sugar.object().keys({
  foo: sugar.boolean(),
  value: sugar.number(),
  address: sugar.string(),
  unknown: sugar.nullable()
}).maxProperties(3);

schema.generate();
```

Output:

```js
{
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
}
```

### array

Creates a schema that matches a `array` type. Supports all the same methods as [`mixed`](#mixed).

```js
var schema = sugar.array().items(sugar.number());
schema.generate();
// => { type: 'array', items: { type: 'number' } }
```

#### `array.items(items: object | Schema | Array<Schema>): Schema`

When `items` is an `object` or `Schema` specifies that all items in an array must be valid against the given schema.
When `items` is an `array` specifies that items in an array must be valid and appear in the same order of the given schemas (tuple validation).

```js
var schema = sugar.array().items({
  name: sugar.string(),
  email: sugar.string()
});

schema.generate();
```

Output:

```js
{
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      email: {
        type: 'string'
      }
    }
  }
}
```

Tuple example:

```js
var schema = sugar.array().items([
  sugar.number(),
  sugar.string()
]);

schema.generate();
```

Output:

```js
{
  type: 'array',
  items: [{
    type: 'number'
  }, {
    type: 'string'
  }]
}
```

#### `array.additionalItems(value: boolean): Schema`

Defines if an array can have additional items or not.

```js
var schema = sugar.array().items([
  sugar.string(),
  sugar.number()
]).additionalItems(false);

schema.generate();
```

Output:

```js
{
  type: 'array',
  items: [{
    type: 'string'
  }, {
    type: 'number'
  }],
  additionalItems: false
}
```

#### `array.minItems(value: number): Schema`

Defines that an array should have a minimum number of items.

```js
var schema = sugar.array().items({
  value: sugar.number()
}).minItems(2);

schema.generate();
```

Output:

```js
{
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
}
```

#### `array.maxItems(value: number): Schema`

Defines that an array should have a maximum number of items.

```js
var schema = sugar.array().items({
  value: sugar.number()
}).maxItems(2);

schema.generate();
```

Output:

```js
{
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
}
```

#### `array.uniqueItems(value: boolean): Schema`

Defines that items in an array should be unique.

```js
var schema = sugar.array().items({
  value: sugar.number()
}).uniqueItems(true);

schema.generate();
```

Output:

```js
{
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
}
```
