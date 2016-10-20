
import inherits from './utils/inherits';
import MixedSchema from './mixed';

export default function NumberSchema() {
  if (!(this instanceof NumberSchema)) {
    return new NumberSchema();
  }

  MixedSchema.call(this, { type: 'number' });
}

inherits(NumberSchema, MixedSchema, {
  _getJSONSchema() {
    const opts = this._getOptions();

    let schema,
        type = 'number';

    if (opts.isInteger === true) {
      type = 'integer';
    }

    schema = {
      type
    };

    if (opts.multipleOf != null) {
      schema.multipleOf = opts.multipleOf;
    }

    if (opts.minimum != null) {
      schema.minimum = opts.minimum;
    }

    if (opts.maximum != null) {
      schema.maximum = opts.maximum;
    }

    if (opts.exclusiveMinimum != null) {
      schema.exclusiveMinimum = opts.exclusiveMinimum;
    }

    if (opts.exclusiveMaximum != null) {
      schema.exclusiveMaximum = opts.exclusiveMaximum;
    }

    return schema;
  },

  integer() {
    this._setOption('isInteger', true);
    return this.instance();
  },

  multipleOf(value) {
    this._setOption('multipleOf', value);
    return this.instance();
  },

  minimum(value) {
    this._setOption('minimum', value);
    return this.instance();
  },

  maximum(value) {
    this._setOption('maximum', value);
    return this.instance();
  },

  exclusiveMinimum(value) {
    this._setOption('exclusiveMinimum', value);
    return this.instance();
  },

  exclusiveMaximum(value) {
    this._setOption('exclusiveMaximum', value);
    return this.instance();
  }
});
