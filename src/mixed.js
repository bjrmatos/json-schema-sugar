// @flow

import assign from 'object-assign';
import isPlainObj from 'is-plain-obj';
import cloneDeep from './utils/clone';

export default function SchemaType(options = {}) {
  if (!(this instanceof SchemaType)) {
    return new SchemaType();
  }

  this._options = {};

  this._type = options.type || 'mixed';

  if (this._type != null && this._type !== 'mixed') {
    this._options[this._type] = {};
  }

  if (this._type === 'mixed') {
    this.canBe = (...args) => {
      let types;

      if (Array.isArray(args[0])) {
        types = args[0];
      } else {
        types = args;
      }

      this._setOption('types', types);

      return this.instance();
    };

    this.ref = (value) => {
      this._setOption('ref', value, true);
      return this.instance();
    };
  }
}

SchemaType.prototype = {
  __isJsonSchemaSugar__: true,

  constructor: SchemaType,

  _getAllOptions() {
    return this._options;
  },

  _getOptions() {
    if (this._type != null && this._type !== 'mixed') {
      return this._options[this._type];
    }

    return this._options;
  },

  _setOption(optName, value, isRootOpt) {
    let localOpts;

    if (isRootOpt === true) {
      localOpts = this._getAllOptions();
    } else {
      localOpts = this._getOptions();
    }

    localOpts[optName] = value;
  },

  // return a new instance
  instance() {
    return this.clone();
  },

  // clone the shema
  clone() {
    return cloneDeep(this);
  },

  title(value) {
    this._setOption('title', value, true);
    return this.instance();
  },

  description(value) {
    this._setOption('description', value, true);
    return this.instance();
  },

  default(value) {
    this._setOption('default', value, true);
    return this.instance();
  },

  enum(value) {
    this._setOption('enum', value, true);
    return this.instance();
  },

  required() {
    this._setOption('required', true, true);
    return this.instance();
  },

  // property dependencies
  requiredWhen(...args) {
    let presentProps;

    if (Array.isArray(args[0])) {
      presentProps = args[0];
    } else {
      presentProps = args;
    }

    this._setOption('requiredWhen', presentProps, true);
    return this.instance();
  },

  // schema dependencies
  when(dependantProp, schema) {
    if (!(schema instanceof SchemaType)) {
      throw new Error('second parameter of `.when()` must be a schema');
    }

    this._setOption('when', {
      prop: dependantProp,
      schema
    }, true);

    return this.instance();
  },

  // definitions of sub-schemas
  definitions(value) {
    this._setOption('definitions', value, true);
    return this.instance();
  },

  allOf(value) {
    this._setOption('allOf', value, true);
    return this.instance();
  },

  anyOf(value) {
    this._setOption('anyOf', value, true);
    return this.instance();
  },

  oneOf(value) {
    this._setOption('oneOf', value, true);
    return this.instance();
  },

  not(value) {
    this._setOption('not', value, true);
    return this.instance();
  },

  noType(value) {
    this._setOption('noType', value, true);
    return this.instance();
  },

  generate(generateOptions = {}) {
    const schema = this,
          rootOpts = this._getAllOptions(),
          getObj = generateOptions.obj,
          removeType = generateOptions.removeType,
          space = generateOptions.space,
          $schema = generateOptions.$schema,
          id = generateOptions.id;

    let jsonSchema = {},
        opts;

    if ($schema != null) {
      jsonSchema.$schema = $schema;
    }

    if (id != null) {
      jsonSchema.id = id;
    }

    if (this._type === 'mixed') {
      opts = this._getOptions();

      if (Array.isArray(opts.types)) {
        jsonSchema.type = [];

        opts.types.forEach((type) => {
          if (type instanceof SchemaType) {
            let generatedSchema = type.generate({ obj: true });

            if (Object.keys(generatedSchema).length > 0) {
              jsonSchema.type.push(
                generatedSchema.type
              );
            }
          } else {
            jsonSchema.type.push(type);
          }
        });
      }

      if (opts.ref != null) {
        jsonSchema.$ref = opts.ref;
      }

      addMixedProps(jsonSchema, rootOpts);

      if (rootOpts.noType === true || removeType === true) {
        delete jsonSchema.type;
      }

      if (getObj === true) {
        return jsonSchema;
      }

      return JSON.stringify(jsonSchema, null, space);
    }

    if (typeof schema._getJSONSchema !== 'function') {
      if (getObj === true) {
        return {};
      }

      return '{}';
    }

    jsonSchema = assign(jsonSchema, schema._getJSONSchema());

    addMixedProps(jsonSchema, rootOpts);

    if (rootOpts.noType === true || removeType === true) {
      delete jsonSchema.type;
    }

    if (getObj === true) {
      return jsonSchema;
    }

    return JSON.stringify(jsonSchema, null, space);
  }
};

