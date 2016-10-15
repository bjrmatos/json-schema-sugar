
import inherits from './utils/inherits';
import MixedSchema from './mixed';

export default function BooleanSchema() {
  if (!(this instanceof BooleanSchema)) {
    return new BooleanSchema();
  }

  MixedSchema.call(this, { type: 'boolean' });
}

inherits(BooleanSchema, MixedSchema, {
  _getJSONSchema() {
    return {
      type: 'boolean'
    };
  }
});
