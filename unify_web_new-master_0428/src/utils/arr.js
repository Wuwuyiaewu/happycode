var toString = Object.prototype.toString

function kindOf (val) {
    if (val === void 0) return 'undefined'
    if (val === null) return 'null'

    var type = typeof val
    if (type === 'boolean') return 'boolean'
    if (type === 'string') return 'string'
    if (type === 'number') return 'number'
    if (type === 'symbol') return 'symbol'
    if (type === 'function') {
        return isGeneratorFn(val) ? 'generatorfunction' : 'function'
    }

    if (isArray(val)) return 'array'
    if (isBuffer(val)) return 'buffer'
    if (isArguments(val)) return 'arguments'
    if (isDate(val)) return 'date'
    if (isError(val)) return 'error'
    if (isRegexp(val)) return 'regexp'

    switch (ctorName(val)) {
    case 'Symbol':
        return 'symbol'
    case 'Promise':
        return 'promise'

        // Set, Map, WeakSet, WeakMap
    case 'WeakMap':
        return 'weakmap'
    case 'WeakSet':
        return 'weakset'
    case 'Map':
        return 'map'
    case 'Set':
        return 'set'

        // 8-bit typed arrays
    case 'Int8Array':
        return 'int8array'
    case 'Uint8Array':
        return 'uint8array'
    case 'Uint8ClampedArray':
        return 'uint8clampedarray'

        // 16-bit typed arrays
    case 'Int16Array':
        return 'int16array'
    case 'Uint16Array':
        return 'uint16array'

        // 32-bit typed arrays
    case 'Int32Array':
        return 'int32array'
    case 'Uint32Array':
        return 'uint32array'
    case 'Float32Array':
        return 'float32array'
    case 'Float64Array':
        return 'float64array'
    }

    if (isGeneratorObj(val)) {
        return 'generator'
    }

    // Non-plain objects
    type = toString.call(val)
    switch (type) {
    case '[object Object]':
        return 'object'
        // iterators
    case '[object Map Iterator]':
        return 'mapiterator'
    case '[object Set Iterator]':
        return 'setiterator'
    case '[object String Iterator]':
        return 'stringiterator'
    case '[object Array Iterator]':
        return 'arrayiterator'
    }

    // other
    return type.slice(8, -1).toLowerCase().replace(/\s/g, '')
};

function ctorName (val) {
    return typeof val.constructor === 'function' ? val.constructor.name : null
}

function isArray (val) {
    if (Array.isArray) return Array.isArray(val)
    return val instanceof Array
}

function isError (val) {
    return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number')
}

function isDate (val) {
    if (val instanceof Date) return true
    return typeof val.toDateString === 'function' &&
        typeof val.getDate === 'function' &&
        typeof val.setDate === 'function'
}

function isRegexp (val) {
    if (val instanceof RegExp) return true
    return typeof val.flags === 'string' &&
        typeof val.ignoreCase === 'boolean' &&
        typeof val.multiline === 'boolean' &&
        typeof val.global === 'boolean'
}

function isGeneratorFn (name, val) {
    return ctorName(name) === 'GeneratorFunction'
}

function isGeneratorObj (val) {
    return typeof val.throw === 'function' &&
        typeof val.return === 'function' &&
        typeof val.next === 'function'
}

function isArguments (val) {
    try {
        if (typeof val.length === 'number' && typeof val.callee === 'function') {
            return true
        }
    } catch (err) {
        if (err.message.indexOf('callee') !== -1) {
            return true
        }
    }
    return false
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer (val) {
    if (val.constructor && typeof val.constructor.isBuffer === 'function') {
        return val.constructor.isBuffer(val)
    }
    return false
}

function makeIterator (target, thisArg) {
    switch (kindOf(target)) {
    case 'undefined':
    case 'null':
        return noop
    case 'function':
        // function is the first to improve perf (most common case)
        // also avoid using `Function#call` if not needed, which boosts
        // perf a lot in some cases
        return (typeof thisArg !== 'undefined') ? function (val, i, arr) {
            return target.call(thisArg, val, i, arr)
        } : target
    case 'object':
        return function (val) {
            return deepMatches(val, target)
        }
    case 'regexp':
        return function (str) {
            return target.test(str)
        }
    case 'string':
    case 'number':
    default: {
        return prop(target)
    }
    }
};

function containsMatch (array, value) {
    var len = array.length
    var i = -1

    while (++i < len) {
        if (deepMatches(array[i], value)) {
            return true
        }
    }
    return false
}

function matchArray (arr, value) {
    var len = value.length
    var i = -1

    while (++i < len) {
        if (!containsMatch(arr, value[i])) {
            return false
        }
    }
    return true
}

function matchObject (obj, value) {
    for (var key in value) {
        if (value.hasOwnProperty(key)) {
            if (deepMatches(obj[key], value[key]) === false) {
                return false
            }
        }
    }
    return true
}

/**
 * Recursively compare objects
 */

function deepMatches (val, value) {
    if (kindOf(val) === 'object') {
        if (Array.isArray(val) && Array.isArray(value)) {
            return matchArray(val, value)
        } else {
            return matchObject(val, value)
        }
    } else {
        return val === value
    }
}

function prop (name) {
    return function (obj) {
        return obj[name]
    }
}

function noop (val) {
    return val
}

function map (arr, fn, thisArg) {
    if (arr == null) return []
    fn = makeIterator(fn, thisArg)

    var len = arr.length
    var res = new Array(len)

    for (var i = 0; i < len; i++) {
        res[i] = fn(arr[i], i, arr)
    }
    return res
};

export function pluck (arr, prop) {
    return map(arr, prop)
}

export function filter (arr, fn, thisArg) {
    if (arr == null) {
        return []
    }

    if (typeof fn !== 'function') {
        throw new TypeError('expected callback to be a function')
    }

    var iterator = makeIterator(fn, thisArg)
    var len = arr.length
    var res = arr.slice()
    var i = -1

    while (len--) {
        if (!iterator(arr[len], i++)) {
            res.splice(len, 1)
        }
    }
    return res
}
export function reduce (arr, cb, initial) {
    // idea for args length to ensure initial value from github.com/mout/mout
    var init = arguments.length > 2
    if (arr == null) {
        if (init) {
            return initial
        } else {
            throw new Error('arr-reduce expects an array or initial value')
        }
    }

    var len = arr.length
    var res = initial
    if (!arr.length) return initial

    for (var i = 0; i < len; i++) {
        if (!init) {
            res = arr[i]
            init = true
        } else {
            res = cb(res, arr[i], i, arr)
        }
    }
    return res
}
