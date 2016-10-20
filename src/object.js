
import omit from 'lodash.omit';
import inherits from './utils/inherits';
import MixedSchema from './mixed';

export default function ObjectSchema() {
  if (!(this instanceof ObjectSchema)) {
    return new ObjectSchema();
  }

  MixedSchema.call(this, { type: 'object' });
}

inherits(ObjectSchema, MixedSchema, {
  _getJSONSchema() {
    const opts = this._getOptions();

    let requiredProperties = [],
        dependenciesProps = [],
        propDependenciesProps = [],
        dependencies = {},
        propDependencies = {},
        dependenciesKeys,
        propDependenciesKeys,
        filteredDependencies = {};

    let schema = {
      type: 'object'
    };

    if (opts.keys != null) {
      schema.properties = Object.keys(opts.keys).reduce((obj, key) => {
        const valueType = opts.keys[key];

        let typeOpts,
            generatedSchema;

        // ignore values that are not schemas
        if (!(valueType instanceof MixedSchema)) {
          return obj;
        }

        typeOpts = valueType._getAllOptions();

        if (typeOpts.required === true) {
          requiredProperties.push(key);
        }

        if (Array.isArray(typeOpts.requiredWhen)) {
          typeOpts.requiredWhen.forEach((prop) => {
            if (propDependenciesProps.indexOf(prop) === -1 && prop !== key) {
              propDependenciesProps.push(prop);

              propDependencies[prop] = [];
            }

            // make sure that don't insert duplicate values
            if (Array.isArray(propDependencies[prop]) && propDependencies[prop].indexOf(key) === -1) {
              propDependencies[prop].push(key);
            }
          });
        }

        if (typeOpts.when != null) {
          let propDependant = typeOpts.when.prop,
              schemaExt = typeOpts.when.schema,
              schemaExtOpts = schemaExt._getAllOptions(),
              generatedSchemaExt;

          if (dependenciesProps.indexOf(propDependant) === -1 && propDependant !== key) {
            dependenciesProps.push(propDependant);

            dependencies[propDependant] = {
              properties: {}
            };
          }

          generatedSchemaExt = schemaExt.generate({ obj: true });

          if (Object.keys(generatedSchemaExt).length > 0) {
            dependencies[propDependant].properties[key] = generatedSchemaExt;
          }

          if (schemaExtOpts.required === true) {
            if (dependencies[propDependant].required == null) {
              dependencies[propDependant].required = [];
            }

            if (dependencies[propDependant].required.indexOf(key) === -1) {
              dependencies[propDependant].required.push(key);
            }
          }
        }

        generatedSchema = valueType.generate({ obj: true });

        // don't add empty schemas
        if (Object.keys(generatedSchema).length > 0) {
          // eslint-disable-next-line no-param-reassign
          obj[key] = generatedSchema;
        }

        return obj;
      }, {});

      if (requiredProperties.length > 0) {
        schema.required = requiredProperties;
      }

      dependenciesKeys = Object.keys(dependencies);
      propDependenciesKeys = Object.keys(propDependencies);

      if (dependenciesKeys.length > 0 && propDependenciesKeys.length > 0) {
        let filteredDep,
            filteredPropDep,
            restPropDep;

        filteredDep = filterDependencies(dependenciesKeys, dependencies);
        filteredPropDep = filterPropDependencies(propDependenciesKeys, propDependencies);

        restPropDep = omit(filteredPropDep, Object.keys(filteredDep));

        filteredDependencies = Object.keys(filteredDep).reduce((obj, key) => {
          if (filteredPropDep[key] != null) {
            if (!Array.isArray(filteredDep[key].required)) {
              filteredDep[key].required = filteredPropDep[key];
            } else {
              filteredPropDep[key].forEach((propDepValue) => {
                if (filteredDep[key].required.indexOf(propDepValue) === -1) {
                  filteredDep[key].required.push(propDepValue);
                }
              });
            }
          }

          // eslint-disable-next-line no-param-reassign
          obj[key] = filteredDep[key];
          return obj;
        }, {});

        filteredDependencies = Object.keys(restPropDep).reduce((obj, key) => {
          // eslint-disable-next-line no-param-reassign
          obj[key] = restPropDep[key];
          return obj;
        }, filteredDependencies);
      } else if (dependenciesKeys.length > 0) {
        filteredDependencies = filterDependencies(dependenciesKeys, dependencies);
      } else if (propDependenciesKeys.length > 0) {
        filteredDependencies = filterPropDependencies(propDependenciesKeys, propDependencies);
      }

      if (Object.keys(filteredDependencies).length > 0) {
        schema.dependencies = filteredDependencies;
      }
    }

    if (opts.additionalProperties != null) {
      if (opts.additionalProperties instanceof MixedSchema) {
        let generatedSchema = opts.additionalProperties.generate({ obj: true });

        if (Object.keys(generatedSchema).length > 0) {
          schema.additionalProperties = generatedSchema;
        }
      } else {
        schema.additionalProperties = opts.additionalProperties;
      }
    }

    if (opts.patternProperties != null) {
      let patternProperties = {};

      Object.keys(opts.patternProperties).forEach((prop) => {
        const propSchema = opts.patternProperties[prop];

        if (propSchema instanceof MixedSchema) {
          let generatedSchema = propSchema.generate({ obj: true });

          patternProperties[prop] = generatedSchema;
        }
      });

      if (Object.keys(patternProperties).length > 0) {
        schema.patternProperties = patternProperties;
      }
    }

    if (opts.minProperties != null) {
      schema.minProperties = opts.minProperties;
    }

    if (opts.maxProperties != null) {
      schema.maxProperties = opts.maxProperties;
    }

    return schema;
  },

  keys(value) {
    this._setOption('keys', value);
    return this.instance();
  },

  additionalProperties(value) {
    this._setOption('additionalProperties', value);
    return this.instance();
  },

  patternProperties(value) {
    this._setOption('patternProperties', value);
    return this.instance();
  },

  minProperties(value) {
    this._setOption('minProperties', value);
    return this.instance();
  },

  maxProperties(value) {
    this._setOption('maxProperties', value);
    return this.instance();
  }
});

function filterDependencies(dependenciesKeys, dependencies) {
  return dependenciesKeys.reduce((obj, key) => {
    if (Object.keys(dependencies[key].properties).length === 0) {
      return obj;
    }

    // eslint-disable-next-line no-param-reassign
    obj[key] = dependencies[key];
    return obj;
  }, {});
}

function filterPropDependencies(propDependenciesKeys, propDependencies) {
  return propDependenciesKeys.reduce((obj, key) => {
    if (propDependencies[key].length === 0) {
      return obj;
    }

    // eslint-disable-next-line no-param-reassign
    obj[key] = propDependencies[key];
    return obj;
  }, {});
}
