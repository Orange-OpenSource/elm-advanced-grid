(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg = function (a) {
	return {$: 'GridMsg', a: a};
};
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$translations = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('Nom', 'Name'),
			_Utils_Tuple2('Progrès', 'Progress'),
			_Utils_Tuple2('Valeur 1', 'Value 1'),
			_Utils_Tuple2('Valeur 2', 'Value 2'),
			_Utils_Tuple2('Valeur 3', 'Value 3'),
			_Utils_Tuple2('Valeur 4', 'Value 4'),
			_Utils_Tuple2('Valeur 5', 'Value 5'),
			_Utils_Tuple2('Valeur 6', 'Value 6'),
			_Utils_Tuple2('Ville', 'City'),
			_Utils_Tuple2('Une indication pour la colonne Id', 'A hint for Id column'),
			_Utils_Tuple2('Une indication pour la colonne Nom', 'A hint for Name column'),
			_Utils_Tuple2('Une indication pour la colonne Valeur 1', 'A hint for Value column 1'),
			_Utils_Tuple2('Une indication pour la colonne Valeur 2', 'A hint for Value column 2'),
			_Utils_Tuple2('Une indication pour la colonne Valeur 3', 'A hint for Value column 3'),
			_Utils_Tuple2('Une indication pour la colonne Valeur 4', 'A hint for Value column 4'),
			_Utils_Tuple2('Une indication pour la colonne Valeur 5', 'A hint for Value column 5'),
			_Utils_Tuple2('Une indication pour la colonne Valeur 6', 'A hint for Value column 6'),
			_Utils_Tuple2('Une indication pour la colonne Progrès', 'A hint for Progress column'),
			_Utils_Tuple2('Une indication pour la colonne Ville', 'A hint for City column')
		]));
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize = function (key) {
	return A2(
		$elm$core$Maybe$withDefault,
		key,
		A2($elm$core$Dict$get, key, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$translations));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$StringFilter = function (a) {
	return {$: 'StringFilter', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Unsorted = {$: 'Unsorted'};
var $Orange_OpenSource$elm_advanced_grid$Grid$compareFields = F3(
	function (dataValue, item1, item2) {
		return A2(
			$elm$core$Basics$compare,
			dataValue(item1),
			dataValue(item2));
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$Contains = function (a) {
	return {$: 'Contains', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$Equals = function (a) {
	return {$: 'Equals', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$GreaterThan = function (a) {
	return {$: 'GreaterThan', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$LessThan = function (a) {
	return {$: 'LessThan', a: a};
};
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 'Good', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$Good, false, a, s);
		});
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$containsParser = $elm$parser$Parser$succeed($elm$core$Basics$identity);
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 'Bad', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0.a;
		var parseB = _v1.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v2 = parseA(s0);
				if (_v2.$ === 'Bad') {
					var p = _v2.a;
					var x = _v2.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v2.a;
					var a = _v2.b;
					var s1 = _v2.c;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3(
							$elm$parser$Parser$Advanced$Good,
							p1 || p2,
							A2(func, a, b),
							s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.offset, offset) < 0,
					_Utils_Tuple0,
					{col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
		});
};
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return _Utils_eq(
			c,
			_Utils_chr(' ')) || (_Utils_eq(
			c,
			_Utils_chr('\n')) || _Utils_eq(
			c,
			_Utils_chr('\r')));
	});
var $elm$parser$Parser$spaces = $elm$parser$Parser$Advanced$spaces;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 'ExpectingSymbol', a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 'Token', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 'AddRight', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {col: col, contextStack: contextStack, problem: problem, row: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 'Empty'};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$not = _Basics_not;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$equalityParser = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$spaces),
		$elm$parser$Parser$symbol('=')),
	$elm$parser$Parser$spaces);
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$greaterThanParser = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$spaces),
		$elm$parser$Parser$symbol('>')),
	$elm$parser$Parser$spaces);
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$lessThanParser = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$spaces),
		$elm$parser$Parser$symbol('<')),
	$elm$parser$Parser$spaces);
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 'Append', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
		});
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$operandParser = function (valueParser) {
	return A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($Orange_OpenSource$elm_advanced_grid$Grid$Parsers$Equals),
						$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$equalityParser),
					valueParser),
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($Orange_OpenSource$elm_advanced_grid$Grid$Parsers$GreaterThan),
						$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$greaterThanParser),
					valueParser),
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($Orange_OpenSource$elm_advanced_grid$Grid$Parsers$LessThan),
						$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$lessThanParser),
					valueParser),
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($Orange_OpenSource$elm_advanced_grid$Grid$Parsers$Contains),
						$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$containsParser),
					valueParser)
				])));
};
var $elm$parser$Parser$Forbidden = {$: 'Forbidden'};
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize = F2(
	function (key, translations) {
		return A2(
			$elm$core$Maybe$withDefault,
			key,
			A2($elm$core$Dict$get, key, translations));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$or = 'or';
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$orKeyword = function (labels) {
	return ' ' + (A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$or, labels) + ' ');
};
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parseA(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					var _v2 = callback(a);
					var parseB = _v2.a;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0.a;
			var _v1 = parse(s0);
			if (_v1.$ === 'Good') {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (step.$ === 'Loop') {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
			});
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						func(a),
						s1);
				} else {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				}
			});
	});
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$Advanced$revAlways = F2(
	function (_v0, b) {
		return b;
	});
var $elm$parser$Parser$Advanced$skip = F2(
	function (iParser, kParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$parser$Parser$Advanced$revAlways, iParser, kParser);
	});
var $elm$parser$Parser$Advanced$sequenceEndForbidden = F5(
	function (ender, ws, parseItem, sep, revItems) {
		var chompRest = function (item) {
			return A5(
				$elm$parser$Parser$Advanced$sequenceEndForbidden,
				ender,
				ws,
				parseItem,
				sep,
				A2($elm$core$List$cons, item, revItems));
		};
		return A2(
			$elm$parser$Parser$Advanced$skip,
			ws,
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$skip,
						sep,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							A2(
								$elm$parser$Parser$Advanced$map,
								function (item) {
									return $elm$parser$Parser$Advanced$Loop(
										A2($elm$core$List$cons, item, revItems));
								},
								parseItem))),
						A2(
						$elm$parser$Parser$Advanced$map,
						function (_v0) {
							return $elm$parser$Parser$Advanced$Done(
								$elm$core$List$reverse(revItems));
						},
						ender)
					])));
	});
var $elm$parser$Parser$Advanced$sequenceEndMandatory = F4(
	function (ws, parseItem, sep, revItems) {
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$map,
					function (item) {
						return $elm$parser$Parser$Advanced$Loop(
							A2($elm$core$List$cons, item, revItems));
					},
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						parseItem,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							ws,
							A2($elm$parser$Parser$Advanced$ignorer, sep, ws)))),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return $elm$parser$Parser$Advanced$Done(
							$elm$core$List$reverse(revItems));
					},
					$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0))
				]));
	});
var $elm$parser$Parser$Advanced$sequenceEndOptional = F5(
	function (ender, ws, parseItem, sep, revItems) {
		var parseEnd = A2(
			$elm$parser$Parser$Advanced$map,
			function (_v0) {
				return $elm$parser$Parser$Advanced$Done(
					$elm$core$List$reverse(revItems));
			},
			ender);
		return A2(
			$elm$parser$Parser$Advanced$skip,
			ws,
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$skip,
						sep,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							$elm$parser$Parser$Advanced$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$Advanced$map,
										function (item) {
											return $elm$parser$Parser$Advanced$Loop(
												A2($elm$core$List$cons, item, revItems));
										},
										parseItem),
										parseEnd
									])))),
						parseEnd
					])));
	});
var $elm$parser$Parser$Advanced$sequenceEnd = F5(
	function (ender, ws, parseItem, sep, trailing) {
		var chompRest = function (item) {
			switch (trailing.$) {
				case 'Forbidden':
					return A2(
						$elm$parser$Parser$Advanced$loop,
						_List_fromArray(
							[item]),
						A4($elm$parser$Parser$Advanced$sequenceEndForbidden, ender, ws, parseItem, sep));
				case 'Optional':
					return A2(
						$elm$parser$Parser$Advanced$loop,
						_List_fromArray(
							[item]),
						A4($elm$parser$Parser$Advanced$sequenceEndOptional, ender, ws, parseItem, sep));
				default:
					return A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							A2(
								$elm$parser$Parser$Advanced$skip,
								sep,
								A2(
									$elm$parser$Parser$Advanced$skip,
									ws,
									A2(
										$elm$parser$Parser$Advanced$loop,
										_List_fromArray(
											[item]),
										A3($elm$parser$Parser$Advanced$sequenceEndMandatory, ws, parseItem, sep))))),
						ender);
			}
		};
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2($elm$parser$Parser$Advanced$andThen, chompRest, parseItem),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return _List_Nil;
					},
					ender)
				]));
	});
