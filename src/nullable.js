
import inherits from './utils/inherits';
import MixedSchema from './mixed';

export default function NullableSchema() {
  if (!(this instanceof NullableSchema)) {
    return new NullableSchema();
  }

  MixedSchema.call(this, { type: 'null' });
}

inherits(NullableSchema, MixedSchema, {
  _getJSONSchema() {
    return {
      type: 'null'
    };
  }
});
