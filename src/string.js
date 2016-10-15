
import inherits from './utils/inherits';
import MixedSchema from './mixed';

export default function StringSchema() {
  if (!(this instanceof StringSchema)) {
    return new StringSchema();
  }

  MixedSchema.call(this, { type: 'string' });
}

inherits(StringSchema, MixedSchema, {
  _getJSONSchema() {
    const opts = this._getOptions();

    let schema = {
      type: 'string'
    };

    if (opts.minLength != null) {
      schema.minLength = opts.minLength;
    }

    if (opts.maxLength != null) {
      schema.maxLength = opts.maxLength;
    }

    if (opts.pattern != null) {
      schema.pattern = opts.pattern;
    }

    return schema;
  },

  minLength(value) {
    this._setOption('minLength', value);
    return this;
  },

  maxLength(value) {
    this._setOption('maxLength', value);
    return this;
  },

  pattern(_value) {
    let value = _value;

    if (value instanceof RegExp) {
      value = value.toString().slice(1, -1);
    }

    this._setOption('pattern', value);
    return this;
  },

  format(value) {
    this._setOption('format', value);
    return this;
  }
});