var $elm$parser$Parser$Advanced$sequence = function (i) {
	return A2(
		$elm$parser$Parser$Advanced$skip,
		$elm$parser$Parser$Advanced$token(i.start),
		A2(
			$elm$parser$Parser$Advanced$skip,
			i.spaces,
			A5(
				$elm$parser$Parser$Advanced$sequenceEnd,
				$elm$parser$Parser$Advanced$token(i.end),
				i.spaces,
				i.item,
				$elm$parser$Parser$Advanced$token(i.separator),
				i.trailing)));
};
var $elm$parser$Parser$Advanced$Forbidden = {$: 'Forbidden'};
var $elm$parser$Parser$Advanced$Mandatory = {$: 'Mandatory'};
var $elm$parser$Parser$Advanced$Optional = {$: 'Optional'};
var $elm$parser$Parser$toAdvancedTrailing = function (trailing) {
	switch (trailing.$) {
		case 'Forbidden':
			return $elm$parser$Parser$Advanced$Forbidden;
		case 'Optional':
			return $elm$parser$Parser$Advanced$Optional;
		default:
			return $elm$parser$Parser$Advanced$Mandatory;
	}
};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 'Expecting', a: a};
};
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$sequence = function (i) {
	return $elm$parser$Parser$Advanced$sequence(
		{
			end: $elm$parser$Parser$toToken(i.end),
			item: i.item,
			separator: $elm$parser$Parser$toToken(i.separator),
			spaces: i.spaces,
			start: $elm$parser$Parser$toToken(i.start),
			trailing: $elm$parser$Parser$toAdvancedTrailing(i.trailing)
		});
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$orExpression = F2(
	function (labels, valueParser) {
		return $elm$parser$Parser$sequence(
			{
				end: '',
				item: valueParser,
				separator: $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$orKeyword(labels),
				spaces: $elm$parser$Parser$succeed(_Utils_Tuple0),
				start: '',
				trailing: $elm$parser$Parser$Forbidden
			});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$makeFilter = function (_v0) {
	var getter = _v0.getter;
	var verifiesExpression = _v0.verifiesExpression;
	var typedParser = _v0.typedParser;
	var labels = _v0.labels;
	return {
		filter: F2(
			function (value, item) {
				return A2(
					verifiesExpression,
					getter(item),
					value);
			}),
		parser: A2(
			$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$orExpression,
			labels,
			$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$operandParser(typedParser))
	};
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$String$toLower = _String_toLower;
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$containsString = F2(
	function (referenceString, searchedString) {
		return A2(
			$elm$core$String$contains,
			$elm$core$String$toLower(searchedString),
			$elm$core$String$toLower(referenceString));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$empty = 'Empty';
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$stringEquals = F3(
	function (labels, referenceString, searchedValue) {
		return _Utils_eq(
			$elm$core$String$toLower(referenceString),
			$elm$core$String$toLower(searchedValue)) || ((referenceString === '') && _Utils_eq(
			searchedValue,
			$elm$core$String$toLower(
				A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$empty, labels))));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$matchesOneStringOf = F3(
	function (labels, referenceString, operands) {
		return A2(
			$elm$core$List$any,
			function (parsedValue) {
				switch (parsedValue.$) {
					case 'Equals':
						var operandValue = parsedValue.a;
						return A3($Orange_OpenSource$elm_advanced_grid$Grid$Filters$stringEquals, labels, referenceString, operandValue);
					case 'Contains':
						var operandValue = parsedValue.a;
						return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$containsString, referenceString, operandValue);
					case 'GreaterThan':
						var operandValue = parsedValue.a;
						return _Utils_cmp(
							$elm$core$String$toLower(referenceString),
							$elm$core$String$toLower(operandValue)) > 0;
					default:
						var operandValue = parsedValue.a;
						return _Utils_cmp(
							$elm$core$String$toLower(referenceString),
							$elm$core$String$toLower(operandValue)) < 0;
				}
			},
			operands);
	});
var $elm$parser$Parser$Advanced$chompUntilEndOr = function (str) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v0 = A5(_Parser_findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v0.a;
			var newRow = _v0.b;
			var newCol = _v0.c;
			var adjustedOffset = (newOffset < 0) ? $elm$core$String$length(s.src) : newOffset;
			return A3(
				$elm$parser$Parser$Advanced$Good,
				_Utils_cmp(s.offset, adjustedOffset) < 0,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: adjustedOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$chompUntilEndOr = $elm$parser$Parser$Advanced$chompUntilEndOr;
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						A2(
							func,
							A3($elm$core$String$slice, s0.offset, s1.offset, s0.src),
							a),
						s1);
				}
			});
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$oneOrMoreWords = function (labels) {
	return $elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$chompUntilEndOr(
				$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$orKeyword(labels))));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$stringParser = function (labels) {
	return A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$oneOrMoreWords(labels));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$stringFilter = F2(
	function (getter, labels) {
		return $Orange_OpenSource$elm_advanced_grid$Grid$Filters$makeFilter(
			{
				getter: getter,
				labels: labels,
				typedParser: $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$stringParser(labels),
				verifiesExpression: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$matchesOneStringOf(labels)
			});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$UserDoubleClickedEditableCell = F4(
	function (a, b, c, d) {
		return {$: 'UserDoubleClickedEditableCell', a: a, b: b, c: c, d: d};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$List$appendIf = F3(
	function (condition, conditionalAttributes, attributeList) {
		return condition ? _Utils_ap(attributeList, conditionalAttributes) : attributeList;
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedLine = function (a) {
	return {$: 'UserClickedLine', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$Attribute = F3(
	function (a, b, c) {
		return {$: 'Attribute', a: a, b: b, c: c};
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$attribute = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$attribute, key, value),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$attribute = $rtfeldman$elm_css$VirtualDom$Styled$attribute;
var $Orange_OpenSource$elm_advanced_grid$Grid$cellId = F2(
	function (columnProperties, item) {
		return _Utils_ap(
			columnProperties.id,
			$elm$core$String$fromInt(item.visibleIndex));
	});
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$property = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$property, key, value),
			_List_Nil,
			'');
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$class = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('className');
var $rtfeldman$elm_css$Html$Styled$Attributes$id = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $rtfeldman$elm_css$VirtualDom$Styled$on = F2(
	function (eventName, handler) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$on, eventName, handler),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Events$on = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $rtfeldman$elm_css$Html$Styled$Events$onClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$cellAttributes = F2(
	function (properties, item) {
		return A3(
			$Orange_OpenSource$elm_advanced_grid$Grid$List$appendIf,
			_Utils_eq(properties.editor, $elm$core$Maybe$Nothing),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Events$onClick(
					$Orange_OpenSource$elm_advanced_grid$Grid$UserClickedLine(item))
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$id(
					A2($Orange_OpenSource$elm_advanced_grid$Grid$cellId, properties, item)),
					A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', properties.id),
					$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-cell')
				]));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$Node = F3(
	function (a, b, c) {
		return {$: 'Node', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$Node;
var $rtfeldman$elm_css$Html$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$node;
var $rtfeldman$elm_css$Html$Styled$div = $rtfeldman$elm_css$Html$Styled$node('div');
var $elm$core$Basics$neq = _Utils_notEqual;
var $rtfeldman$elm_css$Html$Styled$Events$onDoubleClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'dblclick',
		$elm$json$Json$Decode$succeed(msg));
};
var $rtfeldman$elm_css$VirtualDom$Styled$Unstyled = function (a) {
	return {$: 'Unstyled', a: a};
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $rtfeldman$elm_css$VirtualDom$Styled$text = function (str) {
	return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
		$elm$virtual_dom$VirtualDom$text(str));
};
var $rtfeldman$elm_css$Html$Styled$text = $rtfeldman$elm_css$VirtualDom$Styled$text;
var $rtfeldman$elm_css$Html$Styled$Attributes$title = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('title');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewString = F3(
	function (field, properties, item) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			A3(
				$Orange_OpenSource$elm_advanced_grid$Grid$List$appendIf,
				!_Utils_eq(properties.editor, $elm$core$Maybe$Nothing),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Events$onDoubleClick(
						A4(
							$Orange_OpenSource$elm_advanced_grid$Grid$UserDoubleClickedEditableCell,
							item,
							field,
							properties.id,
							A2($Orange_OpenSource$elm_advanced_grid$Grid$cellId, properties, item))),
						$rtfeldman$elm_css$Html$Styled$Attributes$title(
						field(item))
					]),
				A2($Orange_OpenSource$elm_advanced_grid$Grid$cellAttributes, properties, item)),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(
					field(item))
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$stringColumnConfig = F2(
	function (properties, labels) {
		var nestedDataGetter = A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.data;
			},
			properties.getter);
		var columnProperties = {
			editor: properties.editor,
			id: properties.id,
			order: $Orange_OpenSource$elm_advanced_grid$Grid$Unsorted,
			title: properties.localize(properties.title),
			tooltip: properties.localize(properties.tooltip),
			visible: true,
			width: properties.width
		};
		return {
			comparator: $Orange_OpenSource$elm_advanced_grid$Grid$compareFields(nestedDataGetter),
			filteringValue: $elm$core$Maybe$Nothing,
			filters: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$StringFilter(
				A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$stringFilter, properties.getter, labels)),
			hasQuickFilter: true,
			properties: columnProperties,
			renderer: $Orange_OpenSource$elm_advanced_grid$Grid$viewString(nestedDataGetter),
			toString: nestedDataGetter
		};
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$cityColumn = function (labels) {
	return A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$stringColumnConfig,
		{
			editor: $elm$core$Maybe$Nothing,
			getter: function ($) {
				return $.city;
			},
			id: 'City',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Ville',
			tooltip: 'Une indication pour la colonne Ville',
			width: 300
		},
		labels);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$IntFilter = function (a) {
	return {$: 'IntFilter', a: a};
};
var $elm$parser$Parser$ExpectingInt = {$: 'ExpectingInt'};
var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var $elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {col: s.col + (newOffset - s.offset), context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src};
	});
var $elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
var $elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
var $elm$parser$Parser$Advanced$consumeExp = F2(
	function (offset, src) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
			var eOffset = offset + 1;
			var expOffset = (A3($elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src)) ? (eOffset + 1) : eOffset;
			var newOffset = A2($elm$parser$Parser$Advanced$chompBase10, expOffset, src);
			return _Utils_eq(expOffset, newOffset) ? (-newOffset) : newOffset;
		} else {
			return offset;
		}
	});
var $elm$parser$Parser$Advanced$consumeDotAndExp = F2(
	function (offset, src) {
		return A3($elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2(
			$elm$parser$Parser$Advanced$consumeExp,
			A2($elm$parser$Parser$Advanced$chompBase10, offset + 1, src),
			src) : A2($elm$parser$Parser$Advanced$consumeExp, offset, src);
	});
var $elm$parser$Parser$Advanced$finalizeInt = F5(
	function (invalid, handler, startOffset, _v0, s) {
		var endOffset = _v0.a;
		var n = _v0.b;
		if (handler.$ === 'Err') {
			var x = handler.a;
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.offset, startOffset) < 0,
				A2($elm$parser$Parser$Advanced$fromState, s, invalid)) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				toValue(n),
				A2($elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
		}
	});
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$core$String$toFloat = _String_toFloat;
var $elm$parser$Parser$Advanced$finalizeFloat = F6(
	function (invalid, expecting, intSettings, floatSettings, intPair, s) {
		var intOffset = intPair.a;
		var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.src);
		if (floatOffset < 0) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A4($elm$parser$Parser$Advanced$fromInfo, s.row, s.col - (floatOffset + s.offset), invalid, s.context));
		} else {
			if (_Utils_eq(s.offset, floatOffset)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.offset, intPair, s);
				} else {
					if (floatSettings.$ === 'Err') {
						var x = floatSettings.a;
						return A2(
							$elm$parser$Parser$Advanced$Bad,
							true,
							A2($elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _v1 = $elm$core$String$toFloat(
							A3($elm$core$String$slice, s.offset, floatOffset, s.src));
						if (_v1.$ === 'Nothing') {
							return A2(
								$elm$parser$Parser$Advanced$Bad,
								true,
								A2($elm$parser$Parser$Advanced$fromState, s, invalid));
						} else {
							var n = _v1.a;
							return A3(
								$elm$parser$Parser$Advanced$Good,
								true,
								toValue(n),
								A2($elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
						}
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$number = function (c) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.offset, s.src)) {
				var zeroOffset = s.offset + 1;
				var baseOffset = zeroOffset + 1;
				return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.hex,
					baseOffset,
					A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.src),
					s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.octal,
					baseOffset,
					A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.src),
					s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.binary,
					baseOffset,
					A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.src),
					s) : A6(
					$elm$parser$Parser$Advanced$finalizeFloat,
					c.invalid,
					c.expecting,
					c._int,
					c._float,
					_Utils_Tuple2(zeroOffset, 0),
					s)));
			} else {
				return A6(
					$elm$parser$Parser$Advanced$finalizeFloat,
					c.invalid,
					c.expecting,
					c._int,
					c._float,
					A3($elm$parser$Parser$Advanced$consumeBase, 10, s.offset, s.src),
					s);
			}
		});
};
var $elm$parser$Parser$Advanced$int = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				binary: $elm$core$Result$Err(invalid),
				expecting: expecting,
				_float: $elm$core$Result$Err(invalid),
				hex: $elm$core$Result$Err(invalid),
				_int: $elm$core$Result$Ok($elm$core$Basics$identity),
				invalid: invalid,
				octal: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$int = A2($elm$parser$Parser$Advanced$int, $elm$parser$Parser$ExpectingInt, $elm$parser$Parser$ExpectingInt);
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$containsInt = F2(
	function (referenceInt, searchedInt) {
		return A2(
			$elm$core$String$contains,
			$elm$core$String$fromInt(searchedInt),
			$elm$core$String$fromInt(referenceInt));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$matchesOneIntOf = F2(
	function (referenceInt, operands) {
		return A2(
			$elm$core$List$any,
			function (parsedValue) {
				switch (parsedValue.$) {
					case 'Equals':
						var operandValue = parsedValue.a;
						return _Utils_eq(referenceInt, operandValue);
					case 'Contains':
						var operandValue = parsedValue.a;
						return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$containsInt, referenceInt, operandValue);
					case 'GreaterThan':
						var operandValue = parsedValue.a;
						return _Utils_cmp(referenceInt, operandValue) > 0;
					default:
						var operandValue = parsedValue.a;
						return _Utils_cmp(referenceInt, operandValue) < 0;
				}
			},
			operands);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$intFilter = F2(
	function (getter, labels) {
		return $Orange_OpenSource$elm_advanced_grid$Grid$Filters$makeFilter(
			{getter: getter, labels: labels, typedParser: $elm$parser$Parser$int, verifiesExpression: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$matchesOneIntOf});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewInt = F3(
	function (field, properties, item) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			A2($Orange_OpenSource$elm_advanced_grid$Grid$cellAttributes, properties, item),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(
					$elm$core$String$fromInt(
						field(item)))
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$intColumnConfig = F2(
	function (properties, labels) {
		var nestedDataGetter = A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.data;
			},
			properties.getter);
		var columnProperties = {
			editor: $elm$core$Maybe$Nothing,
			id: properties.id,
			order: $Orange_OpenSource$elm_advanced_grid$Grid$Unsorted,
			title: properties.localize(properties.title),
			tooltip: properties.localize(properties.tooltip),
			visible: true,
			width: properties.width
		};
		return {
			comparator: $Orange_OpenSource$elm_advanced_grid$Grid$compareFields(nestedDataGetter),
			filteringValue: $elm$core$Maybe$Nothing,
			filters: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$IntFilter(
				A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$intFilter, properties.getter, labels)),
			hasQuickFilter: true,
			properties: columnProperties,
			renderer: $Orange_OpenSource$elm_advanced_grid$Grid$viewInt(nestedDataGetter),
			toString: A2($elm$core$Basics$composeR, nestedDataGetter, $elm$core$String$fromInt)
		};
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$idColumn = function (labels) {
	return A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$intColumnConfig,
		{
			getter: function ($) {
				return $.id;
			},
			id: 'Id',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Id',
			tooltip: 'Une indication pour la colonne Id',
			width: 50
		},
		labels);
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$setName = F2(
	function (item, name) {
		var oldData = item.data;
		var newData = _Utils_update(
			oldData,
			{name: name});
		return _Utils_update(
			item,
			{data: newData});
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$nameColumn = function (labels) {
	return A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$stringColumnConfig,
		{
			editor: $elm$core$Maybe$Just(
				{fromString: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$setName, maxLength: 20}),
			getter: function ($) {
				return $.name;
			},
			id: 'Name',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$setName,
			title: 'Nom',
			tooltip: 'Une indication pour la colonne Nom',
			width: 100
		},
		labels);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$FloatFilter = function (a) {
	return {$: 'FloatFilter', a: a};
};
var $elm$parser$Parser$ExpectingFloat = {$: 'ExpectingFloat'};
var $elm$parser$Parser$Advanced$float = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				binary: $elm$core$Result$Err(invalid),
				expecting: expecting,
				_float: $elm$core$Result$Ok($elm$core$Basics$identity),
				hex: $elm$core$Result$Err(invalid),
				_int: $elm$core$Result$Ok($elm$core$Basics$toFloat),
				invalid: invalid,
				octal: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$float = A2($elm$parser$Parser$Advanced$float, $elm$parser$Parser$ExpectingFloat, $elm$parser$Parser$ExpectingFloat);
var $elm$core$String$fromFloat = _String_fromNumber;
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$containsFloat = F2(
	function (referenceFloat, searchedFloat) {
		return A2(
			$elm$core$String$contains,
			$elm$core$String$fromFloat(searchedFloat),
			$elm$core$String$fromFloat(referenceFloat));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$matchesOneFloatOf = F2(
	function (referenceFloat, operands) {
		return A2(
			$elm$core$List$any,
			function (parsedValue) {
				switch (parsedValue.$) {
					case 'Equals':
						var operandValue = parsedValue.a;
						return _Utils_eq(referenceFloat, operandValue);
					case 'Contains':
						var operandValue = parsedValue.a;
						return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$containsFloat, referenceFloat, operandValue);
					case 'GreaterThan':
						var operandValue = parsedValue.a;
						return _Utils_cmp(referenceFloat, operandValue) > 0;
					default:
						var operandValue = parsedValue.a;
						return _Utils_cmp(referenceFloat, operandValue) < 0;
				}
			},
			operands);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$floatFilter = F2(
	function (getter, labels) {
		return $Orange_OpenSource$elm_advanced_grid$Grid$Filters$makeFilter(
			{getter: getter, labels: labels, typedParser: $elm$parser$Parser$float, verifiesExpression: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$matchesOneFloatOf});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewFloat = F3(
	function (field, properties, item) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			A2($Orange_OpenSource$elm_advanced_grid$Grid$cellAttributes, properties, item),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(
					$elm$core$String$fromFloat(
						field(item)))
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig = F2(
	function (properties, labels) {
		var nestedDataGetter = A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.data;
			},
			properties.getter);
		var columnProperties = {
			editor: $elm$core$Maybe$Nothing,
			id: properties.id,
			order: $Orange_OpenSource$elm_advanced_grid$Grid$Unsorted,
			title: properties.localize(properties.title),
			tooltip: properties.localize(properties.tooltip),
			visible: true,
			width: properties.width
		};
		return {
			comparator: $Orange_OpenSource$elm_advanced_grid$Grid$compareFields(nestedDataGetter),
			filteringValue: $elm$core$Maybe$Nothing,
			filters: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$FloatFilter(
				A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$floatFilter, properties.getter, labels)),
			hasQuickFilter: true,
			properties: columnProperties,
			renderer: $Orange_OpenSource$elm_advanced_grid$Grid$viewFloat(nestedDataGetter),
			toString: A2($elm$core$Basics$composeR, nestedDataGetter, $elm$core$String$fromFloat)
		};
	});
var $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence = function (a) {
	return {$: 'UniversalSelectorSequence', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $rtfeldman$elm_css$Css$Structure$compactHelp = F2(
	function (declaration, _v0) {
		var keyframesByName = _v0.a;
		var declarations = _v0.b;
		switch (declaration.$) {
			case 'StyleBlockDeclaration':
				var _v2 = declaration.a;
				var properties = _v2.c;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'MediaRule':
				var styleBlocks = declaration.b;
				return A2(
					$elm$core$List$all,
					function (_v3) {
						var properties = _v3.c;
						return $elm$core$List$isEmpty(properties);
					},
					styleBlocks) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'SupportsRule':
				var otherDeclarations = declaration.b;
				return $elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'DocumentRule':
				return _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'PageRule':
				var properties = declaration.b;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'FontFace':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'Keyframes':
				var record = declaration.a;
				return $elm$core$String$isEmpty(record.declaration) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					A3($elm$core$Dict$insert, record.name, record.declaration, keyframesByName),
					declarations);
			case 'Viewport':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'CounterStyle':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			default:
				var tuples = declaration.a;
				return A2(
					$elm$core$List$all,
					function (_v4) {
						var properties = _v4.b;
						return $elm$core$List$isEmpty(properties);
					},
					tuples) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
		}
	});
var $rtfeldman$elm_css$Css$Structure$Keyframes = function (a) {
	return {$: 'Keyframes', a: a};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations = F2(
	function (keyframesByName, compactedDeclarations) {
		return A2(
			$elm$core$List$append,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var name = _v0.a;
					var decl = _v0.b;
					return $rtfeldman$elm_css$Css$Structure$Keyframes(
						{declaration: decl, name: name});
				},
				$elm$core$Dict$toList(keyframesByName)),
			compactedDeclarations);
	});
var $rtfeldman$elm_css$Css$Structure$compactStylesheet = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var declarations = _v0.declarations;
	var _v1 = A3(
		$elm$core$List$foldr,
		$rtfeldman$elm_css$Css$Structure$compactHelp,
		_Utils_Tuple2($elm$core$Dict$empty, _List_Nil),
		declarations);
	var keyframesByName = _v1.a;
	var compactedDeclarations = _v1.b;
	var finalDeclarations = A2($rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
	return {charset: charset, declarations: finalDeclarations, imports: imports, namespaces: namespaces};
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $rtfeldman$elm_css$Css$Structure$Output$charsetToString = function (charset) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (str) {
				return '@charset \"' + (str + '\"');
			},
			charset));
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString = function (expression) {
	return '(' + (expression.feature + (A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$append(': '),
			expression.value)) + ')'));
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString = function (mediaType) {
	switch (mediaType.$) {
		case 'Print':
			return 'print';
		case 'Screen':
			return 'screen';
		default:
			return 'speech';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString = function (mediaQuery) {
	var prefixWith = F3(
		function (str, mediaType, expressions) {
			return str + (' ' + A2(
				$elm$core$String$join,
				' and ',
				A2(
					$elm$core$List$cons,
					$rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString(mediaType),
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions))));
		});
	switch (mediaQuery.$) {
		case 'AllQuery':
			var expressions = mediaQuery.a;
			return A2(
				$elm$core$String$join,
				' and ',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions));
		case 'OnlyQuery':
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'only', mediaType, expressions);
		case 'NotQuery':
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'not', mediaType, expressions);
		default:
			var str = mediaQuery.a;
			return str;
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString = F2(
	function (name, mediaQuery) {
		return '@import \"' + (name + ($rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString(mediaQuery) + '\"'));
	});
var $rtfeldman$elm_css$Css$Structure$Output$importToString = function (_v0) {
	var name = _v0.a;
	var mediaQueries = _v0.b;
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			$rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString(name),
			mediaQueries));
};
var $rtfeldman$elm_css$Css$Structure$Output$namespaceToString = function (_v0) {
	var prefix = _v0.a;
	var str = _v0.b;
	return '@namespace ' + (prefix + ('\"' + (str + '\"')));
};
var $rtfeldman$elm_css$Css$Structure$Output$spaceIndent = '    ';
var $rtfeldman$elm_css$Css$Structure$Output$indent = function (str) {
	return _Utils_ap($rtfeldman$elm_css$Css$Structure$Output$spaceIndent, str);
};
var $rtfeldman$elm_css$Css$Structure$Output$noIndent = '';
var $rtfeldman$elm_css$Css$Structure$Output$emitProperty = function (str) {
	return str + ';';
};
var $rtfeldman$elm_css$Css$Structure$Output$emitProperties = function (properties) {
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeL, $rtfeldman$elm_css$Css$Structure$Output$indent, $rtfeldman$elm_css$Css$Structure$Output$emitProperty),
			properties));
};
var $elm$core$String$append = _String_append;
var $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString = function (_v0) {
	var str = _v0.a;
	return '::' + str;
};
var $rtfeldman$elm_css$Css$Structure$Output$combinatorToString = function (combinator) {
	switch (combinator.$) {
		case 'AdjacentSibling':
			return '+';
		case 'GeneralSibling':
			return '~';
		case 'Child':
			return '>';
		default:
			return '';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString = function (repeatableSimpleSelector) {
	switch (repeatableSimpleSelector.$) {
		case 'ClassSelector':
			var str = repeatableSimpleSelector.a;
			return '.' + str;
		case 'IdSelector':
			var str = repeatableSimpleSelector.a;
			return '#' + str;
		case 'PseudoClassSelector':
			var str = repeatableSimpleSelector.a;
			return ':' + str;
		default:
			var str = repeatableSimpleSelector.a;
			return '[' + (str + ']');
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString = function (simpleSelectorSequence) {
	switch (simpleSelectorSequence.$) {
		case 'TypeSelectorSequence':
			var str = simpleSelectorSequence.a.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
		case 'UniversalSelectorSequence':
			var repeatableSimpleSelectors = simpleSelectorSequence.a;
			return $elm$core$List$isEmpty(repeatableSimpleSelectors) ? '*' : A2(
				$elm$core$String$join,
				'',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors));
		default:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString = function (_v0) {
	var combinator = _v0.a;
	var sequence = _v0.b;
	return A2(
		$elm$core$String$join,
		' ',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$Output$combinatorToString(combinator),
				$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(sequence)
			]));
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorToString = function (_v0) {
	var simpleSelectorSequence = _v0.a;
	var chain = _v0.b;
	var pseudoElement = _v0.c;
	var segments = A2(
		$elm$core$List$cons,
		$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(simpleSelectorSequence),
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString, chain));
	var pseudoElementsString = A2(
		$elm$core$String$join,
		'',
		_List_fromArray(
			[
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString, pseudoElement))
			]));
	return A2(
		$elm$core$String$append,
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
				segments)),
		pseudoElementsString);
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock = F2(
	function (indentLevel, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		var selectorStr = A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Structure$Output$selectorToString,
				A2($elm$core$List$cons, firstSelector, otherSelectors)));
		return A2(
			$elm$core$String$join,
			'',
			_List_fromArray(
				[
					selectorStr,
					' {\n',
					indentLevel,
					$rtfeldman$elm_css$Css$Structure$Output$emitProperties(properties),
					'\n',
					indentLevel,
					'}'
				]));
	});
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration = function (decl) {
	switch (decl.$) {
		case 'StyleBlockDeclaration':
			var styleBlock = decl.a;
			return A2($rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock, $rtfeldman$elm_css$Css$Structure$Output$noIndent, styleBlock);
		case 'MediaRule':
			var mediaQueries = decl.a;
			var styleBlocks = decl.b;
			var query = A2(
				$elm$core$String$join,
				',\n',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString, mediaQueries));
			var blocks = A2(
				$elm$core$String$join,
				'\n\n',
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeL,
						$rtfeldman$elm_css$Css$Structure$Output$indent,
						$rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock($rtfeldman$elm_css$Css$Structure$Output$spaceIndent)),
					styleBlocks));
			return '@media ' + (query + (' {\n' + (blocks + '\n}')));
		case 'SupportsRule':
			return 'TODO';
		case 'DocumentRule':
			return 'TODO';
		case 'PageRule':
			return 'TODO';
		case 'FontFace':
			return 'TODO';
		case 'Keyframes':
			var name = decl.a.name;
			var declaration = decl.a.declaration;
			return '@keyframes ' + (name + (' {\n' + (declaration + '\n}')));
		case 'Viewport':
			return 'TODO';
		case 'CounterStyle':
			return 'TODO';
		default:
			return 'TODO';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrint = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var declarations = _v0.declarations;
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Output$charsetToString(charset),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$importToString, imports)),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$namespaceToString, namespaces)),
					A2(
					$elm$core$String$join,
					'\n\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration, declarations))
				])));
};
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $rtfeldman$elm_css$Css$Structure$CounterStyle = function (a) {
	return {$: 'CounterStyle', a: a};
};
var $rtfeldman$elm_css$Css$Structure$FontFace = function (a) {
	return {$: 'FontFace', a: a};
};
var $rtfeldman$elm_css$Css$Structure$PageRule = F2(
	function (a, b) {
		return {$: 'PageRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Selector = F3(
	function (a, b, c) {
		return {$: 'Selector', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlock = F3(
	function (a, b, c) {
		return {$: 'StyleBlock', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration = function (a) {
	return {$: 'StyleBlockDeclaration', a: a};
};
var $rtfeldman$elm_css$Css$Structure$SupportsRule = F2(
	function (a, b) {
		return {$: 'SupportsRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Viewport = function (a) {
	return {$: 'Viewport', a: a};
};
var $rtfeldman$elm_css$Css$Structure$MediaRule = F2(
	function (a, b) {
		return {$: 'MediaRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$mapLast = F2(
	function (update, list) {
		if (!list.b) {
			return list;
		} else {
			if (!list.b.b) {
				var only = list.a;
				return _List_fromArray(
					[
						update(only)
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$mapLast, update, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$withPropertyAppended = F2(
	function (property, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		return A3(
			$rtfeldman$elm_css$Css$Structure$StyleBlock,
			firstSelector,
			otherSelectors,
			_Utils_ap(
				properties,
				_List_fromArray(
					[property])));
	});
var $rtfeldman$elm_css$Css$Structure$appendProperty = F2(
	function (property, declarations) {
		if (!declarations.b) {
			return declarations;
		} else {
			if (!declarations.b.b) {
				switch (declarations.a.$) {
					case 'StyleBlockDeclaration':
						var styleBlock = declarations.a.a;
						return _List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
								A2($rtfeldman$elm_css$Css$Structure$withPropertyAppended, property, styleBlock))
							]);
					case 'MediaRule':
						var _v1 = declarations.a;
						var mediaQueries = _v1.a;
						var styleBlocks = _v1.b;
						return _List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Structure$MediaRule,
								mediaQueries,
								A2(
									$rtfeldman$elm_css$Css$Structure$mapLast,
									$rtfeldman$elm_css$Css$Structure$withPropertyAppended(property),
									styleBlocks))
							]);
					default:
						return declarations;
				}
			} else {
				var first = declarations.a;
				var rest = declarations.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendToLastSelector = F2(
	function (f, styleBlock) {
		if (!styleBlock.b.b) {
			var only = styleBlock.a;
			var properties = styleBlock.c;
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, only, _List_Nil, properties),
					A3(
					$rtfeldman$elm_css$Css$Structure$StyleBlock,
					f(only),
					_List_Nil,
					_List_Nil)
				]);
		} else {
			var first = styleBlock.a;
			var rest = styleBlock.b;
			var properties = styleBlock.c;
			var newRest = A2($elm$core$List$map, f, rest);
			var newFirst = f(first);
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, rest, properties),
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, newFirst, newRest, _List_Nil)
				]);
		}
	});
var $rtfeldman$elm_css$Css$Structure$applyPseudoElement = F2(
	function (pseudo, _v0) {
		var sequence = _v0.a;
		var selectors = _v0.b;
		return A3(
			$rtfeldman$elm_css$Css$Structure$Selector,
			sequence,
			selectors,
			$elm$core$Maybe$Just(pseudo));
	});
var $rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector = F2(
	function (pseudo, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$applyPseudoElement(pseudo),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Structure$CustomSelector = F2(
	function (a, b) {
		return {$: 'CustomSelector', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$TypeSelectorSequence = F2(
	function (a, b) {
		return {$: 'TypeSelectorSequence', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatable = F2(
	function (selector, sequence) {
		switch (sequence.$) {
			case 'TypeSelectorSequence':
				var typeSelector = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
					typeSelector,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			case 'UniversalSelectorSequence':
				var list = sequence.a;
				return $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			default:
				var str = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$CustomSelector,
					str,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator = F2(
	function (selector, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			if (!list.b.b) {
				var _v1 = list.a;
				var combinator = _v1.a;
				var sequence = _v1.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						combinator,
						A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, selector, sequence))
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, selector, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableSelector = F2(
	function (repeatableSimpleSelector, selector) {
		if (!selector.b.b) {
			var sequence = selector.a;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, repeatableSimpleSelector, sequence),
				_List_Nil,
				pseudoElement);
		} else {
			var firstSelector = selector.a;
			var tuples = selector.b;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				firstSelector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, repeatableSimpleSelector, tuples),
				pseudoElement);
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector = F2(
	function (selector, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$appendRepeatableSelector(selector),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors = function (declarations) {
	collectSelectors:
	while (true) {
		if (!declarations.b) {
			return _List_Nil;
		} else {
			if (declarations.a.$ === 'StyleBlockDeclaration') {
				var _v1 = declarations.a.a;
				var firstSelector = _v1.a;
				var otherSelectors = _v1.b;
				var rest = declarations.b;
				return _Utils_ap(
					A2($elm$core$List$cons, firstSelector, otherSelectors),
					$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(rest));
			} else {
				var rest = declarations.b;
				var $temp$declarations = rest;
				declarations = $temp$declarations;
				continue collectSelectors;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$DocumentRule = F5(
	function (a, b, c, d, e) {
		return {$: 'DocumentRule', a: a, b: b, c: c, d: d, e: e};
	});
var $rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock = F2(
	function (update, declarations) {
		_v0$12:
		while (true) {
			if (!declarations.b) {
				return declarations;
			} else {
				if (!declarations.b.b) {
					switch (declarations.a.$) {
						case 'StyleBlockDeclaration':
							var styleBlock = declarations.a.a;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration,
								update(styleBlock));
						case 'MediaRule':
							if (declarations.a.b.b) {
								if (!declarations.a.b.b.b) {
									var _v1 = declarations.a;
									var mediaQueries = _v1.a;
									var _v2 = _v1.b;
									var styleBlock = _v2.a;
									return _List_fromArray(
										[
											A2(
											$rtfeldman$elm_css$Css$Structure$MediaRule,
											mediaQueries,
											update(styleBlock))
										]);
								} else {
									var _v3 = declarations.a;
									var mediaQueries = _v3.a;
									var _v4 = _v3.b;
									var first = _v4.a;
									var rest = _v4.b;
									var _v5 = A2(
										$rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock,
										update,
										_List_fromArray(
											[
												A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, rest)
											]));
									if ((_v5.b && (_v5.a.$ === 'MediaRule')) && (!_v5.b.b)) {
										var _v6 = _v5.a;
										var newMediaQueries = _v6.a;
										var newStyleBlocks = _v6.b;
										return _List_fromArray(
											[
												A2(
												$rtfeldman$elm_css$Css$Structure$MediaRule,
												newMediaQueries,
												A2($elm$core$List$cons, first, newStyleBlocks))
											]);
									} else {
										var newDeclarations = _v5;
										return newDeclarations;
									}
								}
							} else {
								break _v0$12;
							}
						case 'SupportsRule':
							var _v7 = declarations.a;
							var str = _v7.a;
							var nestedDeclarations = _v7.b;
							return _List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$Structure$SupportsRule,
									str,
									A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, nestedDeclarations))
								]);
						case 'DocumentRule':
							var _v8 = declarations.a;
							var str1 = _v8.a;
							var str2 = _v8.b;
							var str3 = _v8.c;
							var str4 = _v8.d;
							var styleBlock = _v8.e;
							return A2(
								$elm$core$List$map,
								A4($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4),
								update(styleBlock));
						case 'PageRule':
							var _v9 = declarations.a;
							return declarations;
						case 'FontFace':
							return declarations;
						case 'Keyframes':
							return declarations;
						case 'Viewport':
							return declarations;
						case 'CounterStyle':
							return declarations;
						default:
							return declarations;
					}
				} else {
					break _v0$12;
				}
			}
		}
		var first = declarations.a;
		var rest = declarations.b;
		return A2(
			$elm$core$List$cons,
			first,
			A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, rest));
	});
var $elm$core$String$cons = _String_cons;
var $Skinney$murmur3$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {charsProcessed: charsProcessed, hash: hash, seed: seed, shift: shift};
	});
var $Skinney$murmur3$Murmur3$c1 = 3432918353;
var $Skinney$murmur3$Murmur3$c2 = 461845907;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $Skinney$murmur3$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $Skinney$murmur3$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $Skinney$murmur3$Murmur3$finalize = function (data) {
	var acc = (!(!data.hash)) ? (data.seed ^ A2(
		$Skinney$murmur3$Murmur3$multiplyBy,
		$Skinney$murmur3$Murmur3$c2,
		A2(
			$Skinney$murmur3$Murmur3$rotlBy,
			15,
			A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, data.hash)))) : data.seed;
	var h0 = acc ^ data.charsProcessed;
	var h1 = A2($Skinney$murmur3$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2($Skinney$murmur3$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var $elm$core$String$foldl = _String_foldl;
var $Skinney$murmur3$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			$Skinney$murmur3$Murmur3$multiplyBy,
			5,
			A2(
				$Skinney$murmur3$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					$Skinney$murmur3$Murmur3$multiplyBy,
					$Skinney$murmur3$Murmur3$c2,
					A2(
						$Skinney$murmur3$Murmur3$rotlBy,
						15,
						A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, k1))))) + 3864292196;
	});
var $Skinney$murmur3$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.hash | ((255 & $elm$core$Char$toCode(c)) << data.shift);
		var _v0 = data.shift;
		if (_v0 === 24) {
			return {
				charsProcessed: data.charsProcessed + 1,
				hash: 0,
				seed: A2($Skinney$murmur3$Murmur3$mix, data.seed, res),
				shift: 0
			};
		} else {
			return {charsProcessed: data.charsProcessed + 1, hash: res, seed: data.seed, shift: data.shift + 8};
		}
	});
var $Skinney$murmur3$Murmur3$hashString = F2(
	function (seed, str) {
		return $Skinney$murmur3$Murmur3$finalize(
			A3(
				$elm$core$String$foldl,
				$Skinney$murmur3$Murmur3$hashFold,
				A4($Skinney$murmur3$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var $rtfeldman$elm_css$Hash$murmurSeed = 15739;
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Basics$modBy = _Basics_modBy;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return _Utils_chr('0');
			case 1:
				return _Utils_chr('1');
			case 2:
				return _Utils_chr('2');
			case 3:
				return _Utils_chr('3');
			case 4:
				return _Utils_chr('4');
			case 5:
				return _Utils_chr('5');
			case 6:
				return _Utils_chr('6');
			case 7:
				return _Utils_chr('7');
			case 8:
				return _Utils_chr('8');
			case 9:
				return _Utils_chr('9');
			case 10:
				return _Utils_chr('a');
			case 11:
				return _Utils_chr('b');
			case 12:
				return _Utils_chr('c');
			case 13:
				return _Utils_chr('d');
			case 14:
				return _Utils_chr('e');
			case 15:
				return _Utils_chr('f');
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			_Utils_chr('-'),
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $rtfeldman$elm_css$Hash$fromString = function (str) {
	return A2(
		$elm$core$String$cons,
		_Utils_chr('_'),
		$rtfeldman$elm_hex$Hex$toString(
			A2($Skinney$murmur3$Murmur3$hashString, $rtfeldman$elm_css$Hash$murmurSeed, str)));
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$last = function (list) {
	last:
	while (true) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var singleton = list.a;
				return $elm$core$Maybe$Just(singleton);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue last;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration = function (declarations) {
	lastDeclaration:
	while (true) {
		if (!declarations.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!declarations.b.b) {
				var x = declarations.a;
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[x]));
			} else {
				var xs = declarations.b;
				var $temp$declarations = xs;
				declarations = $temp$declarations;
				continue lastDeclaration;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf = function (maybes) {
	oneOf:
	while (true) {
		if (!maybes.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var maybe = maybes.a;
			var rest = maybes.b;
			if (maybe.$ === 'Nothing') {
				var $temp$maybes = rest;
				maybes = $temp$maybes;
				continue oneOf;
			} else {
				return maybe;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$FontFeatureValues = function (a) {
	return {$: 'FontFeatureValues', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues = function (tuples) {
	var expandTuples = function (tuplesToExpand) {
		if (!tuplesToExpand.b) {
			return _List_Nil;
		} else {
			var properties = tuplesToExpand.a;
			var rest = tuplesToExpand.b;
			return A2(
				$elm$core$List$cons,
				properties,
				expandTuples(rest));
		}
	};
	var newTuples = expandTuples(tuples);
	return _List_fromArray(
		[
			$rtfeldman$elm_css$Css$Structure$FontFeatureValues(newTuples)
		]);
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule = F2(
	function (mediaQueries, declaration) {
		if (declaration.$ === 'StyleBlockDeclaration') {
			var styleBlock = declaration.a;
			return A2(
				$rtfeldman$elm_css$Css$Structure$MediaRule,
				mediaQueries,
				_List_fromArray(
					[styleBlock]));
		} else {
			return declaration;
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule = F5(
	function (str1, str2, str3, str4, declaration) {
		if (declaration.$ === 'StyleBlockDeclaration') {
			var structureStyleBlock = declaration.a;
			return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
		} else {
			return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule = F2(
	function (mediaQueries, declaration) {
		switch (declaration.$) {
			case 'StyleBlockDeclaration':
				var structureStyleBlock = declaration.a;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					mediaQueries,
					_List_fromArray(
						[structureStyleBlock]));
			case 'MediaRule':
				var newMediaQueries = declaration.a;
				var structureStyleBlocks = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					_Utils_ap(mediaQueries, newMediaQueries),
					structureStyleBlocks);
			case 'SupportsRule':
				var str = declaration.a;
				var declarations = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$SupportsRule,
					str,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
						declarations));
			case 'DocumentRule':
				var str1 = declaration.a;
				var str2 = declaration.b;
				var str3 = declaration.c;
				var str4 = declaration.d;
				var structureStyleBlock = declaration.e;
				return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
			case 'PageRule':
				return declaration;
			case 'FontFace':
				return declaration;
			case 'Keyframes':
				return declaration;
			case 'Viewport':
				return declaration;
			case 'CounterStyle':
				return declaration;
			default:
				return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet = function (_v0) {
	var declarations = _v0.a;
	return declarations;
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast = F4(
	function (nestedStyles, rest, f, declarations) {
		var withoutParent = function (decls) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(decls));
		};
		var nextResult = A2(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
			rest,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		var newDeclarations = function () {
			var _v14 = _Utils_Tuple2(
				$elm$core$List$head(nextResult),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$last(declarations));
			if ((_v14.a.$ === 'Just') && (_v14.b.$ === 'Just')) {
				var nextResultParent = _v14.a.a;
				var originalParent = _v14.b.a;
				return _Utils_ap(
					A2(
						$elm$core$List$take,
						$elm$core$List$length(declarations) - 1,
						declarations),
					_List_fromArray(
						[
							(!_Utils_eq(originalParent, nextResultParent)) ? nextResultParent : originalParent
						]));
			} else {
				return declarations;
			}
		}();
		var insertStylesToNestedDecl = function (lastDecl) {
			return $elm$core$List$concat(
				A2(
					$rtfeldman$elm_css$Css$Structure$mapLast,
					$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles(nestedStyles),
					A2(
						$elm$core$List$map,
						$elm$core$List$singleton,
						A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, f, lastDecl))));
		};
		var initialResult = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				insertStylesToNestedDecl,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		return _Utils_ap(
			newDeclarations,
			_Utils_ap(
				withoutParent(initialResult),
				withoutParent(nextResult)));
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles = F2(
	function (styles, declarations) {
		if (!styles.b) {
			return declarations;
		} else {
			switch (styles.a.$) {
				case 'AppendProperty':
					var property = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, declarations));
				case 'ExtendSelector':
					var _v4 = styles.a;
					var selector = _v4.a;
					var nestedStyles = _v4.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector(selector),
						declarations);
				case 'NestSnippet':
					var _v5 = styles.a;
					var selectorCombinator = _v5.a;
					var snippets = _v5.b;
					var rest = styles.b;
					var chain = F2(
						function (_v9, _v10) {
							var originalSequence = _v9.a;
							var originalTuples = _v9.b;
							var originalPseudoElement = _v9.c;
							var newSequence = _v10.a;
							var newTuples = _v10.b;
							var newPseudoElement = _v10.c;
							return A3(
								$rtfeldman$elm_css$Css$Structure$Selector,
								originalSequence,
								_Utils_ap(
									originalTuples,
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(selectorCombinator, newSequence),
										newTuples)),
								$rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf(
									_List_fromArray(
										[newPseudoElement, originalPseudoElement])));
						});
					var expandDeclaration = function (declaration) {
						switch (declaration.$) {
							case 'StyleBlockDeclaration':
								var _v7 = declaration.a;
								var firstSelector = _v7.a;
								var otherSelectors = _v7.b;
								var nestedStyles = _v7.c;
								var newSelectors = A2(
									$elm$core$List$concatMap,
									function (originalSelector) {
										return A2(
											$elm$core$List$map,
											chain(originalSelector),
											A2($elm$core$List$cons, firstSelector, otherSelectors));
									},
									$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations));
								var newDeclarations = function () {
									if (!newSelectors.b) {
										return _List_Nil;
									} else {
										var first = newSelectors.a;
										var remainder = newSelectors.b;
										return _List_fromArray(
											[
												$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
												A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, remainder, _List_Nil))
											]);
									}
								}();
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, nestedStyles, newDeclarations);
							case 'MediaRule':
								var mediaQueries = declaration.a;
								var styleBlocks = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
							case 'SupportsRule':
								var str = declaration.a;
								var otherSnippets = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
							case 'DocumentRule':
								var str1 = declaration.a;
								var str2 = declaration.b;
								var str3 = declaration.c;
								var str4 = declaration.d;
								var styleBlock = declaration.e;
								return A2(
									$elm$core$List$map,
									A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
									$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
							case 'PageRule':
								var str = declaration.a;
								var properties = declaration.b;
								return _List_fromArray(
									[
										A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
									]);
							case 'FontFace':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$FontFace(properties)
									]);
							case 'Viewport':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$Viewport(properties)
									]);
							case 'CounterStyle':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
									]);
							default:
								var tuples = declaration.a;
								return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
						}
					};
					return $elm$core$List$concat(
						_Utils_ap(
							_List_fromArray(
								[
									A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations)
								]),
							A2(
								$elm$core$List$map,
								expandDeclaration,
								A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets))));
				case 'WithPseudoElement':
					var _v11 = styles.a;
					var pseudoElement = _v11.a;
					var nestedStyles = _v11.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector(pseudoElement),
						declarations);
				case 'WithKeyframes':
					var str = styles.a.a;
					var rest = styles.b;
					var name = $rtfeldman$elm_css$Hash$fromString(str);
					var newProperty = 'animation-name:' + name;
					var newDeclarations = A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, newProperty, declarations));
					return A2(
						$elm$core$List$append,
						newDeclarations,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$Keyframes(
								{declaration: str, name: name})
							]));
				case 'WithMedia':
					var _v12 = styles.a;
					var mediaQueries = _v12.a;
					var nestedStyles = _v12.b;
					var rest = styles.b;
					var extraDeclarations = function () {
						var _v13 = $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations);
						if (!_v13.b) {
							return _List_Nil;
						} else {
							var firstSelector = _v13.a;
							var otherSelectors = _v13.b;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule(mediaQueries),
								A2(
									$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
									nestedStyles,
									$elm$core$List$singleton(
										$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
											A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil)))));
						}
					}();
					return _Utils_ap(
						A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations),
						extraDeclarations);
				default:
					var otherStyles = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						_Utils_ap(otherStyles, rest),
						declarations);
			}
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock = function (_v2) {
	var firstSelector = _v2.a;
	var otherSelectors = _v2.b;
	var styles = _v2.c;
	return A2(
		$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
		styles,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil))
			]));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$extract = function (snippetDeclarations) {
	if (!snippetDeclarations.b) {
		return _List_Nil;
	} else {
		var first = snippetDeclarations.a;
		var rest = snippetDeclarations.b;
		return _Utils_ap(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations(first),
			$rtfeldman$elm_css$Css$Preprocess$Resolve$extract(rest));
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule = F2(
	function (mediaQueries, styleBlocks) {
		var handleStyleBlock = function (styleBlock) {
			return A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		};
		return A2($elm$core$List$concatMap, handleStyleBlock, styleBlocks);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule = F2(
	function (str, snippets) {
		var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
			A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
		return _List_fromArray(
			[
				A2($rtfeldman$elm_css$Css$Structure$SupportsRule, str, declarations)
			]);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations = function (snippetDeclaration) {
	switch (snippetDeclaration.$) {
		case 'StyleBlockDeclaration':
			var styleBlock = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
		case 'MediaRule':
			var mediaQueries = snippetDeclaration.a;
			var styleBlocks = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
		case 'SupportsRule':
			var str = snippetDeclaration.a;
			var snippets = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
		case 'DocumentRule':
			var str1 = snippetDeclaration.a;
			var str2 = snippetDeclaration.b;
			var str3 = snippetDeclaration.c;
			var str4 = snippetDeclaration.d;
			var styleBlock = snippetDeclaration.e;
			return A2(
				$elm$core$List$map,
				A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		case 'PageRule':
			var str = snippetDeclaration.a;
			var properties = snippetDeclaration.b;
			return _List_fromArray(
				[
					A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
				]);
		case 'FontFace':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$FontFace(properties)
				]);
		case 'Viewport':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Viewport(properties)
				]);
		case 'CounterStyle':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
				]);
		default:
			var tuples = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var snippets = _v0.snippets;
	var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
		A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
	return {charset: charset, declarations: declarations, imports: imports, namespaces: namespaces};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp = function (sheet) {
	return $rtfeldman$elm_css$Css$Structure$Output$prettyPrint(
		$rtfeldman$elm_css$Css$Structure$compactStylesheet(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure(sheet)));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compile = function (styles) {
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp, styles));
};
var $rtfeldman$elm_css$Css$Preprocess$Snippet = function (a) {
	return {$: 'Snippet', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$StyleBlock = F3(
	function (a, b, c) {
		return {$: 'StyleBlock', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration = function (a) {
	return {$: 'StyleBlockDeclaration', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$makeSnippet = F2(
	function (styles, sequence) {
		var selector = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return $rtfeldman$elm_css$Css$Preprocess$Snippet(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
					A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
				]));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$murmurSeed = 15739;
var $rtfeldman$elm_css$Css$Preprocess$stylesheet = function (snippets) {
	return {charset: $elm$core$Maybe$Nothing, imports: _List_Nil, namespaces: _List_Nil, snippets: snippets};
};
var $rtfeldman$elm_css$VirtualDom$Styled$getClassname = function (styles) {
	return $elm$core$List$isEmpty(styles) ? 'unstyled' : A2(
		$elm$core$String$cons,
		_Utils_chr('_'),
		$rtfeldman$elm_hex$Hex$toString(
			A2(
				$Skinney$murmur3$Murmur3$hashString,
				$rtfeldman$elm_css$VirtualDom$Styled$murmurSeed,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
					$elm$core$List$singleton(
						$rtfeldman$elm_css$Css$Preprocess$stylesheet(
							$elm$core$List$singleton(
								A2(
									$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
									styles,
									$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_List_Nil)))))))));
};
var $rtfeldman$elm_css$Html$Styled$Internal$css = function (styles) {
	var classname = $rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
	var classProperty = A2(
		$elm$virtual_dom$VirtualDom$property,
		'className',
		$elm$json$Json$Encode$string(classname));
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, classProperty, styles, classname);
};
var $rtfeldman$elm_css$Html$Styled$Attributes$css = $rtfeldman$elm_css$Html$Styled$Internal$css;
var $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth = 1;
var $rtfeldman$elm_css$Css$Preprocess$AppendProperty = function (a) {
	return {$: 'AppendProperty', a: a};
};
var $rtfeldman$elm_css$Css$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$prop1 = F2(
	function (key, arg) {
		return A2($rtfeldman$elm_css$Css$property, key, arg.value);
	});
var $rtfeldman$elm_css$Css$height = $rtfeldman$elm_css$Css$prop1('height');
var $rtfeldman$elm_css$Css$PxUnits = {$: 'PxUnits'};
var $rtfeldman$elm_css$Css$Structure$Compatible = {$: 'Compatible'};
var $rtfeldman$elm_css$Css$Internal$lengthConverter = F3(
	function (units, unitLabel, numericValue) {
		return {
			absoluteLength: $rtfeldman$elm_css$Css$Structure$Compatible,
			calc: $rtfeldman$elm_css$Css$Structure$Compatible,
			flexBasis: $rtfeldman$elm_css$Css$Structure$Compatible,
			fontSize: $rtfeldman$elm_css$Css$Structure$Compatible,
			length: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNone: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNoneOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
			numericValue: numericValue,
			textIndent: $rtfeldman$elm_css$Css$Structure$Compatible,
			unitLabel: unitLabel,
			units: units,
			value: _Utils_ap(
				$elm$core$String$fromFloat(numericValue),
				unitLabel)
		};
	});
var $rtfeldman$elm_css$Css$px = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$PxUnits, 'px');
var $rtfeldman$elm_css$Css$width = $rtfeldman$elm_css$Css$prop1('width');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar = F4(
	function (barHeight, getter, properties, item) {
		var nestedDataGetter = A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.data;
			},
			getter);
		var maxWidth = (properties.width - 8) - $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth;
		var actualWidth = (nestedDataGetter(item) / 100) * maxWidth;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-progress-bar-container')
				]),
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-progress-bar-background'),
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$width(
									$rtfeldman$elm_css$Css$px(maxWidth))
								]))
						]),
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$div,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-progress-bar-foreground'),
									$rtfeldman$elm_css$Html$Styled$Attributes$css(
									_List_fromArray(
										[
											$rtfeldman$elm_css$Css$width(
											$rtfeldman$elm_css$Css$px(actualWidth)),
											$rtfeldman$elm_css$Css$height(
											$rtfeldman$elm_css$Css$px(barHeight))
										]))
								]),
							_List_Nil)
						]))
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$progressColumn = function (labels) {
	var progressColumnConfig = A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: function ($) {
				return $.value1;
			},
			id: 'Progress',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Progrès',
			tooltip: 'Une indication pour la colonne Progrès',
			width: 100
		},
		labels);
	return _Utils_update(
		progressColumnConfig,
		{
			renderer: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.value1;
				})
		});
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals = function (value) {
	var valueAsString = $elm$core$String$fromFloat(value);
	var pointIndex = A2(
		$elm$core$Maybe$withDefault,
		$elm$core$String$length(valueAsString),
		$elm$core$List$head(
			A2($elm$core$String$indexes, '.', valueAsString)));
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$String$toFloat(
			A2($elm$core$String$left, pointIndex + 2, valueAsString)));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value1Column = function (labels) {
	return A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.value1;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			id: 'Value1',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Valeur 1',
			tooltip: 'Une indication pour la colonne Valeur 1',
			width: 100
		},
		labels);
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value1ProgressColumn = function (labels) {
	var columnConfig = A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.value1;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			id: 'ProgressValue1',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Valeur 1',
			tooltip: 'Une indication pour la colonne Valeur 1',
			width: 100
		},
		labels);
	return _Utils_update(
		columnConfig,
		{
			renderer: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.value1;
				})
		});
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value2Column = function (labels) {
	return A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.value2;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			id: 'Value2',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Valeur 2',
			tooltip: 'Une indication pour la colonne Valeur 2',
			width: 100
		},
		labels);
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value2ProgressColumn = function (labels) {
	var columnConfig = A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.value2;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			id: 'ProgressValue2',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Valeur 2',
			tooltip: 'Une indication pour la colonne Valeur 2',
			width: 100
		},
		labels);
	return _Utils_update(
		columnConfig,
		{
			renderer: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.value2;
				})
		});
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value3Column = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
	{
		getter: A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.value3;
			},
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
		id: 'Value3',
		localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		setter: F2(
			function (item, _v0) {
				return item;
			}),
		title: 'Valeur 3',
		tooltip: 'Une indication pour la colonne Valeur 3',
		width: 100
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value3ProgressColumn = function (labels) {
	var columnConfig = A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.value3;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			id: 'ProgressValue3',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Valeur 3',
			tooltip: 'Une indication pour la colonne Valeur 3',
			width: 100
		},
		labels);
	return _Utils_update(
		columnConfig,
		{
			renderer: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.value3;
				})
		});
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value4Column = function (labels) {
	return A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.value4;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			id: 'Value4',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Valeur 4',
			tooltip: 'Une indication pour la colonne Valeur 4',
			width: 100
		},
		labels);
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value4ProgressColumn = function (labels) {
	var columnConfig = A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.value4;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			id: 'ProgressValue4',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Valeur 4',
			tooltip: 'Une indication pour la colonne Valeur 4',
			width: 100
		},
		labels);
	return _Utils_update(
		columnConfig,
		{
			renderer: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.value4;
				})
		});
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value5Column = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
	{
		getter: A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.value5;
			},
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
		id: 'Value5',
		localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		setter: F2(
			function (item, _v0) {
				return item;
			}),
		title: 'Valeur 5',
		tooltip: 'Une indication pour la colonne Valeur 5',
		width: 100
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value5ProgressColumn = function (labels) {
	var columnConfig = A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.value5;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			id: 'ProgressValue5',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Valeur 5',
			tooltip: 'Une indication pour la colonne Valeur 5',
			width: 100
		},
		labels);
	return _Utils_update(
		columnConfig,
		{
			renderer: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.value5;
				})
		});
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value6Column = function (labels) {
	return A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.value6;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			id: 'Value6',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Valeur 6',
			tooltip: 'Une indication pour la colonne Valeur 6',
			width: 100
		},
		labels);
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value6ProgressColumn = function (labels) {
	var columnConfig = A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig,
		{
			getter: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.value6;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			id: 'ProgressValue6',
			localize: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			setter: F2(
				function (item, _v0) {
					return item;
				}),
			title: 'Valeur 6',
			tooltip: 'Une indication pour la colonne Valeur 6',
			width: 100
		},
		labels);
	return _Utils_update(
		columnConfig,
		{
			renderer: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.value6;
				})
		});
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$columns = function (labels) {
	return _List_fromArray(
		[
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$idColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$nameColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$progressColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$cityColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value1Column(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value1ProgressColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value2Column(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value2ProgressColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value3Column(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value3ProgressColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value4Column(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value4ProgressColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value5Column(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value5ProgressColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value6ProgressColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value6Column(labels)
		]);
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$gridContainerId = 'grid-container';
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$rowClass = function (item) {
	var even = _Utils_eq(item.visibleIndex / 2, (item.visibleIndex / 2) | 0);
	return item.selected ? 'selected-row' : (even ? 'even-row' : '');
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$gridConfig = {
	canSelectRows: true,
	columns: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$columns($elm$core$Dict$empty),
	containerId: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$gridContainerId,
	footerHeight: 20,
	hasFilters: true,
	headerHeight: 60,
	labels: $elm$core$Dict$empty,
	lineHeight: 25,
	rowClass: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$rowClass
};
var $Orange_OpenSource$elm_advanced_grid$Grid$GotParentContainerInfo = function (a) {
	return {$: 'GotParentContainerInfo', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Model = F3(
	function (a, b, c) {
		return {$: 'Model', a: a, b: b, c: c};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Item$create = F2(
	function (data, contentIndex) {
		return {contentIndex: contentIndex, data: data, selected: false, visibleIndex: contentIndex};
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $Orange_OpenSource$elm_advanced_grid$Grid$Html$getElementInfo = F2(
	function (elementId, msg) {
		return A2(
			$elm$core$Task$attempt,
			function (result) {
				return msg(result);
			},
			$elm$browser$Browser$Dom$getElement(elementId));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$Closed = {$: 'Closed'};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {col: col, problem: problem, row: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 'Empty':
					return list;
				case 'AddRight':
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0.a;
		var _v1 = parse(
			{col: 1, context: _List_Nil, indent: 1, offset: 0, row: 1, src: src});
		if (_v1.$ === 'Good') {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (_v0.$ === 'Ok') {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$removeEqualSign = F2(
	function (labels, inputString) {
		var parser = A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($elm$core$Basics$identity),
				$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$equalityParser),
			$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$stringParser(labels));
		var parsedValue = A2($elm$parser$Parser$run, parser, inputString);
		if (parsedValue.$ === 'Ok') {
			var value = parsedValue.a;
			return value;
		} else {
			return inputString;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$inputValues = F2(
	function (labels, filteringValue) {
		return $elm$core$Set$fromList(
			A2(
				$elm$core$List$map,
				$Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$removeEqualSign(labels),
				A2(
					$elm$core$List$filter,
					A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
					A2(
						$elm$core$String$split,
						$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$orKeyword(labels),
						A2($elm$core$Maybe$withDefault, '', filteringValue)))));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$maxQuickFilterPropositions = 1000;
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$init = F4(
	function (allValuesInColumn, filteringString, labels, columnWidth) {
		var values = A2($elm$core$List$take, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$maxQuickFilterPropositions, allValuesInColumn);
		var firstItem = A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm$core$List$head(values));
		var filteringValues = A2($Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$inputValues, labels, filteringString);
		var emptyLabel = A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$empty, labels);
		var filterPropositions = (firstItem === '') ? A2(
			$elm$core$List$cons,
			emptyLabel,
			A2($elm$core$List$drop, 1, values)) : values;
		return {
			filteringValues: filteringValues,
			labels: labels,
			maxX: 0,
			origin: {x: 0, y: 0},
			outputStrings: filteringValues,
			position: {x: 0, y: 0},
			propositions: filterPropositions,
			state: $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$Closed,
			width: columnWidth
		};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$init = function (labels) {
	return {
		cellDimensions: {height: 0, width: 0},
		labels: labels,
		maxLength: 0,
		maxY: 0,
		origin: {x: 0, y: 0},
		position: {x: 0, y: 0},
		textareaDimensions: {height: 0, width: 0},
		value: ''
	};
};
var $FabienHenon$elm_infinite_list_view$InfiniteList$Model = function (a) {
	return {$: 'Model', a: a};
};
var $FabienHenon$elm_infinite_list_view$InfiniteList$init = $FabienHenon$elm_infinite_list_view$InfiniteList$Model(0);
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$NoFilter = {$: 'NoFilter'};
var $Orange_OpenSource$elm_advanced_grid$Grid$boolToString = function (value) {
	return value ? 'true' : 'false';
};
var $Orange_OpenSource$elm_advanced_grid$Grid$compareBoolField = F3(
	function (dataValue, item1, item2) {
		var _v0 = _Utils_Tuple2(
			dataValue(item1),
			dataValue(item2));
		if (_v0.a) {
			if (_v0.b) {
				return $elm$core$Basics$EQ;
			} else {
				return $elm$core$Basics$GT;
			}
		} else {
			if (!_v0.b) {
				return $elm$core$Basics$EQ;
			} else {
				return $elm$core$Basics$LT;
			}
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$UserToggledSelection = function (a) {
	return {$: 'UserToggledSelection', a: a};
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$checked = $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('checked');
var $rtfeldman$elm_css$Html$Styled$input = $rtfeldman$elm_css$Html$Styled$node('input');
var $Orange_OpenSource$elm_advanced_grid$Grid$Html$alwaysPreventDefault = function (msg) {
	return _Utils_Tuple2(msg, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Html$stopPropagationOnClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
		'click',
		A2(
			$elm$json$Json$Decode$map,
			$Orange_OpenSource$elm_advanced_grid$Grid$Html$alwaysPreventDefault,
			$elm$json$Json$Decode$succeed(msg)));
};
var $rtfeldman$elm_css$Html$Styled$Attributes$type_ = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('type');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewBool = F3(
	function (field, properties, item) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			A2($Orange_OpenSource$elm_advanced_grid$Grid$cellAttributes, properties, item),
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$input,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$type_('checkbox'),
							$rtfeldman$elm_css$Html$Styled$Attributes$checked(
							field(item)),
							$Orange_OpenSource$elm_advanced_grid$Grid$Html$stopPropagationOnClick(
							$Orange_OpenSource$elm_advanced_grid$Grid$UserToggledSelection(item))
						]),
					_List_Nil)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$selectionColumn = function () {
	var properties = {editor: $elm$core$Maybe$Nothing, id: '_MultipleSelection_', order: $Orange_OpenSource$elm_advanced_grid$Grid$Unsorted, title: '', tooltip: '', visible: true, width: 40};
	return {
		comparator: $Orange_OpenSource$elm_advanced_grid$Grid$compareBoolField(
			function ($) {
				return $.selected;
			}),
		filteringValue: $elm$core$Maybe$Nothing,
		filters: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$NoFilter,
		hasQuickFilter: false,
		properties: properties,
		renderer: $Orange_OpenSource$elm_advanced_grid$Grid$viewBool(
			function ($) {
				return $.selected;
			}),
		toString: A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.selected;
			},
			$Orange_OpenSource$elm_advanced_grid$Grid$boolToString)
	};
}();
var $Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumnProperties = function (columnProperties) {
	return _Utils_eq(columnProperties.id, $Orange_OpenSource$elm_advanced_grid$Grid$selectionColumn.properties.id);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumn = function (columnConfig) {
	return $Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumnProperties(columnConfig.properties);
};
var $elm_community$list_extra$List$Extra$updateIf = F3(
	function (predicate, update, list) {
		return A2(
			$elm$core$List$map,
			function (item) {
				return predicate(item) ? update(item) : item;
			},
			list);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$sanitizedColumns = function (columns) {
	return A3(
		$elm_community$list_extra$List$Extra$updateIf,
		A2(
			$elm$core$Basics$composeL,
			A2(
				$elm$core$Basics$composeL,
				$elm$core$Basics$not,
				function ($) {
					return $.visible;
				}),
			function ($) {
				return $.properties;
			}),
		function (c) {
			return _Utils_update(
				c,
				{filteringValue: $elm$core$Maybe$Nothing});
		},
		columns);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$init = F2(
	function (config, data) {
		var stringEditorModel = $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$init(config.labels);
		var quickFilterModel = A4($Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$init, _List_Nil, $elm$core$Maybe$Nothing, config.labels, 0);
		var indexedItems = A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, value) {
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$Item$create, value, index);
				}),
			data);
		var hasSelectionColumn = function (columns) {
			var _v0 = $elm$core$List$head(columns);
			if (_v0.$ === 'Just') {
				var firstColumn = _v0.a;
				return $Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumn(firstColumn);
			} else {
				return false;
			}
		};
		var shouldAddSelectionColumn = config.canSelectRows && (!hasSelectionColumn(config.columns));
		var newConfig = shouldAddSelectionColumn ? _Utils_update(
			config,
			{
				columns: A2($elm$core$List$cons, $Orange_OpenSource$elm_advanced_grid$Grid$selectionColumn, config.columns)
			}) : config;
		var sanitizedConfig = _Utils_update(
			newConfig,
			{
				columns: $Orange_OpenSource$elm_advanced_grid$Grid$sanitizedColumns(newConfig.columns)
			});
		var initialState = {
			areFilterVisible: config.hasFilters,
			clickedItem: $elm$core$Maybe$Nothing,
			config: sanitizedConfig,
			containerHeight: 0,
			containerWidth: 0,
			content: data,
			dragStartX: 0,
			draggedColumn: $elm$core$Maybe$Nothing,
			editedCellId: '',
			editedColumnId: '',
			editedItem: $elm$core$Maybe$Nothing,
			editorHasFocus: false,
			filterHasFocus: false,
			headerContainerPosition: {x: 0, y: 0},
			hoveredColumn: $elm$core$Maybe$Nothing,
			infList: $FabienHenon$elm_infinite_list_view$InfiniteList$init,
			isAllSelected: false,
			labels: config.labels,
			order: $Orange_OpenSource$elm_advanced_grid$Grid$Unsorted,
			quickFilteredColumn: $elm$core$Maybe$Nothing,
			resizedColumn: $elm$core$Maybe$Nothing,
			showPreferences: false,
			sortedBy: $elm$core$Maybe$Nothing,
			visibleItems: indexedItems
		};
		return _Utils_Tuple2(
			A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, initialState, stringEditorModel, quickFilterModel),
			A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$getElementInfo, config.containerId, $Orange_OpenSource$elm_advanced_grid$Grid$GotParentContainerInfo));
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$cities = _List_fromArray(
	['Paris', 'London', 'New York', 'Moscow', 'Roma', 'Berlin', 'Tokyo', 'Delhi', 'Shanghai', 'Sao Paulo', 'Mexico City', 'Cairo', 'Dhaka', 'Mumbai', 'Beijing', '', 'Osaka', 'Karachi', 'Chongqing', 'Buenos Aires', 'Istanbul', 'Kolkata', 'Lagos', 'Manila', 'Tianjin', 'Rio De Janeiro', 'Guangzhou', 'Moscow', 'Lahore', 'Shenzhen', 'Bangalore', 'Paris', 'Bogota', 'Chennai', '', 'Lima', 'Bangkok', 'Seoul', 'Hyderabad', 'London', 'Tehran', '', 'New York', 'Wuhan', 'Ahmedabad', 'Kuala Lumpur', 'Riyadh', 'Surat', 'Santiago', 'Madrid', 'Pune', 'Dar Es Salaam', 'Toronto', 'Johannesburg', 'Barcelona', 'St Petersburg', 'Yangon', 'Alexandria', 'Guadalajara', 'Ankara', 'Melbourne', 'Sydney', 'Brasilia', 'Nairobi', 'Cape Town', 'Rome', 'Montreal', 'Tel Aviv', 'Los Angeles', 'Medellin', 'Jaipur', 'Casablanca', 'Lucknow', 'Berlin', 'Busan', 'Athens', 'Milan', 'Kanpur', 'Abuja', 'Lisbon', 'Surabaya', 'Dubai', 'Cali', 'Manchester']);
var $elm_community$list_extra$List$Extra$getAt = F2(
	function (idx, xs) {
		return (idx < 0) ? $elm$core$Maybe$Nothing : $elm$core$List$head(
			A2($elm$core$List$drop, idx, xs));
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount = 20000;
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$items = A2(
	$elm$core$List$map,
	function (i) {
		return {
			city: A2(
				$elm$core$Maybe$withDefault,
				'None',
				A2(
					$elm_community$list_extra$List$Extra$getAt,
					A2(
						$elm$core$Basics$modBy,
						$elm$core$List$length($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$cities),
						i),
					$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$cities)),
			id: i,
			name: 'name' + $elm$core$String$fromInt(i),
			value1: (($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount - i) / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 100,
			value2: (i / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 50,
			value3: (($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount - i) / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 25,
			value4: (i / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 15,
			value5: (($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount - i) / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 10,
			value6: (i / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 5
		};
	},
	A2($elm$core$List$range, 0, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount - 1));
var $elm$core$Platform$Cmd$map = _Platform_map;
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$init = function (_v0) {
	var _v1 = A2($Orange_OpenSource$elm_advanced_grid$Grid$init, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$gridConfig, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$items);
	var gridModel = _v1.a;
	var gridCmd = _v1.b;
	return _Utils_Tuple2(
		{arePreferencesVisible: false, clickedItem: $elm$core$Maybe$Nothing, gridModel: gridModel},
		A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $Orange_OpenSource$elm_advanced_grid$Grid$Ascending = {$: 'Ascending'};
var $Orange_OpenSource$elm_advanced_grid$Grid$Descending = {$: 'Descending'};
var $Orange_OpenSource$elm_advanced_grid$Grid$ScrollTo = function (a) {
	return {$: 'ScrollTo', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$SetFilters = function (a) {
	return {$: 'SetFilters', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$SetSorting = F2(
	function (a, b) {
		return {$: 'SetSorting', a: a, b: b};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$ShowPreferences = {$: 'ShowPreferences'};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedPreferenceCloseButton = {$: 'UserClickedPreferenceCloseButton'};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserToggledAllItemSelection = {$: 'UserToggledAllItemSelection'};
var $Orange_OpenSource$elm_advanced_grid$Grid$GotCellInfo = function (a) {
	return {$: 'GotCellInfo', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$GotHeaderContainerInfo = function (a) {
	return {$: 'GotHeaderContainerInfo', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$GotQuickFilterButtonInfo = function (a) {
	return {$: 'GotQuickFilterButtonInfo', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$GotRowsContainerInfo = function (a) {
	return {$: 'GotRowsContainerInfo', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$NoOp = {$: 'NoOp'};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilterMsg = function (a) {
	return {$: 'QuickFilterMsg', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$SetOrigin = F2(
	function (a, b) {
		return {$: 'SetOrigin', a: a, b: b};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$SetOrigin = function (a) {
	return {$: 'SetOrigin', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$SetPosition = function (a) {
	return {$: 'SetPosition', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$SetPositionAndDimensions = F3(
	function (a, b, c) {
		return {$: 'SetPositionAndDimensions', a: a, b: b, c: c};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditorMsg = function (a) {
	return {$: 'StringEditorMsg', a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$List$sortWith = _List_sortWith;
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$Set$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$Set$insert, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$unique = function (list) {
	return A4($elm_community$list_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, $elm$core$Set$empty, list, _List_Nil);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$columnValues = F2(
	function (columnConfig, state) {
		return $elm_community$list_extra$List$Extra$unique(
			A2(
				$elm$core$List$map,
				columnConfig.toString,
				A2(
					$elm$core$List$sortWith,
					columnConfig.comparator,
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (index, data) {
								return A2($Orange_OpenSource$elm_advanced_grid$Grid$Item$create, data, index);
							}),
						state.content))));
	});
var $elm_community$list_extra$List$Extra$findIndexHelp = F3(
	function (index, predicate, list) {
		findIndexHelp:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$predicate = predicate,
						$temp$list = xs;
					index = $temp$index;
					predicate = $temp$predicate;
					list = $temp$list;
					continue findIndexHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$findIndex = $elm_community$list_extra$List$Extra$findIndexHelp(0);
var $Orange_OpenSource$elm_advanced_grid$Grid$headerContainerId = '_header_-_container_';
var $FabienHenon$elm_infinite_list_view$InfiniteList$Config = function (a) {
	return {$: 'Config', a: a};
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $FabienHenon$elm_infinite_list_view$InfiniteList$defaultContainer = F2(
	function (styles, elements) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var attr = _v0.a;
					var value = _v0.b;
					return A2($elm$html$Html$Attributes$style, attr, value);
				},
				styles),
			elements);
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$config = function (conf) {
	return $FabienHenon$elm_infinite_list_view$InfiniteList$Config(
		{_class: $elm$core$Maybe$Nothing, containerHeight: conf.containerHeight, customContainer: $FabienHenon$elm_infinite_list_view$InfiniteList$defaultContainer, id: $elm$core$Maybe$Nothing, itemHeight: conf.itemHeight, itemView: conf.itemView, offset: 200, styles: _List_Nil});
};
var $elm$core$Basics$round = _Basics_round;
var $Orange_OpenSource$elm_advanced_grid$Grid$visibleColumns_ = function (state) {
	return A2(
		$elm$core$List$filter,
		function (column) {
			return column.properties.visible;
		},
		state.config.columns);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$gridTemplateColumns = function (state) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$map,
			function (columnConfig) {
				return $elm$core$String$fromInt(columnConfig.properties.width) + 'px';
			},
			$Orange_OpenSource$elm_advanced_grid$Grid$visibleColumns_(state)));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$gridWidth = function (state) {
	return A3(
		$elm$core$List$foldl,
		function (columnConfig) {
			return $elm$core$Basics$add(columnConfig.properties.width);
		},
		0,
		$Orange_OpenSource$elm_advanced_grid$Grid$visibleColumns_(state));
};
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles = F2(
	function (_v0, styles) {
		var newStyles = _v0.b;
		var classname = _v0.c;
		return $elm$core$List$isEmpty(newStyles) ? styles : A3($elm$core$Dict$insert, classname, newStyles, styles);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute = function (_v0) {
	var val = _v0.a;
	return val;
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$nodeNS = function (tag) {
	return _VirtualDom_nodeNS(
		_VirtualDom_noScript(tag));
};
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml = F2(
	function (_v6, _v7) {
		var key = _v6.a;
		var html = _v6.b;
		var pairs = _v7.a;
		var styles = _v7.b;
		switch (html.$) {
			case 'Unstyled':
				var vdom = html.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					styles);
			case 'Node':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v9 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v9.a;
				var finalStyles = _v9.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 'NodeNS':
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v10 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v10.a;
				var finalStyles = _v10.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 'KeyedNode':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v11 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v11.a;
				var finalStyles = _v11.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v12 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v12.a;
				var finalStyles = _v12.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml = F2(
	function (html, _v0) {
		var nodes = _v0.a;
		var styles = _v0.b;
		switch (html.$) {
			case 'Unstyled':
				var vdomNode = html.a;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					styles);
			case 'Node':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v2 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v2.a;
				var finalStyles = _v2.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 'NodeNS':
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v3 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v3.a;
				var finalStyles = _v3.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 'KeyedNode':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v4 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v4.a;
				var finalStyles = _v4.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v5 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v5.a;
				var finalStyles = _v5.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
		}
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp = F2(
	function (candidate, properties) {
		stylesFromPropertiesHelp:
		while (true) {
			if (!properties.b) {
				return candidate;
			} else {
				var _v1 = properties.a;
				var styles = _v1.b;
				var classname = _v1.c;
				var rest = properties.b;
				if ($elm$core$String$isEmpty(classname)) {
					var $temp$candidate = candidate,
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				} else {
					var $temp$candidate = $elm$core$Maybe$Just(
						_Utils_Tuple2(classname, styles)),
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties = function (properties) {
	var _v0 = A2($rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp, $elm$core$Maybe$Nothing, properties);
	if (_v0.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var _v1 = _v0.a;
		var classname = _v1.a;
		var styles = _v1.b;
		return A2($elm$core$Dict$singleton, classname, styles);
	}
};
var $rtfeldman$elm_css$Css$Structure$ClassSelector = function (a) {
	return {$: 'ClassSelector', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair = function (_v0) {
	var classname = _v0.a;
	var styles = _v0.b;
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
		styles,
		$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$ClassSelector(classname)
				])));
};
var $rtfeldman$elm_css$VirtualDom$Styled$toDeclaration = function (dict) {
	return $rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
		$elm$core$List$singleton(
			$rtfeldman$elm_css$Css$Preprocess$stylesheet(
				A2(
					$elm$core$List$map,
					$rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair,
					$elm$core$Dict$toList(dict)))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode = function (styles) {
	return A3(
		$elm$virtual_dom$VirtualDom$node,
		'style',
		_List_Nil,
		$elm$core$List$singleton(
			$elm$virtual_dom$VirtualDom$text(
				$rtfeldman$elm_css$VirtualDom$Styled$toDeclaration(styles))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$unstyle = F3(
	function (elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$containsKey = F2(
	function (key, pairs) {
		containsKey:
		while (true) {
			if (!pairs.b) {
				return false;
			} else {
				var _v1 = pairs.a;
				var str = _v1.a;
				var rest = pairs.b;
				if (_Utils_eq(key, str)) {
					return true;
				} else {
					var $temp$key = key,
						$temp$pairs = rest;
					key = $temp$key;
					pairs = $temp$pairs;
					continue containsKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey = F2(
	function (_default, pairs) {
		getUnusedKey:
		while (true) {
			if (!pairs.b) {
				return _default;
			} else {
				var _v1 = pairs.a;
				var firstKey = _v1.a;
				var rest = pairs.b;
				var newKey = '_' + firstKey;
				if (A2($rtfeldman$elm_css$VirtualDom$Styled$containsKey, newKey, rest)) {
					var $temp$default = newKey,
						$temp$pairs = rest;
					_default = $temp$default;
					pairs = $temp$pairs;
					continue getUnusedKey;
				} else {
					return newKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode = F2(
	function (allStyles, keyedChildNodes) {
		var styleNodeKey = A2($rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey, '_', keyedChildNodes);
		var finalNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(allStyles);
		return _Utils_Tuple2(styleNodeKey, finalNode);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed = F3(
	function (elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A3(
			$elm$virtual_dom$VirtualDom$keyedNode,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS = F4(
	function (ns, elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A4(
			$elm$virtual_dom$VirtualDom$keyedNodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleNS = F4(
	function (ns, elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled = function (vdom) {
	switch (vdom.$) {
		case 'Unstyled':
			var plainNode = vdom.a;
			return plainNode;
		case 'Node':
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyle, elemType, properties, children);
		case 'NodeNS':
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleNS, ns, elemType, properties, children);
		case 'KeyedNode':
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed, elemType, properties, children);
		default:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS, ns, elemType, properties, children);
	}
};
var $rtfeldman$elm_css$Html$Styled$toUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled;
var $Orange_OpenSource$elm_advanced_grid$Grid$viewCell = F2(
	function (config, item) {
		return A2(config.renderer, config.properties, item);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewRow = F4(
	function (state, idx, listIdx, item) {
		var editedRowClass = function () {
			var _v0 = state.editedItem;
			if (_v0.$ === 'Just') {
				var editedItem = _v0.a;
				return _Utils_eq(item.visibleIndex, editedItem.visibleIndex) ? 'eag-edited-row-class' : '';
			} else {
				return '';
			}
		}();
		return A3(
			$elm$core$Basics$composeL,
			$rtfeldman$elm_css$Html$Styled$toUnstyled,
			$rtfeldman$elm_css$Html$Styled$div(
				_List_fromArray(
					[
						A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'row'),
						$rtfeldman$elm_css$Html$Styled$Attributes$class(editedRowClass),
						$rtfeldman$elm_css$Html$Styled$Attributes$class(
						state.config.rowClass(item)),
						$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-row'),
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$height(
								$rtfeldman$elm_css$Css$px(state.config.lineHeight)),
								$rtfeldman$elm_css$Css$width(
								$rtfeldman$elm_css$Css$px(
									$Orange_OpenSource$elm_advanced_grid$Grid$gridWidth(state))),
								A2($rtfeldman$elm_css$Css$property, 'display', 'grid'),
								A2(
								$rtfeldman$elm_css$Css$property,
								'grid-template-columns',
								$Orange_OpenSource$elm_advanced_grid$Grid$gridTemplateColumns(state))
							]))
					])),
			A2(
				$elm$core$List$map,
				function (columnConfig) {
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$viewCell, columnConfig, item);
				},
				$Orange_OpenSource$elm_advanced_grid$Grid$visibleColumns_(state)));
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$Constant = function (a) {
	return {$: 'Constant', a: a};
};
var $FabienHenon$elm_infinite_list_view$InfiniteList$withConstantHeight = function (height) {
	return $FabienHenon$elm_infinite_list_view$InfiniteList$Constant(height);
};
var $FabienHenon$elm_infinite_list_view$InfiniteList$withOffset = F2(
	function (offset, _v0) {
		var value = _v0.a;
		return $FabienHenon$elm_infinite_list_view$InfiniteList$Config(
			_Utils_update(
				value,
				{offset: offset}));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$infiniteListConfig = function (state) {
	return A2(
		$FabienHenon$elm_infinite_list_view$InfiniteList$withOffset,
		300,
		$FabienHenon$elm_infinite_list_view$InfiniteList$config(
			{
				containerHeight: $elm$core$Basics$round(state.containerHeight),
				itemHeight: $FabienHenon$elm_infinite_list_view$InfiniteList$withConstantHeight(state.config.lineHeight),
				itemView: $Orange_OpenSource$elm_advanced_grid$Grid$viewRow(state)
			}));
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$SetEditedValue = function (a) {
	return {$: 'SetEditedValue', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$editedColumnConfig = function (state) {
	return A2(
		$elm$core$Maybe$withDefault,
		$Orange_OpenSource$elm_advanced_grid$Grid$selectionColumn,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (col) {
					return _Utils_eq(state.editedColumnId, col.properties.id);
				},
				state.config.columns)));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$GotTextareaInfo = function (a) {
	return {$: 'GotTextareaInfo', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$NoOp = {$: 'NoOp'};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$editorId = 'cell-editor';
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $Orange_OpenSource$elm_advanced_grid$Grid$Html$focusOn = F2(
	function (elementId, msg) {
		return A2(
			$elm$core$Task$attempt,
			function (result) {
				return msg;
			},
			$elm$browser$Browser$Dom$focus(elementId));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$textareaId = 'eag-textarea';
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$update = F2(
	function (msg, model) {
		_v0$5:
		while (true) {
			switch (msg.$) {
				case 'GotTextareaInfo':
					if (msg.a.$ === 'Ok') {
						var info = msg.a.a;
						var textareaDimension = {height: info.element.height, width: info.element.width};
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{textareaDimensions: textareaDimension}),
							$elm$core$Platform$Cmd$none);
					} else {
						break _v0$5;
					}
				case 'SetPositionAndDimensions':
					var position = msg.a;
					var dimensions = msg.b;
					var maxY = msg.c;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{cellDimensions: dimensions, maxY: maxY, position: position}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$focusOn, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$editorId, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$NoOp),
									A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$getElementInfo, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$textareaId, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$GotTextareaInfo)
								])));
				case 'SetEditedValue':
					var value = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{value: value}),
						$elm$core$Platform$Cmd$none);
				case 'SetOrigin':
					var position = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{origin: position}),
						A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$focusOn, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$editorId, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$NoOp));
				case 'UserChangedValue':
					var editedValue = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{value: editedValue}),
						$elm$core$Platform$Cmd$none);
				default:
					break _v0$5;
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withEditedCellId = F2(
	function (id, state) {
		return _Utils_update(
			state,
			{editedCellId: id});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withEditedColumnId = F2(
	function (id, state) {
		return _Utils_update(
			state,
			{editedColumnId: id});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withEditedItem = F2(
	function (maybeItem, state) {
		return _Utils_update(
			state,
			{editedItem: maybeItem});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withEditorHasFocus = F2(
	function (isEditing, state) {
		return _Utils_update(
			state,
			{editorHasFocus: isEditing});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$withMaxLength = F2(
	function (maxLength, model) {
		return _Utils_update(
			model,
			{maxLength: maxLength});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$openEditor = F5(
	function (model, columnId, editedCellId, itemToBeEdited, fieldToString) {
		var _v0 = model;
		var state = _v0.a;
		var stringEditorModel = _v0.b;
		var quickFilterModel = _v0.c;
		var updatedState = A2(
			$Orange_OpenSource$elm_advanced_grid$Grid$withEditedItem,
			$elm$core$Maybe$Just(itemToBeEdited),
			A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$withEditedColumnId,
				columnId,
				A2(
					$Orange_OpenSource$elm_advanced_grid$Grid$withEditedCellId,
					editedCellId,
					A2($Orange_OpenSource$elm_advanced_grid$Grid$withEditorHasFocus, true, state))));
		var editedColumn = $Orange_OpenSource$elm_advanced_grid$Grid$editedColumnConfig(updatedState);
		var maxLength = function () {
			var _v2 = editedColumn.properties.editor;
			if (_v2.$ === 'Just') {
				var editor = _v2.a;
				return editor.maxLength;
			} else {
				return 0;
			}
		}();
		var _v1 = A2(
			$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$update,
			$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$SetEditedValue(
				fieldToString(itemToBeEdited)),
			A2($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$withMaxLength, maxLength, stringEditorModel));
		var updatedStringEditorModel = _v1.a;
		var cmd = _v1.b;
		return _Utils_Tuple2(
			A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, updatedState, updatedStringEditorModel, quickFilterModel),
			A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditorMsg, cmd));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$quickFilterButtonId = function (columnConfig) {
	return 'quickFilter-' + columnConfig.properties.id;
};
var $Orange_OpenSource$elm_advanced_grid$Grid$rowsHtmlId = 'eag-rows';
var $FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizesForMultipleHeights = F4(
	function (_v0, getHeight, scrollTop, items) {
		var offset = _v0.a.offset;
		var containerHeight = _v0.a.containerHeight;
		var updateComputations = F2(
			function (item, calculatedTuple) {
				var _v1 = calculatedTuple;
				var idx = _v1.idx;
				var elementsCountToSkip = _v1.elementsCountToSkip;
				var elementsToShow = _v1.elementsToShow;
				var topMargin = _v1.topMargin;
				var currentHeight = _v1.currentHeight;
				var height = A2(getHeight, idx, item);
				var newCurrentHeight = currentHeight + height;
				return (_Utils_cmp(
					newCurrentHeight,
					$elm$core$Basics$ceiling(scrollTop) - offset) < 1) ? _Utils_update(
					calculatedTuple,
					{currentHeight: newCurrentHeight, elementsCountToSkip: elementsCountToSkip + 1, idx: idx + 1, topMargin: topMargin + height}) : ((_Utils_cmp(
					currentHeight,
					($elm$core$Basics$floor(scrollTop) + containerHeight) + offset) < 0) ? _Utils_update(
					calculatedTuple,
					{
						currentHeight: newCurrentHeight,
						elementsToShow: A2($elm$core$List$cons, item, elementsToShow),
						idx: idx + 1
					}) : _Utils_update(
					calculatedTuple,
					{currentHeight: newCurrentHeight, idx: idx + 1}));
			});
		var initialValue = {currentHeight: 0, elementsCountToSkip: 0, elementsToShow: _List_Nil, idx: 0, topMargin: 0};
		var computedValues = A3($elm$core$List$foldl, updateComputations, initialValue, items);
		return {
			elements: $elm$core$List$reverse(computedValues.elementsToShow),
			skipCount: computedValues.elementsCountToSkip,
			topMargin: computedValues.topMargin,
			totalHeight: computedValues.currentHeight
		};
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizesForSimpleHeight = F4(
	function (_v0, itemHeight, scrollTop, items) {
		var offset = _v0.a.offset;
		var containerHeight = _v0.a.containerHeight;
		var totalHeight = $elm$core$List$length(items) * itemHeight;
		var elementsCountToSkip = (A2(
			$elm$core$Basics$max,
			0,
			$elm$core$Basics$ceiling(scrollTop) - offset) / itemHeight) | 0;
		var topMargin = elementsCountToSkip * itemHeight;
		var elementsCountToShow = ((((offset * 2) + containerHeight) / itemHeight) | 0) + 1;
		var elementsToShow = A2(
			$elm$core$Basics$composeR,
			$elm$core$List$drop(elementsCountToSkip),
			$elm$core$List$take(elementsCountToShow))(items);
		return {elements: elementsToShow, skipCount: elementsCountToSkip, topMargin: topMargin, totalHeight: totalHeight};
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizes = F3(
	function (configValue, scrollTop, items) {
		var itemHeight = configValue.a.itemHeight;
		var itemView = configValue.a.itemView;
		var customContainer = configValue.a.customContainer;
		if (itemHeight.$ === 'Constant') {
			var height = itemHeight.a;
			return A4($FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizesForSimpleHeight, configValue, height, scrollTop, items);
		} else {
			var _function = itemHeight.a;
			return A4($FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizesForMultipleHeights, configValue, _function, scrollTop, items);
		}
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$firstNItemsHeight = F3(
	function (idx, configValue, items) {
		var _v0 = A3(
			$FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizes,
			configValue,
			0,
			A2($elm$core$List$take, idx, items));
		var totalHeight = _v0.totalHeight;
		return totalHeight;
	});
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $FabienHenon$elm_infinite_list_view$InfiniteList$scrollToNthItem = function (_v0) {
	var postScrollMessage = _v0.postScrollMessage;
	var listHtmlId = _v0.listHtmlId;
	var itemIndex = _v0.itemIndex;
	var configValue = _v0.configValue;
	var items = _v0.items;
	return A2(
		$elm$core$Task$attempt,
		function (_v1) {
			return postScrollMessage;
		},
		A3(
			$elm$browser$Browser$Dom$setViewportOf,
			listHtmlId,
			0,
			A3($FabienHenon$elm_infinite_list_view$InfiniteList$firstNItemsHeight, itemIndex, configValue, items)));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$NoOp = {$: 'NoOp'};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$Open = {$: 'Open'};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$openedQuickFilterHtmlId = 'openedQuickFilter';
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A2($elm$core$Dict$remove, key, dict));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'UserClosedQuickFilter':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{state: $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$Closed}),
					$elm$core$Platform$Cmd$none);
			case 'FocusLost':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{state: $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$Closed}),
					$elm$core$Platform$Cmd$none);
			case 'NoOp':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'SetOrigin':
				var position = msg.a;
				var maxX = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{maxX: maxX, origin: position}),
					A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$focusOn, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$openedQuickFilterHtmlId, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$NoOp));
			case 'SetPosition':
				var position = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{position: position}),
					A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$focusOn, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$openedQuickFilterHtmlId, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$NoOp));
			case 'UserOpenedQuickFilter':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{state: $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$Open}),
					$elm$core$Platform$Cmd$none);
			case 'UserToggledEntry':
				var entry = msg.a;
				var outputEntries = A2($elm$core$Set$member, entry, model.outputStrings) ? A2($elm$core$Set$remove, entry, model.outputStrings) : A2($elm$core$Set$insert, entry, model.outputStrings);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{outputStrings: outputEntries}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{outputStrings: $elm$core$Set$empty}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$closeQuickFilter = function (state) {
	return _Utils_update(
		state,
		{filterHasFocus: false, quickFilteredColumn: $elm$core$Maybe$Nothing});
};
var $Orange_OpenSource$elm_advanced_grid$Grid$isColumn = F2(
	function (firstColumnConfig, secondColumnConfig) {
		return _Utils_eq(firstColumnConfig.properties.id, secondColumnConfig.properties.id);
	});
var $elm_community$list_extra$List$Extra$setIf = F3(
	function (predicate, replacement, list) {
		return A3(
			$elm_community$list_extra$List$Extra$updateIf,
			predicate,
			$elm$core$Basics$always(replacement),
			list);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateExpressionFilter = F2(
	function (filters, filteringString) {
		var lowerCaseFilteringString = $elm$core$String$toLower(filteringString);
		return A2(
			$elm$core$Result$map,
			filters.filter,
			A2($elm$parser$Parser$run, filters.parser, lowerCaseFilteringString));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateFilter = F2(
	function (filteringString, filters) {
		var _v0 = A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateExpressionFilter, filters, filteringString);
		if (_v0.$ === 'Ok') {
			var value = _v0.a;
			return $elm$core$Maybe$Just(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$parseFilteringString = F2(
	function (filteringValue, filter) {
		var filteringString = A2($elm$core$Maybe$withDefault, '', filteringValue);
		if (filteringString === '') {
			return $elm$core$Maybe$Nothing;
		} else {
			switch (filter.$) {
				case 'StringFilter':
					var stringTypedFilter = filter.a;
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateFilter, filteringString, stringTypedFilter);
				case 'IntFilter':
					var intTypedFilter = filter.a;
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateFilter, filteringString, intTypedFilter);
				case 'FloatFilter':
					var floatTypedFilter = filter.a;
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateFilter, filteringString, floatTypedFilter);
				case 'BoolFilter':
					var boolTypedFilter = filter.a;
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateFilter, filteringString, boolTypedFilter);
				default:
					return $elm$core$Maybe$Nothing;
			}
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$columnFilters = function (model) {
	return A2(
		$elm$core$List$filterMap,
		function (col) {
			return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$parseFilteringString, col.filteringValue, col.filters);
		},
		model.config.columns);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$orderBy = F3(
	function (model, columnConfig, order) {
		switch (order.$) {
			case 'Descending':
				return _Utils_Tuple2(
					$elm$core$List$reverse(
						A2($elm$core$List$sortWith, columnConfig.comparator, model.visibleItems)),
					$Orange_OpenSource$elm_advanced_grid$Grid$Descending);
			case 'Ascending':
				return _Utils_Tuple2(
					A2($elm$core$List$sortWith, columnConfig.comparator, model.visibleItems),
					$Orange_OpenSource$elm_advanced_grid$Grid$Ascending);
			default:
				return _Utils_Tuple2(model.visibleItems, $Orange_OpenSource$elm_advanced_grid$Grid$Unsorted);
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateIndexes = function (items) {
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (i, item) {
				return _Utils_update(
					item,
					{visibleIndex: i});
			}),
		items);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$sort = F4(
	function (columnConfig, order, sorter, state) {
		var _v0 = A3(sorter, state, columnConfig, order);
		var sortedItems = _v0.a;
		var newOrder = _v0.b;
		var updatedItems = $Orange_OpenSource$elm_advanced_grid$Grid$updateIndexes(sortedItems);
		return _Utils_update(
			state,
			{
				order: newOrder,
				sortedBy: $elm$core$Maybe$Just(columnConfig),
				visibleItems: updatedItems
			});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withVisibleItems = F2(
	function (visibleItems, state) {
		return _Utils_update(
			state,
			{visibleItems: visibleItems});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems = function (state) {
	var allItems = A2(
		$elm$core$List$indexedMap,
		F2(
			function (contentIndex, value) {
				return A2($Orange_OpenSource$elm_advanced_grid$Grid$Item$create, value, contentIndex);
			}),
		state.content);
	var visibleItems = A2(
		$elm$core$List$indexedMap,
		F2(
			function (index, item) {
				return _Utils_update(
					item,
					{visibleIndex: index});
			}),
		A3(
			$elm$core$List$foldl,
			F2(
				function (filter, remainingValues) {
					return A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.data;
							},
							filter),
						remainingValues);
				}),
			allItems,
			$Orange_OpenSource$elm_advanced_grid$Grid$columnFilters(state)));
	var _v0 = state.sortedBy;
	if (_v0.$ === 'Just') {
		var columnConfig = _v0.a;
		return A4(
			$Orange_OpenSource$elm_advanced_grid$Grid$sort,
			columnConfig,
			state.order,
			$Orange_OpenSource$elm_advanced_grid$Grid$orderBy,
			A2($Orange_OpenSource$elm_advanced_grid$Grid$withVisibleItems, visibleItems, state));
	} else {
		return A2($Orange_OpenSource$elm_advanced_grid$Grid$withVisibleItems, visibleItems, state);
	}
};
var $Orange_OpenSource$elm_advanced_grid$Grid$withConfigState = F2(
	function (config, state) {
		return _Utils_update(
			state,
			{config: config});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState = F2(
	function (columns, state) {
		var config = state.config;
		return A2(
			$Orange_OpenSource$elm_advanced_grid$Grid$withConfigState,
			_Utils_update(
				config,
				{
					columns: $Orange_OpenSource$elm_advanced_grid$Grid$sanitizedColumns(columns)
				}),
			state);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$applyFilter = F3(
	function (state, columnConfig, filteringValue) {
		var newColumnconfig = _Utils_update(
			columnConfig,
			{filteringValue: filteringValue});
		var newColumns = A3(
			$elm_community$list_extra$List$Extra$setIf,
			$Orange_OpenSource$elm_advanced_grid$Grid$isColumn(columnConfig),
			newColumnconfig,
			state.config.columns);
		var newState = A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, newColumns, state);
		return $Orange_OpenSource$elm_advanced_grid$Grid$closeQuickFilter(
			$Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems(newState));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$prependEqualOperator = function (operandValue) {
	var firstChar = A2($elm$core$String$left, 1, operandValue);
	switch (firstChar) {
		case '>':
			return operandValue;
		case '<':
			return operandValue;
		case '=':
			return operandValue;
		default:
			return '=' + operandValue;
	}
};
var $Orange_OpenSource$elm_advanced_grid$Grid$applyQuickFilter = F2(
	function (state, quickFilterModel) {
		var selectedEntries = $elm$core$Set$toList(quickFilterModel.outputStrings);
		var concatenatedEntries = ($elm$core$List$length(selectedEntries) > 1) ? A2(
			$elm$core$String$join,
			$Orange_OpenSource$elm_advanced_grid$Grid$Parsers$orKeyword(state.config.labels),
			A2($elm$core$List$map, $Orange_OpenSource$elm_advanced_grid$Grid$prependEqualOperator, selectedEntries)) : A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				$Orange_OpenSource$elm_advanced_grid$Grid$prependEqualOperator,
				$elm$core$List$head(selectedEntries)));
		var newFilteringValue = (concatenatedEntries === '') ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(concatenatedEntries);
		var _v0 = state.quickFilteredColumn;
		if (_v0.$ === 'Just') {
			var column = _v0.a;
			return A3($Orange_OpenSource$elm_advanced_grid$Grid$applyFilter, state, column, newFilteringValue);
		} else {
			return state;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateQuickFilter = F2(
	function (msg, model) {
		var _v0 = model;
		var state = _v0.a;
		var stringEditorModel = _v0.b;
		var quickFilterModel = _v0.c;
		var _v1 = A2($Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$update, msg, quickFilterModel);
		var updatedQuickFilterModel = _v1.a;
		var cmd = _v1.b;
		switch (msg.$) {
			case 'UserClickedClear':
				var updatedState = A2($Orange_OpenSource$elm_advanced_grid$Grid$applyQuickFilter, state, updatedQuickFilterModel);
				return _Utils_Tuple2(
					A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, updatedState, stringEditorModel, quickFilterModel),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilterMsg, cmd));
			case 'UserToggledEntry':
				var updatedState = A2($Orange_OpenSource$elm_advanced_grid$Grid$applyQuickFilter, state, updatedQuickFilterModel);
				return _Utils_Tuple2(
					A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, updatedState, stringEditorModel, quickFilterModel),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilterMsg, cmd));
			default:
				return _Utils_Tuple2(
					A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, state, stringEditorModel, updatedQuickFilterModel),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilterMsg, cmd));
		}
	});
var $elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$hasId = F2(
	function (id, columnConfig) {
		return _Utils_eq(columnConfig.properties.id, id);
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		nodeList: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		nodeListSize: (len / $elm$core$Array$branchFactor) | 0,
		tail: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$moveItemLeft = F3(
	function (list, originIndex, indexDelta) {
		var array = $elm$core$Array$fromList(list);
		var beforeDestination = A3($elm$core$Array$slice, 0, originIndex - indexDelta, array);
		var betweenDestinationAndOrigin = A3($elm$core$Array$slice, originIndex - indexDelta, originIndex, array);
		var origin = A3($elm$core$Array$slice, originIndex, originIndex + 1, array);
		var afterOrigin = A3(
			$elm$core$Array$slice,
			originIndex + 1,
			$elm$core$Array$length(array),
			array);
		return $elm$core$Array$toList(
			A3(
				$elm$core$List$foldr,
				$elm$core$Array$append,
				$elm$core$Array$empty,
				_List_fromArray(
					[beforeDestination, origin, betweenDestinationAndOrigin, afterOrigin])));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$moveItemRight = F3(
	function (list, originIndex, indexDelta) {
		var array = $elm$core$Array$fromList(list);
		var beforeOrigin = A3($elm$core$Array$slice, 0, originIndex, array);
		var betweenOriginAndDestination = A3($elm$core$Array$slice, originIndex + 1, (originIndex + indexDelta) + 1, array);
		var origin = A3($elm$core$Array$slice, originIndex, originIndex + 1, array);
		var afterDestination = A3(
			$elm$core$Array$slice,
			(originIndex + indexDelta) + 1,
			$elm$core$Array$length(array),
			array);
		return $elm$core$Array$toList(
			A3(
				$elm$core$List$foldr,
				$elm$core$Array$append,
				$elm$core$Array$empty,
				_List_fromArray(
					[beforeOrigin, betweenOriginAndDestination, origin, afterDestination])));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$moveColumn = F3(
	function (destinationColumn, originColumn, list) {
		var originColumnIndex = A2(
			$elm$core$Maybe$withDefault,
			-1,
			A2(
				$elm_community$list_extra$List$Extra$findIndex,
				$Orange_OpenSource$elm_advanced_grid$Grid$isColumn(originColumn),
				list));
		var destinationColumnIndex = A2(
			$elm$core$Maybe$withDefault,
			-1,
			A2(
				$elm_community$list_extra$List$Extra$findIndex,
				$Orange_OpenSource$elm_advanced_grid$Grid$isColumn(destinationColumn),
				list));
		return (_Utils_cmp(originColumnIndex, destinationColumnIndex) < 0) ? A3($Orange_OpenSource$elm_advanced_grid$Grid$moveItemRight, list, originColumnIndex, destinationColumnIndex - originColumnIndex) : A3($Orange_OpenSource$elm_advanced_grid$Grid$moveItemLeft, list, originColumnIndex, originColumnIndex - destinationColumnIndex);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$minColumnWidth = 25;
var $Orange_OpenSource$elm_advanced_grid$Grid$updatePropertiesInColumnConfig = F2(
	function (updateFunction, columnConfig) {
		return _Utils_update(
			columnConfig,
			{
				properties: updateFunction(columnConfig.properties)
			});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateColumnProperties = F3(
	function (updateFunction, model, columnId) {
		return A3(
			$elm_community$list_extra$List$Extra$updateIf,
			$Orange_OpenSource$elm_advanced_grid$Grid$hasId(columnId),
			$Orange_OpenSource$elm_advanced_grid$Grid$updatePropertiesInColumnConfig(updateFunction),
			model.config.columns);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateColumnWidthProperty = F3(
	function (model, columnConfig, width) {
		var setWidth = function (properties) {
			return _Utils_update(
				properties,
				{width: width});
		};
		return A3($Orange_OpenSource$elm_advanced_grid$Grid$updateColumnProperties, setWidth, model, columnConfig.properties.id);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$resizeColumn = F2(
	function (state, x) {
		var _v0 = state.resizedColumn;
		if (_v0.$ === 'Just') {
			var columnConfig = _v0.a;
			var deltaX = x - state.dragStartX;
			var newWidth = columnConfig.properties.width + $elm$core$Basics$round(deltaX);
			var newColumns = (_Utils_cmp(newWidth, $Orange_OpenSource$elm_advanced_grid$Grid$minColumnWidth) > 0) ? A3($Orange_OpenSource$elm_advanced_grid$Grid$updateColumnWidthProperty, state, columnConfig, newWidth) : state.config.columns;
			return A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, newColumns, state);
		} else {
			return state;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$setFilter = F2(
	function (filterValues, columnConfig) {
		var value = A2($elm$core$Dict$get, columnConfig.properties.id, filterValues);
		return _Utils_update(
			columnConfig,
			{filteringValue: value});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$toggleOrder = F3(
	function (model, columnConfig, order) {
		if (order.$ === 'Ascending') {
			return _Utils_Tuple2(
				$elm$core$List$reverse(
					A2($elm$core$List$sortWith, columnConfig.comparator, model.visibleItems)),
				$Orange_OpenSource$elm_advanced_grid$Grid$Descending);
		} else {
			return _Utils_Tuple2(
				A2($elm$core$List$sortWith, columnConfig.comparator, model.visibleItems),
				$Orange_OpenSource$elm_advanced_grid$Grid$Ascending);
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$toggleSelection = function (item) {
	return _Utils_update(
		item,
		{selected: !item.selected});
};
var $elm_community$list_extra$List$Extra$updateAt = F3(
	function (index, fn, list) {
		if (index < 0) {
			return list;
		} else {
			var tail = A2($elm$core$List$drop, index, list);
			var head = A2($elm$core$List$take, index, list);
			if (tail.b) {
				var x = tail.a;
				var xs = tail.b;
				return _Utils_ap(
					head,
					A2(
						$elm$core$List$cons,
						fn(x),
						xs));
			} else {
				return list;
			}
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withContent = F2(
	function (data, state) {
		return _Utils_update(
			state,
			{content: data});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withDraggedColumn = F2(
	function (draggedColumn, state) {
		return _Utils_update(
			state,
			{draggedColumn: draggedColumn});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateState = F2(
	function (msg, state) {
		switch (msg.$) {
			case 'ColumnsModificationRequested':
				var columns = msg.a;
				return A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, columns, state);
			case 'FilterLostFocus':
				return $Orange_OpenSource$elm_advanced_grid$Grid$closeQuickFilter(
					_Utils_update(
						state,
						{filterHasFocus: false}));
			case 'FilterModified':
				var columnConfig = msg.a;
				var maybeString = msg.b;
				var filterString = function () {
					if ((maybeString.$ === 'Just') && (maybeString.a === '')) {
						return $elm$core$Maybe$Nothing;
					} else {
						return maybeString;
					}
				}();
				return A3($Orange_OpenSource$elm_advanced_grid$Grid$applyFilter, state, columnConfig, filterString);
			case 'GotCellInfo':
				return state;
			case 'GotHeaderContainerInfo':
				if (msg.a.$ === 'Ok') {
					var info = msg.a.a;
					return _Utils_update(
						state,
						{
							headerContainerPosition: {x: info.element.x, y: info.element.y}
						});
				} else {
					return state;
				}
			case 'GotParentContainerInfo':
				if (msg.a.$ === 'Ok') {
					var info = msg.a.a;
					return _Utils_update(
						state,
						{containerHeight: (info.viewport.height - info.element.y) - state.config.footerHeight, containerWidth: info.element.width});
				} else {
					return state;
				}
			case 'GotQuickFilterButtonInfo':
				return state;
			case 'GotRowsContainerInfo':
				return state;
			case 'InfiniteListMsg':
				var infList = msg.a;
				return _Utils_update(
					state,
					{infList: infList});
			case 'NoOp':
				return state;
			case 'QuickFilterMsg':
				return state;
			case 'SetFilters':
				var filterValues = msg.a;
				var newColumns = A2(
					$elm$core$List$map,
					$Orange_OpenSource$elm_advanced_grid$Grid$setFilter(filterValues),
					state.config.columns);
				var newState = A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, newColumns, state);
				return $Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems(newState);
			case 'SetSorting':
				var columnId = msg.a;
				var sorting = msg.b;
				var sortedColumnConfig = A2(
					$elm_community$list_extra$List$Extra$find,
					$Orange_OpenSource$elm_advanced_grid$Grid$hasId(columnId),
					state.config.columns);
				if (sortedColumnConfig.$ === 'Just') {
					var columnConfig = sortedColumnConfig.a;
					return A4($Orange_OpenSource$elm_advanced_grid$Grid$sort, columnConfig, sorting, $Orange_OpenSource$elm_advanced_grid$Grid$orderBy, state);
				} else {
					return state;
				}
			case 'ScrollTo':
				return state;
			case 'ShowPreferences':
				return _Utils_update(
					state,
					{showPreferences: true});
			case 'StringEditorMsg':
				return state;
			case 'UpdateContent':
				var updateContent = msg.a;
				var updatedData = A2($elm$core$List$map, updateContent, state.content);
				return $Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems(
					A2($Orange_OpenSource$elm_advanced_grid$Grid$withContent, updatedData, state));
			case 'UpdateContentPreservingSelection':
				var updateContent = msg.a;
				var updatedData = A2($elm$core$List$map, updateContent, state.content);
				var updateVisibleItem = function (item) {
					return _Utils_update(
						item,
						{
							data: updateContent(item.data)
						});
				};
				var updatedVisibleItems = A2($elm$core$List$map, updateVisibleItem, state.visibleItems);
				return A2(
					$Orange_OpenSource$elm_advanced_grid$Grid$withVisibleItems,
					updatedVisibleItems,
					A2($Orange_OpenSource$elm_advanced_grid$Grid$withContent, updatedData, state));
			case 'UserClickedDragHandle':
				var columnConfig = msg.a;
				var mousePosition = msg.b;
				var draggedColumn = {column: columnConfig, dragStartX: mousePosition.x, lastSwappedColumnId: '', x: mousePosition.x};
				return A2(
					$Orange_OpenSource$elm_advanced_grid$Grid$withDraggedColumn,
					$elm$core$Maybe$Just(draggedColumn),
					state);
			case 'UserClickedFilter':
				return _Utils_update(
					state,
					{filterHasFocus: true});
			case 'UserClickedOutsideOfQuickFilter':
				return _Utils_update(
					state,
					{quickFilteredColumn: $elm$core$Maybe$Nothing});
			case 'UserClickedQuickFilterButton':
				return state;
			case 'UserClickedHeader':
				var columnConfig = msg.a;
				return state.filterHasFocus ? state : A4($Orange_OpenSource$elm_advanced_grid$Grid$sort, columnConfig, state.order, $Orange_OpenSource$elm_advanced_grid$Grid$toggleOrder, state);
			case 'UserClickedLine':
				var item = msg.a;
				return state.editorHasFocus ? state : _Utils_update(
					state,
					{
						clickedItem: $elm$core$Maybe$Just(item)
					});
			case 'UserClickedPreferenceCloseButton':
				return _Utils_update(
					state,
					{showPreferences: false});
			case 'UserClickedResizeHandle':
				var columnConfig = msg.a;
				var position = msg.b;
				return _Utils_update(
					state,
					{
						dragStartX: position.x,
						resizedColumn: $elm$core$Maybe$Just(columnConfig)
					});
			case 'UserDraggedColumn':
				var mousePosition = msg.a;
				var newDraggedColumn = function () {
					var _v3 = state.draggedColumn;
					if (_v3.$ === 'Just') {
						var draggedColumn = _v3.a;
						return $elm$core$Maybe$Just(
							_Utils_update(
								draggedColumn,
								{x: mousePosition.x}));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				return _Utils_update(
					state,
					{draggedColumn: newDraggedColumn});
			case 'UserDoubleClickedEditableCell':
				return state;
			case 'UserEndedMouseInteraction':
				return _Utils_update(
					state,
					{draggedColumn: $elm$core$Maybe$Nothing, resizedColumn: $elm$core$Maybe$Nothing});
			case 'UserHoveredDragHandle':
				return state;
			case 'UserMovedResizeHandle':
				var position = msg.a;
				return A2($Orange_OpenSource$elm_advanced_grid$Grid$resizeColumn, state, position.x);
			case 'UserResizedWindow':
				return state;
			case 'UserSwappedColumns':
				var columnConfig = msg.a;
				var draggedColumnConfig = msg.b;
				var _v4 = state.draggedColumn;
				if (_v4.$ === 'Just') {
					var draggedColumn = _v4.a;
					if (_Utils_eq(columnConfig.properties.id, draggedColumn.lastSwappedColumnId)) {
						return state;
					} else {
						var newColumns = A3($Orange_OpenSource$elm_advanced_grid$Grid$moveColumn, columnConfig, draggedColumnConfig, state.config.columns);
						return A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$withDraggedColumn,
							$elm$core$Maybe$Just(
								_Utils_update(
									draggedColumn,
									{lastSwappedColumnId: columnConfig.properties.id})),
							A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, newColumns, state));
					}
				} else {
					return state;
				}
			case 'UserToggledAllItemSelection':
				var newStatus = !state.isAllSelected;
				var setSelectionStatus = function (item) {
					return _Utils_update(
						item,
						{selected: newStatus});
				};
				var updatedVisibleItems = A2($elm$core$List$map, setSelectionStatus, state.visibleItems);
				return _Utils_update(
					state,
					{isAllSelected: newStatus, visibleItems: updatedVisibleItems});
			case 'UserToggledColumnVisibility':
				var columnConfig = msg.a;
				var toggleVisibility = function (properties) {
					return _Utils_update(
						properties,
						{visible: !properties.visible});
				};
				var newColumns = A3(
					$elm_community$list_extra$List$Extra$updateIf,
					$Orange_OpenSource$elm_advanced_grid$Grid$isColumn(columnConfig),
					function (col) {
						return _Utils_update(
							col,
							{filteringValue: $elm$core$Maybe$Nothing});
					},
					A3($Orange_OpenSource$elm_advanced_grid$Grid$updateColumnProperties, toggleVisibility, state, columnConfig.properties.id));
				var stateWithNewColumns = A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, newColumns, state);
				return $Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems(stateWithNewColumns);
			case 'UserToggledSelection':
				var item = msg.a;
				var newItems = A3(
					$elm_community$list_extra$List$Extra$updateAt,
					item.visibleIndex,
					function (it) {
						return $Orange_OpenSource$elm_advanced_grid$Grid$toggleSelection(it);
					},
					state.visibleItems);
				return _Utils_update(
					state,
					{visibleItems: newItems});
			default:
				return state;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$closeEditor = function (state) {
	return A2(
		$Orange_OpenSource$elm_advanced_grid$Grid$withEditedItem,
		$elm$core$Maybe$Nothing,
		A2(
			$Orange_OpenSource$elm_advanced_grid$Grid$withEditedColumnId,
			'',
			A2($Orange_OpenSource$elm_advanced_grid$Grid$withEditorHasFocus, false, state)));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$applyStringEdition = F2(
	function (editedItem, model) {
		var _v0 = model;
		var state = _v0.a;
		var stringEditorModel = _v0.b;
		var quickFilterModel = _v0.c;
		var updateEditedValue = F2(
			function (index, item) {
				if (_Utils_eq(index, editedItem.contentIndex)) {
					var editedColumn = $Orange_OpenSource$elm_advanced_grid$Grid$editedColumnConfig(state);
					var _v1 = editedColumn.properties.editor;
					if (_v1.$ === 'Just') {
						var editor = _v1.a;
						return A2(editor.fromString, editedItem, stringEditorModel.value).data;
					} else {
						return item;
					}
				} else {
					return item;
				}
			});
		var updatedContent = A2($elm$core$List$indexedMap, updateEditedValue, state.content);
		var updatedState = $Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems(
			A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$withContent,
				updatedContent,
				$Orange_OpenSource$elm_advanced_grid$Grid$closeEditor(state)));
		return A3(
			$Orange_OpenSource$elm_advanced_grid$Grid$Model,
			updatedState,
			$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$init(state.labels),
			quickFilterModel);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$escapeKeyCode = 27;
var $Orange_OpenSource$elm_advanced_grid$Grid$updateStringEditor = F2(
	function (msg, model) {
		var _v0 = model;
		var state = _v0.a;
		var stringEditorModel = _v0.b;
		var quickFilterModel = _v0.c;
		switch (msg.$) {
			case 'EditorLostFocus':
				var editedItem = msg.a;
				return _Utils_Tuple2(
					A2($Orange_OpenSource$elm_advanced_grid$Grid$applyStringEdition, editedItem, model),
					$elm$core$Platform$Cmd$none);
			case 'UserClickedCancel':
				return _Utils_Tuple2(
					A3(
						$Orange_OpenSource$elm_advanced_grid$Grid$Model,
						$Orange_OpenSource$elm_advanced_grid$Grid$closeEditor(state),
						$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$init(state.labels),
						quickFilterModel),
					$elm$core$Platform$Cmd$none);
			case 'OnKeyUp':
				var keyCode = msg.a;
				return _Utils_eq(keyCode, $Orange_OpenSource$elm_advanced_grid$Grid$escapeKeyCode) ? _Utils_Tuple2(
					A3(
						$Orange_OpenSource$elm_advanced_grid$Grid$Model,
						$Orange_OpenSource$elm_advanced_grid$Grid$closeEditor(state),
						$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$init(state.labels),
						quickFilterModel),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'UserSubmittedForm':
				var editedItem = msg.a;
				return _Utils_Tuple2(
					A2($Orange_OpenSource$elm_advanced_grid$Grid$applyStringEdition, editedItem, model),
					$elm$core$Platform$Cmd$none);
			default:
				var stringEditorMsg = msg;
				var _v2 = A2($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$update, stringEditorMsg, stringEditorModel);
				var updatedStringEditorModel = _v2.a;
				var cmd = _v2.b;
				return _Utils_Tuple2(
					A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, state, updatedStringEditorModel, quickFilterModel),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditorMsg, cmd));
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$update = F2(
	function (msg, model) {
		var _v0 = model;
		var state = _v0.a;
		var stringEditorModel = _v0.b;
		var quickFilterModel = _v0.c;
		switch (msg.$) {
			case 'GotCellInfo':
				if (msg.a.$ === 'Ok') {
					var info = msg.a.a;
					var containerHeight = state.containerHeight;
					var cellPosition = {x: info.element.x, y: info.element.y};
					var cellDimensions = {height: info.element.height, width: info.element.width};
					var _v2 = A2(
						$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$update,
						A3($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$SetPositionAndDimensions, cellPosition, cellDimensions, containerHeight),
						stringEditorModel);
					var updatedStringEditorModel = _v2.a;
					var cmd = _v2.b;
					return _Utils_Tuple2(
						A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, state, updatedStringEditorModel, quickFilterModel),
						A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditorMsg, cmd));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotQuickFilterButtonInfo':
				if (msg.a.$ === 'Ok') {
					var info = msg.a.a;
					var position = {x: info.element.x, y: info.element.y};
					var _v3 = A2(
						$Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$update,
						$Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$SetPosition(position),
						quickFilterModel);
					var updatedQuickFilterModel = _v3.a;
					var cmd = _v3.b;
					return _Utils_Tuple2(
						A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, state, stringEditorModel, updatedQuickFilterModel),
						A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilterMsg, cmd));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotRowsContainerInfo':
				if (msg.a.$ === 'Ok') {
					var info = msg.a.a;
					var position = {x: info.element.x, y: info.element.y - state.config.headerHeight};
					var quickFilterMaxX = state.containerWidth - position.x;
					var _v4 = A2(
						$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$update,
						$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$SetOrigin(position),
						stringEditorModel);
					var updatedStringEditorModel = _v4.a;
					var stringEditorCmd = _v4.b;
					var _v5 = A2(
						$Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$update,
						A2($Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$SetOrigin, position, quickFilterMaxX),
						quickFilterModel);
					var updatedQuickFilterModel = _v5.a;
					var quickFilterCommand = _v5.b;
					return _Utils_Tuple2(
						A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, state, updatedStringEditorModel, updatedQuickFilterModel),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditorMsg, stringEditorCmd),
									A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilterMsg, quickFilterCommand)
								])));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'UserScrolledRowsVertically':
				return _Utils_Tuple2(
					model,
					A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$getElementInfo, state.editedCellId, $Orange_OpenSource$elm_advanced_grid$Grid$GotCellInfo));
			case 'QuickFilterMsg':
				var quickFilterMsg = msg.a;
				return A2($Orange_OpenSource$elm_advanced_grid$Grid$updateQuickFilter, quickFilterMsg, model);
			case 'ScrollTo':
				var isTargetItem = msg.a;
				var targetItemIndex = A2(
					$elm$core$Maybe$withDefault,
					0,
					A2($elm_community$list_extra$List$Extra$findIndex, isTargetItem, state.visibleItems));
				return _Utils_Tuple2(
					A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, state, stringEditorModel, quickFilterModel),
					$FabienHenon$elm_infinite_list_view$InfiniteList$scrollToNthItem(
						{
							configValue: $Orange_OpenSource$elm_advanced_grid$Grid$infiniteListConfig(state),
							itemIndex: targetItemIndex,
							items: state.visibleItems,
							listHtmlId: $Orange_OpenSource$elm_advanced_grid$Grid$rowsHtmlId,
							postScrollMessage: $Orange_OpenSource$elm_advanced_grid$Grid$NoOp
						}));
			case 'StringEditorMsg':
				var stringEditorMsg = msg.a;
				return A2($Orange_OpenSource$elm_advanced_grid$Grid$updateStringEditor, stringEditorMsg, model);
			case 'UserClickedQuickFilterButton':
				var columnConfig = msg.a;
				var columnWidth = columnConfig.properties.width;
				var allValuesInColumn = A2($Orange_OpenSource$elm_advanced_grid$Grid$columnValues, columnConfig, state);
				var updatedQuickFilterModel = A4($Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$init, allValuesInColumn, columnConfig.filteringValue, state.labels, columnWidth);
				return _Utils_Tuple2(
					A3(
						$Orange_OpenSource$elm_advanced_grid$Grid$Model,
						_Utils_update(
							state,
							{
								filterHasFocus: true,
								quickFilteredColumn: $elm$core$Maybe$Just(columnConfig)
							}),
						stringEditorModel,
						updatedQuickFilterModel),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$getElementInfo, $Orange_OpenSource$elm_advanced_grid$Grid$rowsHtmlId, $Orange_OpenSource$elm_advanced_grid$Grid$GotRowsContainerInfo),
								A2(
								$Orange_OpenSource$elm_advanced_grid$Grid$Html$getElementInfo,
								$Orange_OpenSource$elm_advanced_grid$Grid$quickFilterButtonId(columnConfig),
								$Orange_OpenSource$elm_advanced_grid$Grid$GotQuickFilterButtonInfo)
							])));
			case 'UserDoubleClickedEditableCell':
				var itemToBeEdited = msg.a;
				var fieldToString = msg.b;
				var columnId = msg.c;
				var editableCellId = msg.d;
				var _v6 = A5($Orange_OpenSource$elm_advanced_grid$Grid$openEditor, model, columnId, editableCellId, itemToBeEdited, fieldToString);
				var updatedStringEditorModel = _v6.a;
				var cmd = _v6.b;
				return _Utils_Tuple2(
					updatedStringEditorModel,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$getElementInfo, $Orange_OpenSource$elm_advanced_grid$Grid$rowsHtmlId, $Orange_OpenSource$elm_advanced_grid$Grid$GotRowsContainerInfo),
								A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$getElementInfo, editableCellId, $Orange_OpenSource$elm_advanced_grid$Grid$GotCellInfo),
								cmd
							])));
			case 'UserHoveredDragHandle':
				return _Utils_Tuple2(
					A3($Orange_OpenSource$elm_advanced_grid$Grid$Model, state, stringEditorModel, quickFilterModel),
					A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$getElementInfo, $Orange_OpenSource$elm_advanced_grid$Grid$headerContainerId, $Orange_OpenSource$elm_advanced_grid$Grid$GotHeaderContainerInfo));
			case 'UserResizedWindow':
				return _Utils_Tuple2(
					model,
					A2($Orange_OpenSource$elm_advanced_grid$Grid$Html$getElementInfo, state.config.containerId, $Orange_OpenSource$elm_advanced_grid$Grid$GotParentContainerInfo));
			default:
				return _Utils_Tuple2(
					A3(
						$Orange_OpenSource$elm_advanced_grid$Grid$Model,
						A2($Orange_OpenSource$elm_advanced_grid$Grid$updateState, msg, state),
						stringEditorModel,
						quickFilterModel),
					$elm$core$Platform$Cmd$none);
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'DisplayPreferences':
				var _v1 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, $Orange_OpenSource$elm_advanced_grid$Grid$ShowPreferences, model.gridModel);
				var newGridModel = _v1.a;
				var gridCmd = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{arePreferencesVisible: true, gridModel: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			case 'GridMsg':
				switch (msg.a.$) {
					case 'UserClickedLine':
						var item = msg.a.a;
						var _v2 = A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$update,
							$Orange_OpenSource$elm_advanced_grid$Grid$UserClickedLine(item),
							model.gridModel);
						var newGridModel = _v2.a;
						var gridCmd = _v2.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									clickedItem: $elm$core$Maybe$Just(item),
									gridModel: newGridModel
								}),
							A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
					case 'UserToggledSelection':
						var item = msg.a.a;
						var _v3 = A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$update,
							$Orange_OpenSource$elm_advanced_grid$Grid$UserToggledSelection(item),
							model.gridModel);
						var newGridModel = _v3.a;
						var gridCmd = _v3.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{gridModel: newGridModel}),
							A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
					case 'UserToggledAllItemSelection':
						var _v4 = msg.a;
						var _v5 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, $Orange_OpenSource$elm_advanced_grid$Grid$UserToggledAllItemSelection, model.gridModel);
						var newGridModel = _v5.a;
						var gridCmd = _v5.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{gridModel: newGridModel}),
							A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
					default:
						var message = msg.a;
						var _v6 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.gridModel);
						var newGridModel = _v6.a;
						var gridCmd = _v6.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{gridModel: newGridModel}),
							A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
				}
			case 'HidePreferences':
				var _v7 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedPreferenceCloseButton, model.gridModel);
				var newGridModel = _v7.a;
				var gridCmd = _v7.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{arePreferencesVisible: false, gridModel: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			case 'ResetFilters':
				var message = $Orange_OpenSource$elm_advanced_grid$Grid$SetFilters($elm$core$Dict$empty);
				var _v8 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.gridModel);
				var newGridModel = _v8.a;
				var gridCmd = _v8.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gridModel: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			case 'SetFilters':
				var filters = $elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2('City', 'o')
						]));
				var message = $Orange_OpenSource$elm_advanced_grid$Grid$SetFilters(filters);
				var _v9 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.gridModel);
				var newGridModel = _v9.a;
				var gridCmd = _v9.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gridModel: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			case 'SetAscendingOrder':
				var message = A2($Orange_OpenSource$elm_advanced_grid$Grid$SetSorting, 'City', $Orange_OpenSource$elm_advanced_grid$Grid$Ascending);
				var _v10 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.gridModel);
				var newGridModel = _v10.a;
				var gridCmd = _v10.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gridModel: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			case 'SetDecendingOrder':
				var message = A2($Orange_OpenSource$elm_advanced_grid$Grid$SetSorting, 'City', $Orange_OpenSource$elm_advanced_grid$Grid$Descending);
				var _v11 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.gridModel);
				var newGridModel = _v11.a;
				var gridCmd = _v11.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gridModel: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			default:
				var city = msg.a;
				var message = $Orange_OpenSource$elm_advanced_grid$Grid$ScrollTo(
					function (item) {
						return A2(
							$elm$core$String$startsWith,
							$elm$core$String$toLower(city),
							$elm$core$String$toLower(item.data.city));
					});
				var _v12 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.gridModel);
				var newGridModel = _v12.a;
				var gridCmd = _v12.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gridModel: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
		}
	});
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode = $rtfeldman$elm_css$VirtualDom$Styled$Unstyled;
var $rtfeldman$elm_css$Css$Global$global = function (snippets) {
	return $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode(
		A3(
			$elm$virtual_dom$VirtualDom$node,
			'style',
			_List_Nil,
			$elm$core$List$singleton(
				$elm$virtual_dom$VirtualDom$text(
					$rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
						$elm$core$List$singleton(
							$rtfeldman$elm_css$Css$Preprocess$stylesheet(snippets)))))));
};
var $rtfeldman$elm_css$Css$absolute = {position: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'absolute'};
var $rtfeldman$elm_css$Css$Preprocess$ApplyStyles = function (a) {
	return {$: 'ApplyStyles', a: a};
};
var $rtfeldman$elm_css$Css$Internal$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$Internal$getOverloadedProperty = F3(
	function (functionName, desiredKey, style) {
		getOverloadedProperty:
		while (true) {
			switch (style.$) {
				case 'AppendProperty':
					var str = style.a;
					var key = A2(
						$elm$core$Maybe$withDefault,
						'',
						$elm$core$List$head(
							A2($elm$core$String$split, ':', str)));
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, key);
				case 'ExtendSelector':
					var selector = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-selector'));
				case 'NestSnippet':
					var combinator = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-combinator'));
				case 'WithPseudoElement':
					var pseudoElement = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-pseudo-element setter'));
				case 'WithMedia':
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-media-query'));
				case 'WithKeyframes':
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-keyframes'));
				default:
					if (!style.a.b) {
						return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-empty-Style'));
					} else {
						if (!style.a.b.b) {
							var _v1 = style.a;
							var only = _v1.a;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = only;
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						} else {
							var _v2 = style.a;
							var first = _v2.a;
							var rest = _v2.b;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = $rtfeldman$elm_css$Css$Preprocess$ApplyStyles(rest);
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						}
					}
			}
		}
	});
var $rtfeldman$elm_css$Css$Internal$IncompatibleUnits = {$: 'IncompatibleUnits'};
var $rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty = A3($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$Internal$IncompatibleUnits, '', 0);
var $rtfeldman$elm_css$Css$alignItems = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'alignItems',
		'align-items',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$alignSelf = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'alignSelf',
		'align-self',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$auto = {alignItemsOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, cursor: $rtfeldman$elm_css$Css$Structure$Compatible, flexBasis: $rtfeldman$elm_css$Css$Structure$Compatible, intOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, justifyContentOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible, overflow: $rtfeldman$elm_css$Css$Structure$Compatible, pointerEvents: $rtfeldman$elm_css$Css$Structure$Compatible, tableLayout: $rtfeldman$elm_css$Css$Structure$Compatible, textRendering: $rtfeldman$elm_css$Css$Structure$Compatible, touchAction: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'auto'};
var $rtfeldman$elm_css$Css$backgroundColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'background-color', c.value);
};
var $rtfeldman$elm_css$Css$backgroundImage = $rtfeldman$elm_css$Css$prop1('background-image');
var $rtfeldman$elm_css$Css$bold = {fontWeight: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'bold'};
var $rtfeldman$elm_css$Css$bolder = {fontWeight: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'bolder'};
var $rtfeldman$elm_css$Css$border = $rtfeldman$elm_css$Css$prop1('border');
var $rtfeldman$elm_css$Css$prop3 = F4(
	function (key, argA, argB, argC) {
		return A2(
			$rtfeldman$elm_css$Css$property,
			key,
			A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.value, argB.value, argC.value])));
	});
var $rtfeldman$elm_css$Css$border3 = $rtfeldman$elm_css$Css$prop3('border');
var $rtfeldman$elm_css$Css$borderBottom3 = $rtfeldman$elm_css$Css$prop3('border-bottom');
var $rtfeldman$elm_css$Css$borderLeft3 = $rtfeldman$elm_css$Css$prop3('border-left');
var $rtfeldman$elm_css$Css$borderRadius = $rtfeldman$elm_css$Css$prop1('border-radius');
var $rtfeldman$elm_css$Css$borderRight3 = $rtfeldman$elm_css$Css$prop3('border-right');
var $rtfeldman$elm_css$Css$boxSizing = $rtfeldman$elm_css$Css$prop1('box-sizing');
var $rtfeldman$elm_css$Css$center = $rtfeldman$elm_css$Css$prop1('center');
var $rtfeldman$elm_css$Css$Global$class = F2(
	function (str, styles) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
			styles,
			$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$Structure$ClassSelector(str)
					])));
	});
var $rtfeldman$elm_css$Css$colResize = {cursor: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'col-resize'};
var $rtfeldman$elm_css$Css$row = {flexDirection: $rtfeldman$elm_css$Css$Structure$Compatible, flexDirectionOrWrap: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'row'};
var $rtfeldman$elm_css$Css$column = _Utils_update(
	$rtfeldman$elm_css$Css$row,
	{value: 'column'});
var $rtfeldman$elm_css$Css$contentBox = {backgroundClip: $rtfeldman$elm_css$Css$Structure$Compatible, boxSizing: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'content-box'};
var $rtfeldman$elm_css$Css$cursor = $rtfeldman$elm_css$Css$prop1('cursor');
var $rtfeldman$elm_css$Css$withPrecedingHash = function (str) {
	return A2($elm$core$String$startsWith, '#', str) ? str : A2(
		$elm$core$String$cons,
		_Utils_chr('#'),
		str);
};
var $rtfeldman$elm_css$Css$erroneousHex = function (str) {
	return {
		alpha: 1,
		blue: 0,
		color: $rtfeldman$elm_css$Css$Structure$Compatible,
		green: 0,
		red: 0,
		value: $rtfeldman$elm_css$Css$withPrecedingHash(str)
	};
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char.valueOf()) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $rtfeldman$elm_css$Css$validHex = F5(
	function (str, _v0, _v1, _v2, _v3) {
		var r1 = _v0.a;
		var r2 = _v0.b;
		var g1 = _v1.a;
		var g2 = _v1.b;
		var b1 = _v2.a;
		var b2 = _v2.b;
		var a1 = _v3.a;
		var a2 = _v3.b;
		var toResult = A2(
			$elm$core$Basics$composeR,
			$elm$core$String$fromList,
			A2($elm$core$Basics$composeR, $elm$core$String$toLower, $rtfeldman$elm_hex$Hex$fromString));
		var results = _Utils_Tuple2(
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[r1, r2])),
				toResult(
					_List_fromArray(
						[g1, g2]))),
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[b1, b2])),
				toResult(
					_List_fromArray(
						[a1, a2]))));
		if ((((results.a.a.$ === 'Ok') && (results.a.b.$ === 'Ok')) && (results.b.a.$ === 'Ok')) && (results.b.b.$ === 'Ok')) {
			var _v5 = results.a;
			var red = _v5.a.a;
			var green = _v5.b.a;
			var _v6 = results.b;
			var blue = _v6.a.a;
			var alpha = _v6.b.a;
			return {
				alpha: alpha / 255,
				blue: blue,
				color: $rtfeldman$elm_css$Css$Structure$Compatible,
				green: green,
				red: red,
				value: $rtfeldman$elm_css$Css$withPrecedingHash(str)
			};
		} else {
			return $rtfeldman$elm_css$Css$erroneousHex(str);
		}
	});
var $rtfeldman$elm_css$Css$hex = function (str) {
	var withoutHash = A2($elm$core$String$startsWith, '#', str) ? A2($elm$core$String$dropLeft, 1, str) : str;
	var _v0 = $elm$core$String$toList(withoutHash);
	_v0$4:
	while (true) {
		if ((_v0.b && _v0.b.b) && _v0.b.b.b) {
			if (!_v0.b.b.b.b) {
				var r = _v0.a;
				var _v1 = _v0.b;
				var g = _v1.a;
				var _v2 = _v1.b;
				var b = _v2.a;
				return A5(
					$rtfeldman$elm_css$Css$validHex,
					str,
					_Utils_Tuple2(r, r),
					_Utils_Tuple2(g, g),
					_Utils_Tuple2(b, b),
					_Utils_Tuple2(
						_Utils_chr('f'),
						_Utils_chr('f')));
			} else {
				if (!_v0.b.b.b.b.b) {
					var r = _v0.a;
					var _v3 = _v0.b;
					var g = _v3.a;
					var _v4 = _v3.b;
					var b = _v4.a;
					var _v5 = _v4.b;
					var a = _v5.a;
					return A5(
						$rtfeldman$elm_css$Css$validHex,
						str,
						_Utils_Tuple2(r, r),
						_Utils_Tuple2(g, g),
						_Utils_Tuple2(b, b),
						_Utils_Tuple2(a, a));
				} else {
					if (_v0.b.b.b.b.b.b) {
						if (!_v0.b.b.b.b.b.b.b) {
							var r1 = _v0.a;
							var _v6 = _v0.b;
							var r2 = _v6.a;
							var _v7 = _v6.b;
							var g1 = _v7.a;
							var _v8 = _v7.b;
							var g2 = _v8.a;
							var _v9 = _v8.b;
							var b1 = _v9.a;
							var _v10 = _v9.b;
							var b2 = _v10.a;
							return A5(
								$rtfeldman$elm_css$Css$validHex,
								str,
								_Utils_Tuple2(r1, r2),
								_Utils_Tuple2(g1, g2),
								_Utils_Tuple2(b1, b2),
								_Utils_Tuple2(
									_Utils_chr('f'),
									_Utils_chr('f')));
						} else {
							if (_v0.b.b.b.b.b.b.b.b && (!_v0.b.b.b.b.b.b.b.b.b)) {
								var r1 = _v0.a;
								var _v11 = _v0.b;
								var r2 = _v11.a;
								var _v12 = _v11.b;
								var g1 = _v12.a;
								var _v13 = _v12.b;
								var g2 = _v13.a;
								var _v14 = _v13.b;
								var b1 = _v14.a;
								var _v15 = _v14.b;
								var b2 = _v15.a;
								var _v16 = _v15.b;
								var a1 = _v16.a;
								var _v17 = _v16.b;
								var a2 = _v17.a;
								return A5(
									$rtfeldman$elm_css$Css$validHex,
									str,
									_Utils_Tuple2(r1, r2),
									_Utils_Tuple2(g1, g2),
									_Utils_Tuple2(b1, b2),
									_Utils_Tuple2(a1, a2));
							} else {
								break _v0$4;
							}
						}
					} else {
						break _v0$4;
					}
				}
			}
		} else {
			break _v0$4;
		}
	}
	return $rtfeldman$elm_css$Css$erroneousHex(str);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey = $rtfeldman$elm_css$Css$hex('666');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey2 = $rtfeldman$elm_css$Css$hex('888');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey3 = $rtfeldman$elm_css$Css$hex('AAA');
var $rtfeldman$elm_css$Css$Structure$Descendant = {$: 'Descendant'};
var $rtfeldman$elm_css$Css$Preprocess$NestSnippet = F2(
	function (a, b) {
		return {$: 'NestSnippet', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Global$descendants = $rtfeldman$elm_css$Css$Preprocess$NestSnippet($rtfeldman$elm_css$Css$Structure$Descendant);
var $rtfeldman$elm_css$Css$Preprocess$ExtendSelector = F2(
	function (a, b) {
		return {$: 'ExtendSelector', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$PseudoClassSelector = function (a) {
	return {$: 'PseudoClassSelector', a: a};
};
var $rtfeldman$elm_css$Css$pseudoClass = function (_class) {
	return $rtfeldman$elm_css$Css$Preprocess$ExtendSelector(
		$rtfeldman$elm_css$Css$Structure$PseudoClassSelector(_class));
};
var $rtfeldman$elm_css$Css$hover = $rtfeldman$elm_css$Css$pseudoClass('hover');
var $rtfeldman$elm_css$Css$Structure$TypeSelector = function (a) {
	return {$: 'TypeSelector', a: a};
};
var $rtfeldman$elm_css$Css$Global$typeSelector = F2(
	function (selectorStr, styles) {
		var sequence = A2(
			$rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
			$rtfeldman$elm_css$Css$Structure$TypeSelector(selectorStr),
			_List_Nil);
		var sel = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return $rtfeldman$elm_css$Css$Preprocess$Snippet(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
					A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, sel, _List_Nil, styles))
				]));
	});
var $rtfeldman$elm_css$Css$visibility = $rtfeldman$elm_css$Css$prop1('visibility');
var $rtfeldman$elm_css$Css$visible = {overflow: $rtfeldman$elm_css$Css$Structure$Compatible, pointerEvents: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'visible', visibility: $rtfeldman$elm_css$Css$Structure$Compatible};
var $Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$descendantsVisibleOnHover = $rtfeldman$elm_css$Css$hover(
	_List_fromArray(
		[
			$rtfeldman$elm_css$Css$Global$descendants(
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Css$Global$typeSelector,
					'div',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$visibility($rtfeldman$elm_css$Css$visible)
						]))
				]))
		]));
var $rtfeldman$elm_css$Css$display = $rtfeldman$elm_css$Css$prop1('display');
var $rtfeldman$elm_css$Css$displayFlex = A2($rtfeldman$elm_css$Css$property, 'display', 'flex');
var $rtfeldman$elm_css$Css$firstOfType = $rtfeldman$elm_css$Css$pseudoClass('first-of-type');
var $rtfeldman$elm_css$Css$flexDirection = $rtfeldman$elm_css$Css$prop1('flex-direction');
var $rtfeldman$elm_css$Css$flexEnd = $rtfeldman$elm_css$Css$prop1('flex-end');
var $rtfeldman$elm_css$Css$flexGrow = $rtfeldman$elm_css$Css$prop1('flex-grow');
var $rtfeldman$elm_css$Css$flexStart = $rtfeldman$elm_css$Css$prop1('flex-start');
var $rtfeldman$elm_css$Css$fontSize = $rtfeldman$elm_css$Css$prop1('font-size');
var $rtfeldman$elm_css$Css$fontStyle = $rtfeldman$elm_css$Css$prop1('font-style');
var $rtfeldman$elm_css$Css$fontWeight = function (_v0) {
	var value = _v0.value;
	return A2($rtfeldman$elm_css$Css$property, 'font-weight', value);
};
var $rtfeldman$elm_css$Css$hidden = {borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible, overflow: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'hidden', visibility: $rtfeldman$elm_css$Css$Structure$Compatible};
var $rtfeldman$elm_css$Css$inlineFlex = {display: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'inline-flex'};
var $rtfeldman$elm_css$Css$UnitlessInteger = {$: 'UnitlessInteger'};
var $rtfeldman$elm_css$Css$int = function (val) {
	return {
		fontWeight: $rtfeldman$elm_css$Css$Structure$Compatible,
		intOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
		lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
		lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
		number: $rtfeldman$elm_css$Css$Structure$Compatible,
		numberOrInfinite: $rtfeldman$elm_css$Css$Structure$Compatible,
		numericValue: val,
		unitLabel: '',
		units: $rtfeldman$elm_css$Css$UnitlessInteger,
		value: $elm$core$String$fromInt(val)
	};
};
var $rtfeldman$elm_css$Css$italic = {fontStyle: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'italic'};
var $rtfeldman$elm_css$Css$justifyContent = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'justifyContent',
		'justify-content',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGreen = $rtfeldman$elm_css$Css$hex('4d4');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey = $rtfeldman$elm_css$Css$hex('CCC');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey2 = $rtfeldman$elm_css$Css$hex('BBB');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey3 = $rtfeldman$elm_css$Css$hex('DDD');
var $rtfeldman$elm_css$Css$lineHeight = $rtfeldman$elm_css$Css$prop1('line-height');
var $rtfeldman$elm_css$Css$collectStops = $elm$core$List$map(
	function (_v0) {
		var c = _v0.a;
		var len = _v0.b;
		return A2(
			$elm$core$String$append,
			c.value,
			A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					A2(
						$elm$core$Basics$composeL,
						$elm$core$String$cons(
							_Utils_chr(' ')),
						function ($) {
							return $.value;
						}),
					len)));
	});
var $rtfeldman$elm_css$Css$cssFunction = F2(
	function (funcName, args) {
		return funcName + ('(' + (A2($elm$core$String$join, ', ', args) + ')'));
	});
var $rtfeldman$elm_css$Css$linearGradient = F3(
	function (firstStop, secondStop, otherStops) {
		return {
			backgroundImage: $rtfeldman$elm_css$Css$Structure$Compatible,
			listStyleTypeOrPositionOrImage: $rtfeldman$elm_css$Css$Structure$Compatible,
			value: A2(
				$rtfeldman$elm_css$Css$cssFunction,
				'linear-gradient',
				$rtfeldman$elm_css$Css$collectStops(
					_Utils_ap(
						_List_fromArray(
							[firstStop, secondStop]),
						otherStops)))
		};
	});
var $rtfeldman$elm_css$Css$margin = $rtfeldman$elm_css$Css$prop1('margin');
var $rtfeldman$elm_css$Css$marginBottom = $rtfeldman$elm_css$Css$prop1('margin-bottom');
var $rtfeldman$elm_css$Css$marginLeft = $rtfeldman$elm_css$Css$prop1('margin-left');
var $rtfeldman$elm_css$Css$marginRight = $rtfeldman$elm_css$Css$prop1('margin-right');
var $rtfeldman$elm_css$Css$marginTop = $rtfeldman$elm_css$Css$prop1('margin-top');
var $rtfeldman$elm_css$Css$minHeight = $rtfeldman$elm_css$Css$prop1('min-height');
var $rtfeldman$elm_css$Css$move = {cursor: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'move'};
var $rtfeldman$elm_css$Css$flexShrink = $rtfeldman$elm_css$Css$prop1('flex-shrink');
var $rtfeldman$elm_css$Css$UnitlessFloat = {$: 'UnitlessFloat'};
var $rtfeldman$elm_css$Css$num = function (val) {
	return {
		lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
		lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
		number: $rtfeldman$elm_css$Css$Structure$Compatible,
		numberOrInfinite: $rtfeldman$elm_css$Css$Structure$Compatible,
		numericValue: val,
		unitLabel: '',
		units: $rtfeldman$elm_css$Css$UnitlessFloat,
		value: $elm$core$String$fromFloat(val)
	};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$noShrink = $rtfeldman$elm_css$Css$flexShrink(
	$rtfeldman$elm_css$Css$num(0));
var $rtfeldman$elm_css$Css$noWrap = {flexDirectionOrWrap: $rtfeldman$elm_css$Css$Structure$Compatible, flexWrap: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'nowrap', whiteSpace: $rtfeldman$elm_css$Css$Structure$Compatible};
var $rtfeldman$elm_css$Css$none = {backgroundImage: $rtfeldman$elm_css$Css$Structure$Compatible, blockAxisOverflow: $rtfeldman$elm_css$Css$Structure$Compatible, borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible, cursor: $rtfeldman$elm_css$Css$Structure$Compatible, display: $rtfeldman$elm_css$Css$Structure$Compatible, hoverCapability: $rtfeldman$elm_css$Css$Structure$Compatible, inlineAxisOverflow: $rtfeldman$elm_css$Css$Structure$Compatible, keyframes: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNone: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNoneOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible, listStyleType: $rtfeldman$elm_css$Css$Structure$Compatible, listStyleTypeOrPositionOrImage: $rtfeldman$elm_css$Css$Structure$Compatible, none: $rtfeldman$elm_css$Css$Structure$Compatible, outline: $rtfeldman$elm_css$Css$Structure$Compatible, pointerDevice: $rtfeldman$elm_css$Css$Structure$Compatible, pointerEvents: $rtfeldman$elm_css$Css$Structure$Compatible, resize: $rtfeldman$elm_css$Css$Structure$Compatible, scriptingSupport: $rtfeldman$elm_css$Css$Structure$Compatible, textDecorationLine: $rtfeldman$elm_css$Css$Structure$Compatible, textTransform: $rtfeldman$elm_css$Css$Structure$Compatible, touchAction: $rtfeldman$elm_css$Css$Structure$Compatible, transform: $rtfeldman$elm_css$Css$Structure$Compatible, updateFrequency: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'none'};
var $rtfeldman$elm_css$Css$opacity = $rtfeldman$elm_css$Css$prop1('opacity');
var $rtfeldman$elm_css$Css$overflow = $rtfeldman$elm_css$Css$prop1('overflow');
var $rtfeldman$elm_css$Css$overflowX = $rtfeldman$elm_css$Css$prop1('overflow-x');
var $rtfeldman$elm_css$Css$overflowY = $rtfeldman$elm_css$Css$prop1('overflow-y');
var $rtfeldman$elm_css$Css$padding = $rtfeldman$elm_css$Css$prop1('padding');
var $rtfeldman$elm_css$Css$paddingLeft = $rtfeldman$elm_css$Css$prop1('padding-left');
var $rtfeldman$elm_css$Css$paddingRight = $rtfeldman$elm_css$Css$prop1('padding-right');
var $rtfeldman$elm_css$Css$paddingTop = $rtfeldman$elm_css$Css$prop1('padding-top');
var $rtfeldman$elm_css$Css$PercentageUnits = {$: 'PercentageUnits'};
var $rtfeldman$elm_css$Css$pct = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$PercentageUnits, '%');
var $rtfeldman$elm_css$Css$pointer = {cursor: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'pointer'};
var $rtfeldman$elm_css$Css$pointerEvents = $rtfeldman$elm_css$Css$prop1('pointer-events');
var $rtfeldman$elm_css$Css$position = $rtfeldman$elm_css$Css$prop1('position');
var $rtfeldman$elm_css$Css$relative = {position: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'relative'};
var $rtfeldman$elm_css$Css$RemUnits = {$: 'RemUnits'};
var $rtfeldman$elm_css$Css$rem = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$RemUnits, 'rem');
var $Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$resizingHandleWidth = 5;
var $rtfeldman$elm_css$Css$solid = {borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible, textDecorationStyle: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'solid'};
var $rtfeldman$elm_css$Css$spaceAround = $rtfeldman$elm_css$Css$prop1('space-around');
var $rtfeldman$elm_css$Css$spaceBetween = $rtfeldman$elm_css$Css$prop1('space-between');
var $rtfeldman$elm_css$Css$stop = function (c) {
	return _Utils_Tuple2(c, $elm$core$Maybe$Nothing);
};
var $rtfeldman$elm_css$Css$stretch = $rtfeldman$elm_css$Css$prop1('stretch');
var $rtfeldman$elm_css$Css$top = $rtfeldman$elm_css$Css$prop1('top');
var $rtfeldman$elm_css$Css$transparent = {color: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'transparent'};
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$white = $rtfeldman$elm_css$Css$hex('FFF');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$white2 = $rtfeldman$elm_css$Css$hex('EEE');
var $rtfeldman$elm_css$Css$whiteSpace = $rtfeldman$elm_css$Css$prop1('white-space');
var $rtfeldman$elm_css$Css$zIndex = $rtfeldman$elm_css$Css$prop1('z-index');
var $Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$gridStyles = _List_fromArray(
	[
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-arrow-head',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$width(
				$rtfeldman$elm_css$Css$px(0)),
				$rtfeldman$elm_css$Css$height(
				$rtfeldman$elm_css$Css$px(0)),
				A3(
				$rtfeldman$elm_css$Css$borderLeft3,
				$rtfeldman$elm_css$Css$px(5),
				$rtfeldman$elm_css$Css$solid,
				$rtfeldman$elm_css$Css$transparent),
				A3(
				$rtfeldman$elm_css$Css$borderRight3,
				$rtfeldman$elm_css$Css$px(5),
				$rtfeldman$elm_css$Css$solid,
				$rtfeldman$elm_css$Css$transparent),
				$rtfeldman$elm_css$Css$margin(
				$rtfeldman$elm_css$Css$px(5))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-cell',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
				$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineFlex),
				$Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$noShrink,
				$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$spaceBetween),
				A3(
				$rtfeldman$elm_css$Css$borderLeft3,
				$rtfeldman$elm_css$Css$px(1),
				$rtfeldman$elm_css$Css$solid,
				$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey),
				A3(
				$rtfeldman$elm_css$Css$borderRight3,
				$rtfeldman$elm_css$Css$px(1),
				$rtfeldman$elm_css$Css$solid,
				$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey),
				$rtfeldman$elm_css$Css$firstOfType(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$flexEnd)
					])),
				$rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$contentBox),
				$rtfeldman$elm_css$Css$minHeight(
				$rtfeldman$elm_css$Css$pct(100)),
				$rtfeldman$elm_css$Css$paddingLeft(
				$rtfeldman$elm_css$Css$px(2)),
				$rtfeldman$elm_css$Css$paddingRight(
				$rtfeldman$elm_css$Css$px(2)),
				$Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$descendantsVisibleOnHover,
				$rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$hidden),
				$rtfeldman$elm_css$Css$whiteSpace($rtfeldman$elm_css$Css$noWrap)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-drag-handle',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$displayFlex,
				$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row),
				$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$move),
				$rtfeldman$elm_css$Css$fontSize(
				$rtfeldman$elm_css$Css$px(0.1)),
				$rtfeldman$elm_css$Css$height(
				$rtfeldman$elm_css$Css$pct(100)),
				$rtfeldman$elm_css$Css$visibility($rtfeldman$elm_css$Css$hidden),
				$rtfeldman$elm_css$Css$width(
				$rtfeldman$elm_css$Css$px(10)),
				$rtfeldman$elm_css$Css$zIndex(
				$rtfeldman$elm_css$Css$int(5))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-edited-row-class',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$fontWeight($rtfeldman$elm_css$Css$bold)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-flex-row',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$displayFlex,
				$Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$noShrink,
				$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row),
				$rtfeldman$elm_css$Css$flexGrow(
				$rtfeldman$elm_css$Css$num(1)),
				$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$flexStart)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-flex-column',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$displayFlex,
				$Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$noShrink,
				$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$column),
				$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$flexStart),
				$rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$hidden)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-ghost-header',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
				$rtfeldman$elm_css$Css$top(
				$rtfeldman$elm_css$Css$px(2)),
				$rtfeldman$elm_css$Css$pointerEvents($rtfeldman$elm_css$Css$none)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-grid',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$marginLeft($rtfeldman$elm_css$Css$auto),
				$rtfeldman$elm_css$Css$marginRight($rtfeldman$elm_css$Css$auto),
				$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-header',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$backgroundImage(
				A3(
					$rtfeldman$elm_css$Css$linearGradient,
					$rtfeldman$elm_css$Css$stop($Orange_OpenSource$elm_advanced_grid$Grid$Colors$white2),
					$rtfeldman$elm_css$Css$stop($Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey),
					_List_Nil)),
				$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineFlex),
				$Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$noShrink,
				$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row),
				A3(
				$rtfeldman$elm_css$Css$border3,
				$rtfeldman$elm_css$Css$px(1),
				$rtfeldman$elm_css$Css$solid,
				$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey2),
				$rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$contentBox),
				$Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$descendantsVisibleOnHover,
				$rtfeldman$elm_css$Css$padding(
				$rtfeldman$elm_css$Css$px(2)),
				$rtfeldman$elm_css$Css$zIndex(
				$rtfeldman$elm_css$Css$int(10))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-header-container',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey),
				A2($rtfeldman$elm_css$Css$property, 'display', 'grid')
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-header-title',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$lineHeight(
				$rtfeldman$elm_css$Css$num(1.2))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-header-title-sorted',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$fontStyle($rtfeldman$elm_css$Css$italic),
				$rtfeldman$elm_css$Css$fontWeight($rtfeldman$elm_css$Css$bold)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-header-title-filtered',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$fontWeight($rtfeldman$elm_css$Css$bolder)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-input-filter',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$border(
				$rtfeldman$elm_css$Css$px(0)),
				$rtfeldman$elm_css$Css$paddingLeft(
				$rtfeldman$elm_css$Css$px(2)),
				$rtfeldman$elm_css$Css$paddingRight(
				$rtfeldman$elm_css$Css$px(2)),
				$rtfeldman$elm_css$Css$marginLeft(
				$rtfeldman$elm_css$Css$px($Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$resizingHandleWidth))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-input-filter-container',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$displayFlex,
				$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row),
				$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$spaceBetween),
				$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
				$rtfeldman$elm_css$Css$alignSelf($rtfeldman$elm_css$Css$stretch),
				$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$white),
				$rtfeldman$elm_css$Css$borderRadius(
				$rtfeldman$elm_css$Css$px(3)),
				$rtfeldman$elm_css$Css$marginLeft(
				$rtfeldman$elm_css$Css$px(4))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-invisible',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$opacity(
				$rtfeldman$elm_css$Css$num(0))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-margin-Left-XS',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$marginLeft(
				$rtfeldman$elm_css$Css$px(5))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-primary-button',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$white2),
				$rtfeldman$elm_css$Css$borderRadius(
				$rtfeldman$elm_css$Css$px(3)),
				$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
				$rtfeldman$elm_css$Css$fontSize(
				$rtfeldman$elm_css$Css$rem(0.75)),
				$rtfeldman$elm_css$Css$fontWeight($rtfeldman$elm_css$Css$bold),
				$rtfeldman$elm_css$Css$marginLeft(
				$rtfeldman$elm_css$Css$px(15)),
				$rtfeldman$elm_css$Css$marginTop(
				$rtfeldman$elm_css$Css$px(5)),
				$rtfeldman$elm_css$Css$marginBottom(
				$rtfeldman$elm_css$Css$px(5)),
				$rtfeldman$elm_css$Css$paddingLeft(
				$rtfeldman$elm_css$Css$px(10)),
				$rtfeldman$elm_css$Css$paddingRight(
				$rtfeldman$elm_css$Css$px(10))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-button',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey),
				$rtfeldman$elm_css$Css$borderRadius(
				$rtfeldman$elm_css$Css$px(3)),
				$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
				$rtfeldman$elm_css$Css$fontSize(
				$rtfeldman$elm_css$Css$rem(0.75)),
				$rtfeldman$elm_css$Css$margin(
				$rtfeldman$elm_css$Css$px(5)),
				$rtfeldman$elm_css$Css$paddingLeft(
				$rtfeldman$elm_css$Css$px(10)),
				$rtfeldman$elm_css$Css$paddingRight(
				$rtfeldman$elm_css$Css$px(10))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-progress-bar-background',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$displayFlex,
				$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$white),
				$rtfeldman$elm_css$Css$borderRadius(
				$rtfeldman$elm_css$Css$px(5)),
				A3(
				$rtfeldman$elm_css$Css$border3,
				$rtfeldman$elm_css$Css$px(1),
				$rtfeldman$elm_css$Css$solid,
				$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-progress-bar-container',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$displayFlex,
				$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
				A3(
				$rtfeldman$elm_css$Css$border3,
				$rtfeldman$elm_css$Css$px(1),
				$rtfeldman$elm_css$Css$solid,
				$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey),
				$rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$contentBox),
				$rtfeldman$elm_css$Css$height(
				$rtfeldman$elm_css$Css$pct(100)),
				$rtfeldman$elm_css$Css$paddingLeft(
				$rtfeldman$elm_css$Css$px(5)),
				$rtfeldman$elm_css$Css$paddingRight(
				$rtfeldman$elm_css$Css$px(5))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-progress-bar-foreground',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGreen),
				$rtfeldman$elm_css$Css$borderRadius(
				$rtfeldman$elm_css$Css$px(5)),
				$rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$visible)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-quick-filter-button',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
				$rtfeldman$elm_css$Css$padding(
				$rtfeldman$elm_css$Css$px(2)),
				$rtfeldman$elm_css$Css$paddingTop(
				$rtfeldman$elm_css$Css$px(6))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-quick-filter-control',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$fontStyle($rtfeldman$elm_css$Css$italic)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-quick-filter-entry',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
				$rtfeldman$elm_css$Css$displayFlex,
				$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
				$rtfeldman$elm_css$Css$hover(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey3)
					])),
				$rtfeldman$elm_css$Css$lineHeight(
				$rtfeldman$elm_css$Css$rem(1.3))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-resize-handle',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$colResize),
				$rtfeldman$elm_css$Css$displayFlex,
				$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$spaceAround),
				$rtfeldman$elm_css$Css$height(
				$rtfeldman$elm_css$Css$pct(100)),
				$rtfeldman$elm_css$Css$visibility($rtfeldman$elm_css$Css$hidden),
				$rtfeldman$elm_css$Css$width(
				$rtfeldman$elm_css$Css$px($Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$resizingHandleWidth))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-root',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$marginLeft($rtfeldman$elm_css$Css$auto),
				$rtfeldman$elm_css$Css$marginRight($rtfeldman$elm_css$Css$auto),
				$rtfeldman$elm_css$Css$overflowX($rtfeldman$elm_css$Css$auto),
				$rtfeldman$elm_css$Css$overflowY($rtfeldman$elm_css$Css$hidden),
				$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-row',
		_List_fromArray(
			[
				A3(
				$rtfeldman$elm_css$Css$borderBottom3,
				$rtfeldman$elm_css$Css$px(1),
				$rtfeldman$elm_css$Css$solid,
				$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey),
				A2($rtfeldman$elm_css$Css$property, 'display', 'grid'),
				A2($rtfeldman$elm_css$Css$property, 'direction', 'ltr')
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-rows',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$overflowX($rtfeldman$elm_css$Css$hidden),
				$rtfeldman$elm_css$Css$overflowY($rtfeldman$elm_css$Css$auto),
				A2($rtfeldman$elm_css$Css$property, 'direction', 'rtl')
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-selection-header',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$displayFlex,
				$Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$noShrink,
				$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
				$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center)
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-small-square',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey2),
				$rtfeldman$elm_css$Css$borderRadius(
				$rtfeldman$elm_css$Css$pct(50)),
				$rtfeldman$elm_css$Css$height(
				$rtfeldman$elm_css$Css$px(3)),
				$rtfeldman$elm_css$Css$width(
				$rtfeldman$elm_css$Css$px(3)),
				$rtfeldman$elm_css$Css$marginRight(
				$rtfeldman$elm_css$Css$px(1)),
				$rtfeldman$elm_css$Css$marginBottom(
				$rtfeldman$elm_css$Css$px(2))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-vertical-bar',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$width(
				$rtfeldman$elm_css$Css$px(1)),
				$rtfeldman$elm_css$Css$height(
				$rtfeldman$elm_css$Css$px(10)),
				$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey3)
			]))
	]);
var $Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$grid = $rtfeldman$elm_css$Css$Global$global($Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$gridStyles);
var $elm$virtual_dom$VirtualDom$lazy2 = _VirtualDom_lazy2;
var $rtfeldman$elm_css$VirtualDom$Styled$lazyHelp = F2(
	function (fn, arg) {
		return $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled(
			fn(arg));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$lazy = F2(
	function (fn, arg) {
		return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
			A3($elm$virtual_dom$VirtualDom$lazy2, $rtfeldman$elm_css$VirtualDom$Styled$lazyHelp, fn, arg));
	});
var $rtfeldman$elm_css$Html$Styled$Lazy$lazy = $rtfeldman$elm_css$VirtualDom$Styled$lazy;
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $rtfeldman$elm_css$VirtualDom$Styled$lazyHelp2 = F3(
	function (fn, arg1, arg2) {
		return $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled(
			A2(fn, arg1, arg2));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$lazy2 = F3(
	function (fn, arg1, arg2) {
		return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
			A4($elm$virtual_dom$VirtualDom$lazy3, $rtfeldman$elm_css$VirtualDom$Styled$lazyHelp2, fn, arg1, arg2));
	});
var $rtfeldman$elm_css$Html$Styled$Lazy$lazy2 = $rtfeldman$elm_css$VirtualDom$Styled$lazy2;
var $Orange_OpenSource$elm_advanced_grid$Grid$rootContainerId = 'eag-root-container';
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedOutsideOfQuickFilter = {$: 'UserClickedOutsideOfQuickFilter'};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserEndedMouseInteraction = {$: 'UserEndedMouseInteraction'};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserScrolledRowsVertically = function (a) {
	return {$: 'UserScrolledRowsVertically', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$unstyledAttribute = function (prop) {
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, prop, _List_Nil, '');
};
var $rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledAttribute;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {preventDefault: true, stopPropagation: false};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event = F6(
	function (keys, button, clientPos, offsetPos, pagePos, screenPos) {
		return {button: button, clientPos: clientPos, keys: keys, offsetPos: offsetPos, pagePos: pagePos, screenPos: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = {$: 'BackButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = {$: 'ErrorButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = {$: 'ForwardButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = {$: 'MainButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = {$: 'MiddleButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = {$: 'SecondButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton;
		case 1:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton;
		case 2:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton;
		case 3:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton;
		case 4:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton;
		default:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton;
	}
};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder = A2(
	$elm$json$Json$Decode$map,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId,
	A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int));
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $mpizenberg$elm_pointer_events$Internal$Decode$clientPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$Keys = F3(
	function (alt, ctrl, shift) {
		return {alt: alt, ctrl: ctrl, shift: shift};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $mpizenberg$elm_pointer_events$Internal$Decode$keys = A4(
	$elm$json$Json$Decode$map3,
	$mpizenberg$elm_pointer_events$Internal$Decode$Keys,
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$pagePos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$screenPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'screenX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'screenY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder = A7($elm$json$Json$Decode$map6, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event, $mpizenberg$elm_pointer_events$Internal$Decode$keys, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder, $mpizenberg$elm_pointer_events$Internal$Decode$clientPos, $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos, $mpizenberg$elm_pointer_events$Internal$Decode$pagePos, $mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions = F3(
	function (event, options, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onLeave = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseleave', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $rtfeldman$elm_css$Html$Styled$Events$onMouseUp = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Scroll$VerticalScrollInfo = function (scrollTop) {
	return {scrollTop: scrollTop};
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Scroll$verticalScrollInfoDecoder = A2(
	$elm$json$Json$Decode$map,
	$Orange_OpenSource$elm_advanced_grid$Grid$Scroll$VerticalScrollInfo,
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['target', 'scrollTop']),
		$elm$json$Json$Decode$float));
var $Orange_OpenSource$elm_advanced_grid$Grid$Scroll$onVerticalScroll = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'scroll',
		A2($elm$json$Json$Decode$map, msg, $Orange_OpenSource$elm_advanced_grid$Grid$Scroll$verticalScrollInfoDecoder));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$headerStyles = function (state) {
	return $rtfeldman$elm_css$Html$Styled$Attributes$css(
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$height(
				$rtfeldman$elm_css$Css$px(state.config.headerHeight - $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth))
			]));
};
var $rtfeldman$elm_css$Css$left = $rtfeldman$elm_css$Css$prop1('left');
var $Orange_OpenSource$elm_advanced_grid$Grid$Html$noContent = $rtfeldman$elm_css$Html$Styled$text('');
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedDragHandle = F2(
	function (a, b) {
		return {$: 'UserClickedDragHandle', a: a, b: b};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$UserHoveredDragHandle = {$: 'UserHoveredDragHandle'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousedown', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onOver = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseover', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseup', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $Orange_OpenSource$elm_advanced_grid$Grid$toPosition = function (event) {
	return {x: event.clientPos.a, y: event.clientPos.b};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewDragHandle = function (columnConfig) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-drag-handle'),
				$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onOver(
					function (_v0) {
						return $Orange_OpenSource$elm_advanced_grid$Grid$UserHoveredDragHandle;
					})),
				$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
					function (event) {
						return A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$UserClickedDragHandle,
							columnConfig,
							$Orange_OpenSource$elm_advanced_grid$Grid$toPosition(event));
					})),
				$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp(
					function (_v1) {
						return $Orange_OpenSource$elm_advanced_grid$Grid$UserEndedMouseInteraction;
					})),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'dragHandle-' + columnConfig.properties.id)
			]),
		A2(
			$elm$core$List$repeat,
			2,
			A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_Nil,
				A2(
					$elm$core$List$repeat,
					4,
					A2(
						$rtfeldman$elm_css$Html$Styled$div,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-small-square')
							]),
						_List_Nil)))));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$FilterLostFocus = {$: 'FilterLostFocus'};
var $Orange_OpenSource$elm_advanced_grid$Grid$FilterModified = F2(
	function (a, b) {
		return {$: 'FilterModified', a: a, b: b};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedFilter = {$: 'UserClickedFilter'};
var $Orange_OpenSource$elm_advanced_grid$Grid$filterInputWidth = function (columnConfig) {
	return $rtfeldman$elm_css$Css$px(
		(columnConfig.properties.width - ($Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth * 2)) - (columnConfig.hasQuickFilter ? 30 : 0));
};
var $rtfeldman$elm_css$Html$Styled$Events$onBlur = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $rtfeldman$elm_css$Html$Styled$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $rtfeldman$elm_css$Html$Styled$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $rtfeldman$elm_css$Html$Styled$Events$onInput = function (tagger) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$rtfeldman$elm_css$Html$Styled$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $rtfeldman$elm_css$Html$Styled$Events$targetValue)));
};
var $rtfeldman$elm_css$Html$Styled$Attributes$value = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('value');
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedQuickFilterButton = function (a) {
	return {$: 'UserClickedQuickFilterButton', a: a};
};
var $elm_community$typed_svg$TypedSvg$Types$Fill = function (a) {
	return {$: 'Fill', a: a};
};
var $elm_community$typed_svg$TypedSvg$Core$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm_community$typed_svg$TypedSvg$Attributes$d = $elm_community$typed_svg$TypedSvg$Core$attribute('d');
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $elm_community$typed_svg$TypedSvg$TypesToStrings$fillToString = function (fill) {
	if (fill.$ === 'Fill') {
		var color = fill.a;
		return $avh4$elm_color$Color$toCssString(color);
	} else {
		return 'none';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$fill = A2(
	$elm$core$Basics$composeL,
	$elm_community$typed_svg$TypedSvg$Core$attribute('fill'),
	$elm_community$typed_svg$TypedSvg$TypesToStrings$fillToString);
var $rtfeldman$elm_css$Svg$Styled$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode;
var $elm_community$typed_svg$TypedSvg$Core$node = $elm$virtual_dom$VirtualDom$nodeNS('http://www.w3.org/2000/svg');
var $elm_community$typed_svg$TypedSvg$g = $elm_community$typed_svg$TypedSvg$Core$node('g');
var $elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString = function (length) {
	switch (length.$) {
		case 'Cm':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'cm';
		case 'Em':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'em';
		case 'Ex':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'ex';
		case 'In':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'in';
		case 'Mm':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'mm';
		case 'Num':
			var x = length.a;
			return $elm$core$String$fromFloat(x);
		case 'Pc':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'pc';
		case 'Percent':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + '%';
		case 'Pt':
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'pt';
		default:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'px';
	}
};
var $elm_community$typed_svg$TypedSvg$Attributes$height = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'height',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Types$Px = function (a) {
	return {$: 'Px', a: a};
};
var $elm_community$typed_svg$TypedSvg$Types$px = $elm_community$typed_svg$TypedSvg$Types$Px;
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$height = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$height(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $elm_community$typed_svg$TypedSvg$Events$on = $elm$virtual_dom$VirtualDom$on;
var $elm_community$typed_svg$TypedSvg$Events$simpleOn = function (name) {
	return function (msg) {
		return A2(
			$elm_community$typed_svg$TypedSvg$Events$on,
			name,
			$elm$virtual_dom$VirtualDom$Normal(
				$elm$json$Json$Decode$succeed(msg)));
	};
};
var $elm_community$typed_svg$TypedSvg$Events$onClick = $elm_community$typed_svg$TypedSvg$Events$simpleOn('click');
var $elm_community$typed_svg$TypedSvg$path = $elm_community$typed_svg$TypedSvg$Core$node('path');
var $elm_community$typed_svg$TypedSvg$svg = $elm_community$typed_svg$TypedSvg$Core$node('svg');
var $elm_community$typed_svg$TypedSvg$Attributes$viewBox = F4(
	function (minX, minY, vWidth, vHeight) {
		return A2(
			$elm_community$typed_svg$TypedSvg$Core$attribute,
			'viewBox',
			A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					$elm$core$String$fromFloat,
					_List_fromArray(
						[minX, minY, vWidth, vHeight]))));
	});
var $elm_community$typed_svg$TypedSvg$Attributes$width = function (length) {
	return A2(
		$elm_community$typed_svg$TypedSvg$Core$attribute,
		'width',
		$elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString(length));
};
var $elm_community$typed_svg$TypedSvg$Attributes$InPx$width = function (value) {
	return $elm_community$typed_svg$TypedSvg$Attributes$width(
		$elm_community$typed_svg$TypedSvg$Types$px(value));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawClickableSvg = F4(
	function (color, size, svgPath, message) {
		return $rtfeldman$elm_css$Svg$Styled$fromUnstyled(
			A2(
				$elm_community$typed_svg$TypedSvg$svg,
				_List_fromArray(
					[
						A4($elm_community$typed_svg$TypedSvg$Attributes$viewBox, 0, 0, size, size),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(size),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(size),
						$elm_community$typed_svg$TypedSvg$Events$onClick(message)
					]),
				_List_fromArray(
					[
						A2(
						$elm_community$typed_svg$TypedSvg$g,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm_community$typed_svg$TypedSvg$path,
								_List_fromArray(
									[
										$elm_community$typed_svg$TypedSvg$Attributes$d(svgPath),
										$elm_community$typed_svg$TypedSvg$Attributes$fill(
										$elm_community$typed_svg$TypedSvg$Types$Fill(color))
									]),
								_List_Nil)
							]))
					])));
	});
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawClickableDarkSvg = F3(
	function (size, svgPath, message) {
		return A4(
			$Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawClickableSvg,
			A3($avh4$elm_color$Color$rgb, 0.2, 0.2, 0.2),
			size,
			svgPath,
			message);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawClickableLightSvg = F3(
	function (size, svgPath, message) {
		return A4(
			$Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawClickableSvg,
			A3($avh4$elm_color$Color$rgb, 0.6, 0.6, 0.6),
			size,
			svgPath,
			message);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$filterIcon = 'M 0 0 L 15 0 L 9 6 L 9 12 L 6 12 L 6 6 Z';
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$openQuickFilter = 'Open quick filter';
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$width = 15;
var $Orange_OpenSource$elm_advanced_grid$Grid$viewQuickFilterButton = F2(
	function (state, columnConfig) {
		var htmlId = $Orange_OpenSource$elm_advanced_grid$Grid$quickFilterButtonId(columnConfig);
		var draw = function () {
			var _v0 = columnConfig.filteringValue;
			if (_v0.$ === 'Nothing') {
				return $Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawClickableLightSvg;
			} else {
				return $Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawClickableDarkSvg;
			}
		}();
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', htmlId),
					$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-quick-filter-button'),
					$rtfeldman$elm_css$Html$Styled$Attributes$id(htmlId),
					$rtfeldman$elm_css$Html$Styled$Events$onClick($Orange_OpenSource$elm_advanced_grid$Grid$UserClickedFilter),
					$rtfeldman$elm_css$Html$Styled$Attributes$title(
					A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$openQuickFilter, state.labels))
				]),
			_List_fromArray(
				[
					A3(
					draw,
					$Orange_OpenSource$elm_advanced_grid$Grid$Icons$width,
					$Orange_OpenSource$elm_advanced_grid$Grid$Icons$filterIcon,
					$Orange_OpenSource$elm_advanced_grid$Grid$UserClickedQuickFilterButton(columnConfig))
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewFilter = F2(
	function (state, columnConfig) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-input-filter-container')
				]),
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$input,
					_List_fromArray(
						[
							A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'filter-' + columnConfig.properties.id),
							$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-input-filter'),
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$height(
									$rtfeldman$elm_css$Css$px(state.config.lineHeight)),
									$rtfeldman$elm_css$Css$width(
									$Orange_OpenSource$elm_advanced_grid$Grid$filterInputWidth(columnConfig))
								])),
							$rtfeldman$elm_css$Html$Styled$Events$onClick($Orange_OpenSource$elm_advanced_grid$Grid$UserClickedFilter),
							$rtfeldman$elm_css$Html$Styled$Events$onBlur($Orange_OpenSource$elm_advanced_grid$Grid$FilterLostFocus),
							$rtfeldman$elm_css$Html$Styled$Events$onInput(
							A2(
								$elm$core$Basics$composeL,
								$Orange_OpenSource$elm_advanced_grid$Grid$FilterModified(columnConfig),
								$elm$core$Maybe$Just)),
							$rtfeldman$elm_css$Html$Styled$Attributes$title(''),
							$rtfeldman$elm_css$Html$Styled$Attributes$value(
							A2($elm$core$Maybe$withDefault, '', columnConfig.filteringValue))
						]),
					_List_Nil),
					A2($Orange_OpenSource$elm_advanced_grid$Grid$viewQuickFilterButton, state, columnConfig)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Html$viewIf = F2(
	function (condition, html) {
		return condition ? html : $Orange_OpenSource$elm_advanced_grid$Grid$Html$noContent;
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedResizeHandle = F2(
	function (a, b) {
		return {$: 'UserClickedResizeHandle', a: a, b: b};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewVerticalBar = A2(
	$rtfeldman$elm_css$Html$Styled$div,
	_List_fromArray(
		[
			$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-vertical-bar')
		]),
	_List_Nil);
var $Orange_OpenSource$elm_advanced_grid$Grid$viewResizeHandle = function (columnConfig) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-resize-handle'),
				$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
					function (event) {
						return A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$UserClickedResizeHandle,
							columnConfig,
							$Orange_OpenSource$elm_advanced_grid$Grid$toPosition(event));
					})),
				$rtfeldman$elm_css$Html$Styled$Events$onBlur($Orange_OpenSource$elm_advanced_grid$Grid$UserEndedMouseInteraction)
			]),
		_List_fromArray(
			[$Orange_OpenSource$elm_advanced_grid$Grid$viewVerticalBar, $Orange_OpenSource$elm_advanced_grid$Grid$viewVerticalBar]));
};
var $rtfeldman$elm_css$Css$borderTop3 = $rtfeldman$elm_css$Css$prop3('border-top');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$black = $rtfeldman$elm_css$Css$hex('000');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewArrow = function (horizontalBorder) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-arrow-head'),
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						A3(
						horizontalBorder,
						$rtfeldman$elm_css$Css$px(5),
						$rtfeldman$elm_css$Css$solid,
						$Orange_OpenSource$elm_advanced_grid$Grid$Colors$black)
					]))
			]),
		_List_Nil);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewArrowDown = $Orange_OpenSource$elm_advanced_grid$Grid$viewArrow($rtfeldman$elm_css$Css$borderTop3);
var $Orange_OpenSource$elm_advanced_grid$Grid$viewArrowUp = $Orange_OpenSource$elm_advanced_grid$Grid$viewArrow($rtfeldman$elm_css$Css$borderBottom3);
var $Orange_OpenSource$elm_advanced_grid$Grid$viewSortingSymbol = F2(
	function (state, columnConfig) {
		var _v0 = state.sortedBy;
		if (_v0.$ === 'Just') {
			var config = _v0.a;
			return _Utils_eq(config.properties.id, columnConfig.properties.id) ? (_Utils_eq(state.order, $Orange_OpenSource$elm_advanced_grid$Grid$Descending) ? $Orange_OpenSource$elm_advanced_grid$Grid$viewArrowUp : $Orange_OpenSource$elm_advanced_grid$Grid$viewArrowDown) : $Orange_OpenSource$elm_advanced_grid$Grid$Html$noContent;
		} else {
			return $Orange_OpenSource$elm_advanced_grid$Grid$Html$noContent;
		}
	});
var $rtfeldman$elm_css$Html$Styled$span = $rtfeldman$elm_css$Html$Styled$node('span');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewTitle = F2(
	function (state, columnConfig) {
		var classIfSorted = function () {
			var _v1 = state.sortedBy;
			if (_v1.$ === 'Just') {
				var column = _v1.a;
				return _Utils_eq(column.properties.id, columnConfig.properties.id) ? 'eag-header-title-sorted' : '';
			} else {
				return '';
			}
		}();
		var classIfFiltered = function () {
			var _v0 = columnConfig.filteringValue;
			if (_v0.$ === 'Just') {
				return 'eag-header-title-filtered';
			} else {
				return '';
			}
		}();
		return A2(
			$rtfeldman$elm_css$Html$Styled$span,
			_List_fromArray(
				[
					A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'columnTitle'),
					$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-header-title'),
					$rtfeldman$elm_css$Html$Styled$Attributes$class(classIfSorted),
					$rtfeldman$elm_css$Html$Styled$Attributes$class(classIfFiltered)
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(columnConfig.properties.title)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewDataHeader = F3(
	function (state, columnConfig, conditionalAttributes) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-flex-row')
				]),
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_Utils_ap(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-flex-column'),
								$rtfeldman$elm_css$Html$Styled$Attributes$css(
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$width(
										$rtfeldman$elm_css$Css$px((columnConfig.properties.width - $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth) - $Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$resizingHandleWidth))
									]))
							]),
						conditionalAttributes),
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$div,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-flex-row')
								]),
							_List_fromArray(
								[
									A2($rtfeldman$elm_css$Html$Styled$Lazy$lazy, $Orange_OpenSource$elm_advanced_grid$Grid$viewDragHandle, columnConfig),
									A3($rtfeldman$elm_css$Html$Styled$Lazy$lazy2, $Orange_OpenSource$elm_advanced_grid$Grid$viewTitle, state, columnConfig),
									A3($rtfeldman$elm_css$Html$Styled$Lazy$lazy2, $Orange_OpenSource$elm_advanced_grid$Grid$viewSortingSymbol, state, columnConfig)
								])),
							A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$Html$viewIf,
							state.areFilterVisible,
							A3($rtfeldman$elm_css$Html$Styled$Lazy$lazy2, $Orange_OpenSource$elm_advanced_grid$Grid$viewFilter, state, columnConfig))
						])),
					A2($rtfeldman$elm_css$Html$Styled$Lazy$lazy, $Orange_OpenSource$elm_advanced_grid$Grid$viewResizeHandle, columnConfig)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewGhostHeader = function (state) {
	var _v0 = state.draggedColumn;
	if (_v0.$ === 'Just') {
		var draggedColumn = _v0.a;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			A2(
				$elm$core$List$cons,
				$Orange_OpenSource$elm_advanced_grid$Grid$headerStyles(state),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-header eag-ghost-header'),
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$left(
								$rtfeldman$elm_css$Css$px(draggedColumn.x - state.headerContainerPosition.x))
							]))
					])),
			_List_fromArray(
				[
					A3($Orange_OpenSource$elm_advanced_grid$Grid$viewDataHeader, state, draggedColumn.column, _List_Nil)
				]));
	} else {
		return $Orange_OpenSource$elm_advanced_grid$Grid$Html$noContent;
	}
};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserMovedResizeHandle = function (a) {
	return {$: 'UserMovedResizeHandle', a: a};
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousemove', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedHeader = function (a) {
	return {$: 'UserClickedHeader', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserDraggedColumn = function (a) {
	return {$: 'UserDraggedColumn', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserSwappedColumns = F2(
	function (a, b) {
		return {$: 'UserSwappedColumns', a: a, b: b};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onEnter = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseenter', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $Orange_OpenSource$elm_advanced_grid$Grid$draggingAttributes = F2(
	function (state, currentColumn) {
		var _v0 = state.draggedColumn;
		if (_v0.$ === 'Just') {
			var draggedColumn = _v0.a;
			return _Utils_ap(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
						$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove(
							function (event) {
								return $Orange_OpenSource$elm_advanced_grid$Grid$UserDraggedColumn(
									$Orange_OpenSource$elm_advanced_grid$Grid$toPosition(event));
							}))
					]),
				A2($Orange_OpenSource$elm_advanced_grid$Grid$isColumn, currentColumn, draggedColumn.column) ? _List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-invisible')
					]) : _List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
						$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onEnter(
							function (_v1) {
								return A2($Orange_OpenSource$elm_advanced_grid$Grid$UserSwappedColumns, currentColumn, draggedColumn.column);
							}))
					]));
		} else {
			return _List_Nil;
		}
	});
var $elm$virtual_dom$VirtualDom$lazy4 = _VirtualDom_lazy4;
var $rtfeldman$elm_css$VirtualDom$Styled$lazyHelp3 = F4(
	function (fn, arg1, arg2, arg3) {
		return $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled(
			A3(fn, arg1, arg2, arg3));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$lazy3 = F4(
	function (fn, arg1, arg2, arg3) {
		return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
			A5($elm$virtual_dom$VirtualDom$lazy4, $rtfeldman$elm_css$VirtualDom$Styled$lazyHelp3, fn, arg1, arg2, arg3));
	});
var $rtfeldman$elm_css$Html$Styled$Lazy$lazy3 = $rtfeldman$elm_css$VirtualDom$Styled$lazy3;
var $Orange_OpenSource$elm_advanced_grid$Grid$viewSelectionHeader = F2(
	function (state, _v0) {
		var areAllItemsChecked = A2(
			$elm$core$List$all,
			function ($) {
				return $.selected;
			},
			state.visibleItems);
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-selection-header'),
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$px($Orange_OpenSource$elm_advanced_grid$Grid$selectionColumn.properties.width - $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth))
						]))
				]),
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$input,
					_List_fromArray(
						[
							A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'allItemSelection'),
							$rtfeldman$elm_css$Html$Styled$Attributes$type_('checkbox'),
							$rtfeldman$elm_css$Html$Styled$Attributes$checked(areAllItemsChecked),
							$Orange_OpenSource$elm_advanced_grid$Grid$Html$stopPropagationOnClick($Orange_OpenSource$elm_advanced_grid$Grid$UserToggledAllItemSelection)
						]),
					_List_Nil)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewHeader = F3(
	function (state, columnConfig, index) {
		var headerIsClickable = _Utils_eq(state.resizedColumn, $elm$core$Maybe$Nothing) && (!state.filterHasFocus);
		var headerId = 'header-' + columnConfig.properties.id;
		var attributes = _List_fromArray(
			[
				A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', headerId),
				$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-header'),
				$rtfeldman$elm_css$Html$Styled$Attributes$id(headerId),
				$Orange_OpenSource$elm_advanced_grid$Grid$headerStyles(state),
				$rtfeldman$elm_css$Html$Styled$Attributes$title(columnConfig.properties.tooltip)
			]);
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			A3(
				$Orange_OpenSource$elm_advanced_grid$Grid$List$appendIf,
				headerIsClickable,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Events$onClick(
						$Orange_OpenSource$elm_advanced_grid$Grid$UserClickedHeader(columnConfig))
					]),
				attributes),
			_List_fromArray(
				[
					$Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumn(columnConfig) ? A3($rtfeldman$elm_css$Html$Styled$Lazy$lazy2, $Orange_OpenSource$elm_advanced_grid$Grid$viewSelectionHeader, state, columnConfig) : A4(
					$rtfeldman$elm_css$Html$Styled$Lazy$lazy3,
					$Orange_OpenSource$elm_advanced_grid$Grid$viewDataHeader,
					state,
					columnConfig,
					A2($Orange_OpenSource$elm_advanced_grid$Grid$draggingAttributes, state, columnConfig))
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewHeaders = function (state) {
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (index, column) {
				return A3($Orange_OpenSource$elm_advanced_grid$Grid$viewHeader, state, column, index);
			}),
		$Orange_OpenSource$elm_advanced_grid$Grid$visibleColumns_(state));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewHeaderContainer = function (state) {
	var isResizing = !_Utils_eq(state.resizedColumn, $elm$core$Maybe$Nothing);
	var attributes = A3(
		$Orange_OpenSource$elm_advanced_grid$Grid$List$appendIf,
		isResizing,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove(
					function (event) {
						return $Orange_OpenSource$elm_advanced_grid$Grid$UserMovedResizeHandle(
							$Orange_OpenSource$elm_advanced_grid$Grid$toPosition(event));
					}))
			]),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-header-container'),
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$height(
						$rtfeldman$elm_css$Css$px(state.config.headerHeight)),
						A2(
						$rtfeldman$elm_css$Css$property,
						'grid-template-columns',
						$Orange_OpenSource$elm_advanced_grid$Grid$gridTemplateColumns(state))
					])),
				$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$headerContainerId)
			]));
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		attributes,
		$Orange_OpenSource$elm_advanced_grid$Grid$viewHeaders(state));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$InfiniteListMsg = function (a) {
	return {$: 'InfiniteListMsg', a: a};
};
var $rtfeldman$elm_css$Html$Styled$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode;
var $Orange_OpenSource$elm_advanced_grid$Grid$horizontalScrollbarHeight = 20;
var $FabienHenon$elm_infinite_list_view$InfiniteList$decodeToModel = A2(
	$elm$json$Json$Decode$map,
	$FabienHenon$elm_infinite_list_view$InfiniteList$Model,
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['target', 'scrollTop']),
		$elm$json$Json$Decode$float));