function addMixedProps(jsonSchema, opts) {
  if (opts.title != null) {
    // eslint-disable-next-line no-param-reassign
    jsonSchema.title = opts.title;
  }

  if (opts.description != null) {
    // eslint-disable-next-line no-param-reassign
    jsonSchema.description = opts.description;
  }

  if (opts.default !== undefined) {
    // eslint-disable-next-line no-param-reassign
    jsonSchema.default = opts.default;
  }

  if (Array.isArray(opts.enum)) {
    // eslint-disable-next-line no-param-reassign
    jsonSchema.enum = opts.enum;
  }

  if (opts.definitions != null) {
    let definitionsSchema = opts.definitions,
        filteredDefinitions = {};

    if (isPlainObj(definitionsSchema)) {
      filteredDefinitions = Object.keys(definitionsSchema).reduce((obj, key) => {
        const type = definitionsSchema[key];

        let generatedSchema;

        if (type instanceof SchemaType) {
          generatedSchema = type.generate({ obj: true });

          if (Object.keys(generatedSchema).length > 0) {
            // eslint-disable-next-line no-param-reassign
            obj[key] = generatedSchema;
          }
        }

        return obj;
      }, {});

      if (Object.keys(filteredDefinitions).length > 0) {
        // eslint-disable-next-line no-param-reassign
        jsonSchema.definitions = filteredDefinitions;
      }
    }
  }

  if (Array.isArray(opts.allOf)) {
    let allOfSchemas = [],
        generatedSchema;

    opts.allOf.forEach((type, index) => {
      if (type instanceof SchemaType) {
        if (index === 0) {
          generatedSchema = type.generate({ obj: true });
        } else {
          generatedSchema = type.generate({ obj: true, removeType: true });
        }

        if (Object.keys(generatedSchema).length > 0) {
          allOfSchemas.push(generatedSchema);
        }
      }
    });

    if (allOfSchemas.length > 0) {
      // eslint-disable-next-line no-param-reassign
      jsonSchema.allOf = allOfSchemas;
    }
  }

  if (Array.isArray(opts.anyOf)) {
    let anyOfSchemas = [],
        generatedSchema;

    opts.anyOf.forEach((type) => {
      if (type instanceof SchemaType) {
        generatedSchema = type.generate({ obj: true });

        if (Object.keys(generatedSchema).length > 0) {
          anyOfSchemas.push(generatedSchema);
        }
      }
    });

    if (anyOfSchemas.length > 0) {
      // eslint-disable-next-line no-param-reassign
      jsonSchema.anyOf = anyOfSchemas;
    }
  }

  if (Array.isArray(opts.oneOf)) {
    let oneOfSchemas = [],
        generatedSchema;

    opts.oneOf.forEach((type) => {
      if (type instanceof SchemaType) {
        // when there is no type
        if (jsonSchema.type == null) {
          generatedSchema = type.generate({ obj: true });
        } else {
          generatedSchema = type.generate({ obj: true, removeType: true });
        }

        if (Object.keys(generatedSchema).length > 0) {
          oneOfSchemas.push(generatedSchema);
        }
      }
    });

    if (oneOfSchemas.length > 0) {
      // eslint-disable-next-line no-param-reassign
      jsonSchema.oneOf = oneOfSchemas;
    }
  }

  if (opts.not != null) {
    let generatedSchema;

    if (opts.not instanceof SchemaType) {
      generatedSchema = opts.not.generate({ obj: true });

      if (Object.keys(generatedSchema).length > 0) {
        // eslint-disable-next-line no-param-reassign
        jsonSchema.not = generatedSchema;
      }
    }
  }
}
