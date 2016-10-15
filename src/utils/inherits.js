
import assign from 'object-assign';

export default function inherits(ctor, superCtor, spec) {
  // disabling eslint rule because it doesn't apply for this case
  // eslint-disable-next-line no-param-reassign
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  assign(ctor.prototype, spec);
}