var $FabienHenon$elm_infinite_list_view$InfiniteList$decodeScroll = function (scrollMsg) {
	return A2(
		$elm$json$Json$Decode$map,
		function (s) {
			return scrollMsg(s);
		},
		$FabienHenon$elm_infinite_list_view$InfiniteList$decodeToModel);
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$onScroll = function (scrollMsg) {
	return A2(
		$elm$html$Html$Events$on,
		'scroll',
		$FabienHenon$elm_infinite_list_view$InfiniteList$decodeScroll(scrollMsg));
};
var $elm$html$Html$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
var $FabienHenon$elm_infinite_list_view$InfiniteList$addAttribute = F3(
	function (f, value, newAttributes) {
		if (value.$ === 'Nothing') {
			return newAttributes;
		} else {
			var v = value.a;
			return A2(
				$elm$core$List$cons,
				f(v),
				newAttributes);
		}
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $FabienHenon$elm_infinite_list_view$InfiniteList$attributes = F2(
	function (totalHeight, _v0) {
		var styles = _v0.a.styles;
		var id = _v0.a.id;
		var _class = _v0.a._class;
		return A3(
			$FabienHenon$elm_infinite_list_view$InfiniteList$addAttribute,
			$elm$html$Html$Attributes$class,
			_class,
			A3(
				$FabienHenon$elm_infinite_list_view$InfiniteList$addAttribute,
				$elm$html$Html$Attributes$id,
				id,
				A2(
					$elm$core$List$map,
					function (_v1) {
						var attr = _v1.a;
						var value = _v1.b;
						return A2($elm$html$Html$Attributes$style, attr, value);
					},
					_Utils_ap(
						styles,
						_List_fromArray(
							[
								_Utils_Tuple2('margin', '0'),
								_Utils_Tuple2('padding', '0'),
								_Utils_Tuple2('box-sizing', 'border-box'),
								_Utils_Tuple2(
								'height',
								$elm$core$String$fromInt(totalHeight) + 'px'),
								_Utils_Tuple2('width', '100%')
							])))));
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$lazyView = F3(
	function (configValue, _v0, items) {
		var itemView = configValue.a.itemView;
		var customContainer = configValue.a.customContainer;
		var scrollTop = _v0.a;
		var _v1 = A3($FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizes, configValue, scrollTop, items);
		var skipCount = _v1.skipCount;
		var elements = _v1.elements;
		var topMargin = _v1.topMargin;
		var totalHeight = _v1.totalHeight;
		var elementsToShow = elements;
		var elementsCountToSkip = skipCount;
		return A2(
			$elm$html$Html$div,
			A2($FabienHenon$elm_infinite_list_view$InfiniteList$attributes, totalHeight, configValue),
			_List_fromArray(
				[
					A2(
					customContainer,
					_List_fromArray(
						[
							_Utils_Tuple2('margin', '0'),
							_Utils_Tuple2('padding', '0'),
							_Utils_Tuple2('box-sizing', 'border-box'),
							_Utils_Tuple2(
							'top',
							$elm$core$String$fromInt(topMargin) + 'px'),
							_Utils_Tuple2('position', 'relative')
						]),
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (idx, item) {
								return A4($elm$html$Html$Lazy$lazy3, itemView, idx, elementsCountToSkip + idx, item);
							}),
						elementsToShow))
				]));
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$view = F3(
	function (configValue, model, list) {
		return A4($elm$html$Html$Lazy$lazy3, $FabienHenon$elm_infinite_list_view$InfiniteList$lazyView, configValue, model, list);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewRows = function (state) {
	var editionInProgress = !_Utils_eq(state.editedItem, $elm$core$Maybe$Nothing);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		A3(
			$Orange_OpenSource$elm_advanced_grid$Grid$List$appendIf,
			editionInProgress,
			_List_fromArray(
				[
					$Orange_OpenSource$elm_advanced_grid$Grid$Scroll$onVerticalScroll($Orange_OpenSource$elm_advanced_grid$Grid$UserScrolledRowsVertically)
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-rows'),
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$height(
							$rtfeldman$elm_css$Css$px((state.containerHeight - state.config.headerHeight) - $Orange_OpenSource$elm_advanced_grid$Grid$horizontalScrollbarHeight)),
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$px(
								$Orange_OpenSource$elm_advanced_grid$Grid$gridWidth(state)))
						])),
					$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
					$FabienHenon$elm_infinite_list_view$InfiniteList$onScroll($Orange_OpenSource$elm_advanced_grid$Grid$InfiniteListMsg)),
					$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$rowsHtmlId)
				])),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$fromUnstyled(
				A3(
					$FabienHenon$elm_infinite_list_view$InfiniteList$view,
					$Orange_OpenSource$elm_advanced_grid$Grid$infiniteListConfig(state),
					state.infList,
					state.visibleItems))
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewGrid = function (state) {
	var editionInProgress = !_Utils_eq(state.editedItem, $elm$core$Maybe$Nothing);
	var columnIsResizedOrDragged = (!_Utils_eq(state.resizedColumn, $elm$core$Maybe$Nothing)) || (!_Utils_eq(state.draggedColumn, $elm$core$Maybe$Nothing));
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		A3(
			$Orange_OpenSource$elm_advanced_grid$Grid$List$appendIf,
			!_Utils_eq(state.quickFilteredColumn, $elm$core$Maybe$Nothing),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Events$onClick($Orange_OpenSource$elm_advanced_grid$Grid$UserClickedOutsideOfQuickFilter)
				]),
			A3(
				$Orange_OpenSource$elm_advanced_grid$Grid$List$appendIf,
				editionInProgress,
				_List_fromArray(
					[
						$Orange_OpenSource$elm_advanced_grid$Grid$Scroll$onVerticalScroll($Orange_OpenSource$elm_advanced_grid$Grid$UserScrolledRowsVertically)
					]),
				A3(
					$Orange_OpenSource$elm_advanced_grid$Grid$List$appendIf,
					columnIsResizedOrDragged,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Events$onMouseUp($Orange_OpenSource$elm_advanced_grid$Grid$UserEndedMouseInteraction),
							$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
							$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onLeave(
								function (_v0) {
									return $Orange_OpenSource$elm_advanced_grid$Grid$UserEndedMouseInteraction;
								}))
						]),
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-grid'),
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$width(
									$rtfeldman$elm_css$Css$px(state.containerWidth + $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth))
								]))
						])))),
		_List_fromArray(
			[
				$Orange_OpenSource$elm_advanced_grid$Grid$viewHeaderContainer(state),
				$Orange_OpenSource$elm_advanced_grid$Grid$viewRows(state),
				$Orange_OpenSource$elm_advanced_grid$Grid$viewGhostHeader(state)
			]));
};
var $rtfeldman$elm_css$Css$Structure$PseudoElement = function (a) {
	return {$: 'PseudoElement', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$WithPseudoElement = F2(
	function (a, b) {
		return {$: 'WithPseudoElement', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$pseudoElement = function (element) {
	return $rtfeldman$elm_css$Css$Preprocess$WithPseudoElement(
		$rtfeldman$elm_css$Css$Structure$PseudoElement(element));
};
var $rtfeldman$elm_css$Css$after = $rtfeldman$elm_css$Css$pseudoElement('after');
var $rtfeldman$elm_css$Css$before = $rtfeldman$elm_css$Css$pseudoElement('before');
var $rtfeldman$elm_css$Css$angleConverter = F2(
	function (suffix, angleVal) {
		return {
			angle: $rtfeldman$elm_css$Css$Structure$Compatible,
			angleOrDirection: $rtfeldman$elm_css$Css$Structure$Compatible,
			value: _Utils_ap(
				$elm$core$String$fromFloat(angleVal),
				suffix)
		};
	});
var $rtfeldman$elm_css$Css$deg = $rtfeldman$elm_css$Css$angleConverter('deg');
var $rtfeldman$elm_css$Css$float = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'float',
		'float',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$right = $rtfeldman$elm_css$Css$prop1('right');
var $rtfeldman$elm_css$Css$rotate = function (_v0) {
	var value = _v0.value;
	return {
		transform: $rtfeldman$elm_css$Css$Structure$Compatible,
		value: A2(
			$rtfeldman$elm_css$Css$cssFunction,
			'rotate',
			_List_fromArray(
				[value]))
	};
};
var $rtfeldman$elm_css$Css$valuesOrNone = function (list) {
	return $elm$core$List$isEmpty(list) ? {value: 'none'} : {
		value: A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				function ($) {
					return $.value;
				},
				list))
	};
};
var $rtfeldman$elm_css$Css$transforms = A2(
	$elm$core$Basics$composeL,
	$rtfeldman$elm_css$Css$prop1('transform'),
	$rtfeldman$elm_css$Css$valuesOrNone);
var $rtfeldman$elm_css$Css$transform = function (only) {
	return $rtfeldman$elm_css$Css$transforms(
		_List_fromArray(
			[only]));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$preferencesStyles = _List_fromArray(
	[
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-bordered',
		_List_fromArray(
			[
				A3(
				$rtfeldman$elm_css$Css$border3,
				$rtfeldman$elm_css$Css$px(1),
				$rtfeldman$elm_css$Css$solid,
				$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey2),
				$rtfeldman$elm_css$Css$margin($rtfeldman$elm_css$Css$auto),
				$rtfeldman$elm_css$Css$padding(
				$rtfeldman$elm_css$Css$px(5))
			])),
		A2(
		$rtfeldman$elm_css$Css$Global$class,
		'eag-close-button',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
				$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
				$rtfeldman$elm_css$Css$float($rtfeldman$elm_css$Css$right),
				$rtfeldman$elm_css$Css$width(
				$rtfeldman$elm_css$Css$px(16)),
				$rtfeldman$elm_css$Css$height(
				$rtfeldman$elm_css$Css$px(16)),
				$rtfeldman$elm_css$Css$opacity(
				$rtfeldman$elm_css$Css$num(0.3)),
				$rtfeldman$elm_css$Css$hover(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$opacity(
						$rtfeldman$elm_css$Css$num(1))
					])),
				$rtfeldman$elm_css$Css$before(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
						$rtfeldman$elm_css$Css$left(
						$rtfeldman$elm_css$Css$px(7)),
						A2($rtfeldman$elm_css$Css$property, 'content', '\' \''),
						$rtfeldman$elm_css$Css$height(
						$rtfeldman$elm_css$Css$px(17)),
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$px(2)),
						$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$black),
						$rtfeldman$elm_css$Css$transform(
						$rtfeldman$elm_css$Css$rotate(
							$rtfeldman$elm_css$Css$deg(45)))
					])),
				$rtfeldman$elm_css$Css$after(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
						$rtfeldman$elm_css$Css$left(
						$rtfeldman$elm_css$Css$px(7)),
						A2($rtfeldman$elm_css$Css$property, 'content', '\' \''),
						$rtfeldman$elm_css$Css$height(
						$rtfeldman$elm_css$Css$px(17)),
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$px(2)),
						$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$black),
						$rtfeldman$elm_css$Css$transform(
						$rtfeldman$elm_css$Css$rotate(
							$rtfeldman$elm_css$Css$deg(-45)))
					]))
			]))
	]);
