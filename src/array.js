
import isPlainObj from 'is-plain-obj';
import inherits from './utils/inherits';
import ObjectSchema from './object';
import MixedSchema from './mixed';

export default function ArraySchema() {
  if (!(this instanceof ArraySchema)) {
    return new ArraySchema();
  }

  MixedSchema.call(this, { type: 'array' });
}

inherits(ArraySchema, MixedSchema, {
  _getJSONSchema() {
    const opts = this._getOptions();

    let schema = {
      type: 'array'
    };

    if (opts.items != null) {
      if (Array.isArray(opts.items)) {
        let itemsSchema = [];

        opts.items.forEach((item) => {
          let itemType = item;

          if (isPlainObj(item)) {
            itemType = new ObjectSchema().keys(item);
          }

          if (itemType instanceof MixedSchema) {
            let generatedSchema = itemType.generate({ obj: true });

            if (Object.keys(generatedSchema).length > 0) {
              itemsSchema.push(generatedSchema);
            }
          }
        });

        if (itemsSchema.length > 0) {
          schema.items = itemsSchema;
        }
      } else if (isPlainObj(opts.items) || opts.items instanceof MixedSchema) {
        let itemsType = opts.items,
            generatedSchema;

        if (isPlainObj(itemsType)) {
          itemsType = new ObjectSchema().keys(itemsType);
        }

        generatedSchema = itemsType.generate({ obj: true });

        if (Object.keys(generatedSchema).length > 0) {
          schema.items = generatedSchema;
        }
      }
    }

    if (opts.additionalItems != null) {
      schema.additionalItems = opts.additionalItems;
    }

    if (opts.minItems != null) {
      schema.minItems = opts.minItems;
    }

    if (opts.maxItems != null) {
      schema.maxItems = opts.maxItems;
    }

    if (opts.uniqueItems != null) {
      schema.uniqueItems = opts.uniqueItems;
    }

    return schema;
  },

  items(value) {
    this._setOption('items', value);
    return this.instance();
  },

  additionalItems(value) {
    this._setOption('additionalItems', value);
    return this.instance();
  },

  minItems(value) {
    this._setOption('minItems', value);
    return this.instance();
  },

  maxItems(value) {
    this._setOption('maxItems', value);
    return this.instance();
  },

  uniqueItems(value) {
    this._setOption('uniqueItems', value);
    return this.instance();
  }
});
