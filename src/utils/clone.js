
// Copyright (c) 2011-2014, Walmart and other contributors.
// Copyright (c) 2011, Yahoo Inc.
// All rights reserved. https://github.com/hapijs/hoek/blob/master/LICENSE

import isSchema from './isSchema';

export default function clone(obj, _seen) {
  let seen = _seen,
      isFirst = !seen,
      isImmutable = isSchema(obj) && !isFirst;

  if (typeof obj !== 'object' || obj === null || isImmutable) {
    return obj;
  }

  seen = seen || { orig: [], copy: [] };

  let lookup = seen.orig.indexOf(obj);

  if (lookup !== -1) {
    return seen.copy[lookup];
  }

  let newObj,
      cloneDeep = false,
      proto;

  if (!Array.isArray(obj)) {
    if (obj instanceof Date) {
      newObj = new Date(obj.getTime());
    } else if (obj instanceof RegExp) {
      newObj = new RegExp(obj);
    } else {
      proto = Object.getPrototypeOf(obj);

      if (proto !== null && !proto) {
        newObj = obj;
      } else {
        newObj = Object.create(proto);
        cloneDeep = true;
      }
    }
  } else {
    newObj = [];
    cloneDeep = true;
  }

  seen.orig.push(obj);
  seen.copy.push(newObj);

  if (cloneDeep) {
    let keys = Object.getOwnPropertyNames(obj);

    for (let i = 0, il = keys.length; i < il; ++i) {
      let key = keys[i];

      let descriptor = Object.getOwnPropertyDescriptor(obj, key);

      if (descriptor.get || descriptor.set) {
        Object.defineProperty(newObj, key, descriptor);
      } else {
        newObj[key] = clone(obj[key], seen);
      }
    }
  }

  return newObj;
}