var $Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$preferences = $rtfeldman$elm_css$Css$Global$global($Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$preferencesStyles);
var $Orange_OpenSource$elm_advanced_grid$Grid$viewClosebutton = A2(
	$rtfeldman$elm_css$Html$Styled$div,
	_List_fromArray(
		[
			A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'configureDisplayCloseCross'),
			$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-close-button'),
			$rtfeldman$elm_css$Html$Styled$Events$onClick($Orange_OpenSource$elm_advanced_grid$Grid$UserClickedPreferenceCloseButton)
		]),
	_List_Nil);
var $Orange_OpenSource$elm_advanced_grid$Grid$UserToggledColumnVisibility = function (a) {
	return {$: 'UserToggledColumnVisibility', a: a};
};
var $rtfeldman$elm_css$Html$Styled$Attributes$for = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('htmlFor');
var $rtfeldman$elm_css$Html$Styled$label = $rtfeldman$elm_css$Html$Styled$node('label');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewColumnVisibilitySelector = function (columnConfig) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$input,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$id(columnConfig.properties.id),
						$rtfeldman$elm_css$Html$Styled$Attributes$type_('checkbox'),
						$rtfeldman$elm_css$Html$Styled$Attributes$checked(columnConfig.properties.visible),
						$rtfeldman$elm_css$Html$Styled$Events$onClick(
						$Orange_OpenSource$elm_advanced_grid$Grid$UserToggledColumnVisibility(columnConfig))
					]),
				_List_Nil),
				A2(
				$rtfeldman$elm_css$Html$Styled$label,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-margin-Left-XS'),
						$rtfeldman$elm_css$Html$Styled$Attributes$for(columnConfig.properties.id)
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text(columnConfig.properties.title)
					]))
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewPreferences = function (state) {
	var dataColumns = A2(
		$elm$core$List$filter,
		A2($elm$core$Basics$composeL, $elm$core$Basics$not, $Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumn),
		state.config.columns);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-bordered'),
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$px(state.containerWidth * 0.6))
					]))
			]),
		_Utils_ap(
			_List_fromArray(
				[$Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$preferences, $Orange_OpenSource$elm_advanced_grid$Grid$viewClosebutton]),
			A2($elm$core$List$map, $Orange_OpenSource$elm_advanced_grid$Grid$viewColumnVisibilitySelector, dataColumns)));
};
var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNode = F3(
	function (a, b, c) {
		return {$: 'KeyedNode', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS = F4(
	function (a, b, c, d) {
		return {$: 'KeyedNodeNS', a: a, b: b, c: c, d: d};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$NodeNS = F4(
	function (a, b, c, d) {
		return {$: 'NodeNS', a: a, b: b, c: c, d: d};
	});
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $rtfeldman$elm_css$VirtualDom$Styled$mapAttribute = F2(
	function (transform, _v0) {
		var prop = _v0.a;
		var styles = _v0.b;
		var classname = _v0.c;
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$mapAttribute, transform, prop),
			styles,
			classname);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$map = F2(
	function (transform, vdomNode) {
		switch (vdomNode.$) {
			case 'Node':
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					$rtfeldman$elm_css$VirtualDom$Styled$Node,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$map(transform),
						children));
			case 'NodeNS':
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					$rtfeldman$elm_css$VirtualDom$Styled$NodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$map(transform),
						children));
			case 'KeyedNode':
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					$rtfeldman$elm_css$VirtualDom$Styled$KeyedNode,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						function (_v1) {
							var key = _v1.a;
							var child = _v1.b;
							return _Utils_Tuple2(
								key,
								A2($rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
						},
						children));
			case 'KeyedNodeNS':
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					$rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						function (_v2) {
							var key = _v2.a;
							var child = _v2.b;
							return _Utils_Tuple2(
								key,
								A2($rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
						},
						children));
			default:
				var vdom = vdomNode.a;
				return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
					A2($elm$virtual_dom$VirtualDom$map, transform, vdom));
		}
	});
var $rtfeldman$elm_css$Html$Styled$map = $rtfeldman$elm_css$VirtualDom$Styled$map;
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$FocusLost = {$: 'FocusLost'};
var $rtfeldman$elm_css$Css$maxHeight = $rtfeldman$elm_css$Css$prop1('max-height');
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$quickFilterPopupStyles = F2(
	function (popupPosition, columnWidth) {
		return $rtfeldman$elm_css$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
					$rtfeldman$elm_css$Css$left(
					$rtfeldman$elm_css$Css$px(popupPosition.x)),
					$rtfeldman$elm_css$Css$top(
					$rtfeldman$elm_css$Css$px(popupPosition.y)),
					$rtfeldman$elm_css$Css$zIndex(
					$rtfeldman$elm_css$Css$int(1000)),
					A3(
					$rtfeldman$elm_css$Css$border3,
					$rtfeldman$elm_css$Css$px(1),
					$rtfeldman$elm_css$Css$solid,
					$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey2),
					$rtfeldman$elm_css$Css$margin($rtfeldman$elm_css$Css$auto),
					$rtfeldman$elm_css$Css$padding(
					$rtfeldman$elm_css$Css$px(5)),
					$rtfeldman$elm_css$Css$opacity(
					$rtfeldman$elm_css$Css$int(1)),
					$rtfeldman$elm_css$Css$width(
					$rtfeldman$elm_css$Css$px(
						A2($elm$core$Basics$max, columnWidth, 115))),
					$rtfeldman$elm_css$Css$maxHeight(
					$rtfeldman$elm_css$Css$px(400)),
					$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$white),
					$rtfeldman$elm_css$Css$overflowX($rtfeldman$elm_css$Css$hidden),
					$rtfeldman$elm_css$Css$overflowY($rtfeldman$elm_css$Css$auto),
					$rtfeldman$elm_css$Css$whiteSpace($rtfeldman$elm_css$Css$noWrap)
				]));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$tabindex = function (n) {
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$UserClickedClear = {$: 'UserClickedClear'};
var $rtfeldman$elm_css$Html$Styled$button = $rtfeldman$elm_css$Html$Styled$node('button');
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$clear = 'Clear';
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === 'RBEmpty_elm_builtin') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$isEmpty(dict);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$viewClearButton = function (model) {
	return _List_fromArray(
		[
			$elm$core$Set$isEmpty(model.filteringValues) ? $Orange_OpenSource$elm_advanced_grid$Grid$Html$noContent : A2(
			$rtfeldman$elm_css$Html$Styled$button,
			_List_fromArray(
				[
					A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'clearQuickFilterButton'),
					$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-primary-button'),
					$rtfeldman$elm_css$Html$Styled$Events$onClick($Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$UserClickedClear)
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(
					A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$clear, model.labels))
				]))
		]);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$viewEllipsis = F2(
	function (totalNumber, actualNumber) {
		return (_Utils_cmp(totalNumber, actualNumber) > 0) ? _List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$span,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$auto)
							]))
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text('...')
					]))
			]) : _List_Nil;
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$UserToggledEntry = function (a) {
	return {$: 'UserToggledEntry', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$checkIcon = 'M 0 5 L 6 10 L 12 0 L14 0 L 6 14 L 0 7 Z';
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGreyRgb = A3($avh4$elm_color$Color$rgb, 0.2, 0.2, 0.2);
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawSvg = F3(
	function (color, size, svgPath) {
		return $rtfeldman$elm_css$Svg$Styled$fromUnstyled(
			A2(
				$elm_community$typed_svg$TypedSvg$svg,
				_List_fromArray(
					[
						A4($elm_community$typed_svg$TypedSvg$Attributes$viewBox, 0, 0, size, size),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$width(size),
						$elm_community$typed_svg$TypedSvg$Attributes$InPx$height(size)
					]),
				_List_fromArray(
					[
						A2(
						$elm_community$typed_svg$TypedSvg$g,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm_community$typed_svg$TypedSvg$path,
								_List_fromArray(
									[
										$elm_community$typed_svg$TypedSvg$Attributes$d(svgPath),
										$elm_community$typed_svg$TypedSvg$Attributes$fill(
										$elm_community$typed_svg$TypedSvg$Types$Fill(color))
									]),
								_List_Nil)
							]))
					])));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawDarkSvg = F2(
	function (size, svgPath) {
		return A3($Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawSvg, $Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGreyRgb, size, svgPath);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$viewQuickFilterEntry = function (params) {
	var isSelected = A2($elm$core$Set$member, params.label, params.selectedValues);
	var selectionSymbol = isSelected ? A2($Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawDarkSvg, $Orange_OpenSource$elm_advanced_grid$Grid$Icons$width, $Orange_OpenSource$elm_advanced_grid$Grid$Icons$checkIcon) : $Orange_OpenSource$elm_advanced_grid$Grid$Html$noContent;
	var className = (params.isCommand || _Utils_eq(params.label, params.emptyLabel)) ? 'eag-quick-filter-control eag-quick-filter-entry' : 'eag-quick-filter-entry';
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		A3(
			$Orange_OpenSource$elm_advanced_grid$Grid$List$appendIf,
			!isSelected,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$paddingLeft(
							$rtfeldman$elm_css$Css$px(15))
						]))
				]),
			_List_fromArray(
				[
					A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'quickFilterEntry'),
					$rtfeldman$elm_css$Html$Styled$Attributes$class(className),
					$rtfeldman$elm_css$Html$Styled$Events$onClick(
					$Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$UserToggledEntry(params.label))
				])),
		_List_fromArray(
			[
				selectionSymbol,
				$rtfeldman$elm_css$Html$Styled$text(params.label)
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$viewEntries = function (model) {
	var params = function (value) {
		return {
			emptyLabel: A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$empty, model.labels),
			isCommand: false,
			label: value,
			outputStrings: model.outputStrings,
			selectedValues: model.filteringValues
		};
	};
	return A2(
		$elm$core$List$map,
		function (value) {
			return $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$viewQuickFilterEntry(
				params(value));
		},
		model.propositions);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$view = function (model) {
	var x = model.position.x - model.origin.x;
	var popupPosition = {
		x: (_Utils_cmp(x + model.width, model.maxX) > 0) ? ((x - model.width) + $Orange_OpenSource$elm_advanced_grid$Grid$Icons$width) : x,
		y: model.position.y - model.origin.y
	};
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				A2($Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$quickFilterPopupStyles, popupPosition, model.width),
				$rtfeldman$elm_css$Html$Styled$Attributes$tabindex(0),
				$rtfeldman$elm_css$Html$Styled$Events$onBlur($Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$FocusLost),
				$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$openedQuickFilterHtmlId)
			]),
		_Utils_ap(
			$Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$viewClearButton(model),
			_Utils_ap(
				$Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$viewEntries(model),
				A2(
					$Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$viewEllipsis,
					$elm$core$List$length(model.propositions),
					$Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$maxQuickFilterPropositions))));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewQuickFilter = F2(
	function (filteredColumn, quickFilterModel) {
		if (filteredColumn.$ === 'Just') {
			var updatedQuickFilterView = $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilter$view(quickFilterModel);
			return A2($rtfeldman$elm_css$Html$Styled$map, $Orange_OpenSource$elm_advanced_grid$Grid$QuickFilterMsg, updatedQuickFilterView);
		} else {
			return $Orange_OpenSource$elm_advanced_grid$Grid$Html$noContent;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserSubmittedForm = function (a) {
	return {$: 'UserSubmittedForm', a: a};
};
var $rtfeldman$elm_css$Html$Styled$form = $rtfeldman$elm_css$Html$Styled$node('form');
var $rtfeldman$elm_css$Html$Styled$Events$alwaysPreventDefault = function (msg) {
	return _Utils_Tuple2(msg, true);
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $rtfeldman$elm_css$Html$Styled$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $rtfeldman$elm_css$Html$Styled$Events$onSubmit = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$preventDefaultOn,
		'submit',
		A2(
			$elm$json$Json$Decode$map,
			$rtfeldman$elm_css$Html$Styled$Events$alwaysPreventDefault,
			$elm$json$Json$Decode$succeed(msg)));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$shouldDisplayTextarea = function (model) {
	return model.maxLength > 50;
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$EditorLostFocus = function (a) {
	return {$: 'EditorLostFocus', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$OnKeyUp = function (a) {
	return {$: 'OnKeyUp', a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserChangedValue = function (a) {
	return {$: 'UserChangedValue', a: a};
};
var $rtfeldman$elm_css$Html$Styled$Attributes$maxlength = function (n) {
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$attribute,
		'maxlength',
		$elm$core$String$fromInt(n));
};
var $rtfeldman$elm_css$Html$Styled$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$onKeyUp = function (msgConstructor) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'keyup',
		A2($elm$json$Json$Decode$map, msgConstructor, $rtfeldman$elm_css$Html$Styled$Events$keyCode));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$viewInput = F2(
	function (model, item) {
		var y = model.position.y - model.origin.y;
		var x = model.position.x - model.origin.x;
		return A2(
			$rtfeldman$elm_css$Html$Styled$input,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$height(
							$rtfeldman$elm_css$Css$px(model.cellDimensions.height)),
							$rtfeldman$elm_css$Css$left(
							$rtfeldman$elm_css$Css$px(x)),
							$rtfeldman$elm_css$Css$margin(
							$rtfeldman$elm_css$Css$px(0)),
							$rtfeldman$elm_css$Css$padding(
							$rtfeldman$elm_css$Css$px(0)),
							$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
							$rtfeldman$elm_css$Css$top(
							$rtfeldman$elm_css$Css$px(y)),
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$px(model.cellDimensions.width))
						])),
					$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$editorId),
					$rtfeldman$elm_css$Html$Styled$Events$onBlur(
					$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$EditorLostFocus(item)),
					$rtfeldman$elm_css$Html$Styled$Events$onInput($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserChangedValue),
					$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$onKeyUp($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$OnKeyUp),
					$rtfeldman$elm_css$Html$Styled$Attributes$maxlength(model.maxLength),
					$rtfeldman$elm_css$Html$Styled$Attributes$value(model.value)
				]),
			_List_Nil);
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$rows = function (n) {
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$attribute,
		'rows',
		$elm$core$String$fromInt(n));
};
var $rtfeldman$elm_css$Html$Styled$textarea = $rtfeldman$elm_css$Html$Styled$node('textarea');
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserClickedCancel = {$: 'UserClickedCancel'};
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$cancel = 'cancel';
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$submit = 'Submit';
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$viewButtons = function (model) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$displayFlex,
						$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row),
						$rtfeldman$elm_css$Css$flexGrow(
						$rtfeldman$elm_css$Css$num(1)),
						$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$flexEnd),
						$rtfeldman$elm_css$Css$marginLeft(
						$rtfeldman$elm_css$Css$px(10)),
						$rtfeldman$elm_css$Css$marginRight(
						$rtfeldman$elm_css$Css$px(20)),
						$rtfeldman$elm_css$Css$marginTop(
						$rtfeldman$elm_css$Css$px(5)),
						$rtfeldman$elm_css$Css$marginBottom(
						$rtfeldman$elm_css$Css$px(5))
					]))
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$button,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$type_('button'),
						$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-button'),
						$rtfeldman$elm_css$Html$Styled$Events$onClick($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserClickedCancel)
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text(
						A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$cancel, model.labels))
					])),
				A2(
				$rtfeldman$elm_css$Html$Styled$button,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$type_('submit'),
						$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-primary-button')
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text(
						A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$submit, model.labels))
					]))
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$maxTextareaRows = 10;
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$wrapAtColumn = 50;
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$visibleLines = function (model) {
	var maxLineOfText = $elm$core$Basics$round(model.maxLength / $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$wrapAtColumn);
	return A2($elm$core$Basics$min, maxLineOfText, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$maxTextareaRows);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$viewTextarea = F2(
	function (model, item) {
		var cellY = model.position.y - model.origin.y;
		var y = (_Utils_cmp(cellY + model.textareaDimensions.height, model.maxY) > 0) ? ((cellY - model.textareaDimensions.height) + model.cellDimensions.height) : cellY;
		var cellX = model.position.x - model.origin.x;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$white),
							A3(
							$rtfeldman$elm_css$Css$border3,
							$rtfeldman$elm_css$Css$px(1),
							$rtfeldman$elm_css$Css$solid,
							$Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey),
							$rtfeldman$elm_css$Css$displayFlex,
							$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$column),
							$rtfeldman$elm_css$Css$left(
							$rtfeldman$elm_css$Css$px(cellX)),
							$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
							$rtfeldman$elm_css$Css$top(
							$rtfeldman$elm_css$Css$px(y))
						])),
					$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$textareaId)
				]),
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$textarea,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$width(
									$rtfeldman$elm_css$Css$px(model.cellDimensions.width - 40)),
									$rtfeldman$elm_css$Css$margin(
									$rtfeldman$elm_css$Css$px(10)),
									$rtfeldman$elm_css$Css$padding(
									$rtfeldman$elm_css$Css$px(3))
								])),
							$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$editorId),
							$rtfeldman$elm_css$Html$Styled$Events$onInput($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserChangedValue),
							$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$onKeyUp($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$OnKeyUp),
							$rtfeldman$elm_css$Html$Styled$Attributes$maxlength(model.maxLength),
							$rtfeldman$elm_css$Html$Styled$Attributes$rows(
							$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$visibleLines(model)),
							$rtfeldman$elm_css$Html$Styled$Attributes$value(model.value)
						]),
					_List_Nil),
					$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$viewButtons(model)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$view = F2(
	function (model, item) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$form,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Events$onSubmit(
					$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserSubmittedForm(item))
				]),
			_List_fromArray(
				[
					$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$shouldDisplayTextarea(model) ? A2($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$viewTextarea, model, item) : A2($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$viewInput, model, item)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewStringEditor = F2(
	function (editedItem, stringEditorModel) {
		if (editedItem.$ === 'Just') {
			var item = editedItem.a;
			var updatedStringEditorView = A2($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$view, stringEditorModel, item);
			return A2($rtfeldman$elm_css$Html$Styled$map, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditorMsg, updatedStringEditorView);
		} else {
			return $Orange_OpenSource$elm_advanced_grid$Grid$Html$noContent;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$view = function (model) {
	var _v0 = model;
	var state = _v0.a;
	var stringEditorModel = _v0.b;
	var quickFilterModel = _v0.c;
	return $rtfeldman$elm_css$Html$Styled$toUnstyled(
		state.showPreferences ? $Orange_OpenSource$elm_advanced_grid$Grid$viewPreferences(state) : A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$rootContainerId),
					$rtfeldman$elm_css$Html$Styled$Attributes$class('eag-root'),
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$px(state.containerWidth)),
							$rtfeldman$elm_css$Css$height(
							$rtfeldman$elm_css$Css$px(state.containerHeight))
						]))
				]),
			_List_fromArray(
				[
					$Orange_OpenSource$elm_advanced_grid$Grid$Stylesheet$grid,
					A2($rtfeldman$elm_css$Html$Styled$Lazy$lazy, $Orange_OpenSource$elm_advanced_grid$Grid$viewGrid, state),
					A3($rtfeldman$elm_css$Html$Styled$Lazy$lazy2, $Orange_OpenSource$elm_advanced_grid$Grid$viewStringEditor, state.editedItem, stringEditorModel),
					A3($rtfeldman$elm_css$Html$Styled$Lazy$lazy2, $Orange_OpenSource$elm_advanced_grid$Grid$viewQuickFilter, state.quickFilteredColumn, quickFilterModel)
				])));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewGrid = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$gridContainerId),
				A2($elm$html$Html$Attributes$style, 'background-color', 'white'),
				A2($elm$html$Html$Attributes$style, 'margin-left', 'auto'),
				A2($elm$html$Html$Attributes$style, 'margin-right', 'auto'),
				A2($elm$html$Html$Attributes$style, 'color', '#555555'),
				A2($elm$html$Html$Attributes$style, 'width', '100%')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$map,
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg,
				$Orange_OpenSource$elm_advanced_grid$Grid$view(model.gridModel))
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$DisplayPreferences = {$: 'DisplayPreferences'};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$HidePreferences = {$: 'HidePreferences'};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$ResetFilters = {$: 'ResetFilters'};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$SetAscendingOrder = {$: 'SetAscendingOrder'};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$SetDecendingOrder = {$: 'SetDecendingOrder'};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$SetFilters = {$: 'SetFilters'};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewButton = F2(
	function (label, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					A2($elm$html$Html$Attributes$style, 'margin', '10px'),
					A2($elm$html$Html$Attributes$style, 'background-color', 'darkturquoise'),
					A2($elm$html$Html$Attributes$style, 'padding', '0.5rem'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
					A2($elm$html$Html$Attributes$style, 'border-color', 'aqua'),
					A2($elm$html$Html$Attributes$style, 'font-size', 'medium')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$menuItemAttributes = function (id) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$attribute, 'data-testid', id),
			A2($elm$html$Html$Attributes$style, 'padding-top', '10px'),
			A2($elm$html$Html$Attributes$style, 'color', '#EEEEEE'),
			A2($elm$html$Html$Attributes$style, 'margin', '10px')
		]);
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewItem = function (item) {
	return $elm$html$Html$text(
		'id:' + ($elm$core$String$fromInt(item.data.id) + (' - name: ' + (item.data.name + ''))));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewClickedItem = function (model) {
	var selectedItem = function () {
		var _v0 = model.clickedItem;
		if (_v0.$ === 'Just') {
			var item = _v0.a;
			return $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewItem(item);
		} else {
			return $elm$html$Html$text('None.');
		}
	}();
	return A2(
		$elm$html$Html$div,
		$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$menuItemAttributes('clickedItem'),
		_List_fromArray(
			[
				$elm$html$Html$text('Clicked Item = '),
				selectedItem
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$UserRequiredScrollingToCity = function (a) {
	return {$: 'UserRequiredScrollingToCity', a: a};
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewInput = A2(
	$elm$html$Html$label,
	$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$menuItemAttributes('input-label'),
	_List_fromArray(
		[
			$elm$html$Html$text('Scroll to first city starting with:'),
			A2(
			$elm$html$Html$input,
			_Utils_ap(
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$menuItemAttributes('input'),
				_List_fromArray(
					[
						$elm$html$Html$Events$onInput($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$UserRequiredScrollingToCity),
						A2($elm$html$Html$Attributes$style, 'color', 'black'),
						A2($elm$html$Html$Attributes$style, 'vertical-align', 'baseline'),
						A2($elm$html$Html$Attributes$style, 'font-size', 'medium')
					])),
			_List_Nil)
		]));
var $elm$html$Html$li = _VirtualDom_node('li');
var $Orange_OpenSource$elm_advanced_grid$Grid$selectedAndVisibleItems = function (_v0) {
	var state = _v0.a;
	return A2(
		$elm$core$List$filter,
		function ($) {
			return $.selected;
		},
		state.visibleItems);
};
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewSelectedItems = function (model) {
	var selectedItems = $Orange_OpenSource$elm_advanced_grid$Grid$selectedAndVisibleItems(model.gridModel);
	return A2(
		$elm$html$Html$div,
		$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$menuItemAttributes('label'),
		_List_fromArray(
			[
				$elm$html$Html$text(
				(!$elm$core$List$isEmpty(selectedItems)) ? 'SelectedItems:' : 'Use checkboxes to select items.'),
				A2(
				$elm$html$Html$ul,
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$menuItemAttributes('selectedItems'),
				A2(
					$elm$core$List$map,
					function (it) {
						return A2(
							$elm$html$Html$li,
							_List_Nil,
							_List_fromArray(
								[
									$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewItem(it)
								]));
					},
					selectedItems))
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewMenu = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column')
			]),
		_List_fromArray(
			[
				model.arePreferencesVisible ? A2($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewButton, 'Hide Preferences', $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$HidePreferences) : A2($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewButton, 'Show Preferences', $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$DisplayPreferences),
				A2($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewButton, 'Set Filters', $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$SetFilters),
				A2($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewButton, 'Reset Filters', $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$ResetFilters),
				A2($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewButton, 'Sort cities ascending', $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$SetAscendingOrder),
				A2($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewButton, 'Sort cities descending', $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$SetDecendingOrder),
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewInput,
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewClickedItem(model),
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewSelectedItems(model)
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start')
			]),
		_List_fromArray(
			[
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewMenu(model),
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewGrid(model)
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$main = $elm$browser$Browser$element(
	{
		init: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$init,
		subscriptions: function (_v0) {
			return $elm$core$Platform$Sub$none;
		},
		update: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$update,
		view: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$view
	});
_Platform_export({'Examples':{'LargeList':{'init':$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}}});}(this));