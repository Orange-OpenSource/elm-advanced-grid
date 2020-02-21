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

	/**_UNUSED/
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

	/**/
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

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
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

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


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



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


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

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
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

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
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


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
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
	if (region.cz.bk === region.cY.bk)
	{
		return 'on line ' + region.cz.bk;
	}
	return 'on lines ' + region.cz.bk + ' through ' + region.cY.bk;
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



/**_UNUSED/
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

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

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
		impl.ey,
		impl.fj,
		impl.fc,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_enqueueEffects(managers, result.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, result.b, subscriptions(model));

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


function _Platform_export(exports)
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


function _Platform_export_UNUSED(exports)
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

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
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

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
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
		al: func(record.al),
		cA: record.cA,
		cw: record.cw
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
		var message = !tag ? value : tag < 3 ? value.a : value.al;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.cA;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.cw) && event.preventDefault(),
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
		impl.ey,
		impl.fj,
		impl.fc,
		function(sendToApp, initialModel) {
			var view = impl.fm;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
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
		impl.ey,
		impl.fj,
		impl.fc,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.cy && impl.cy(sendToApp)
			var view = impl.fm;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.d$);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.y) && (_VirtualDom_doc.title = title = doc.y);
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
	var onUrlChange = impl.eW;
	var onUrlRequest = impl.eX;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		cy: function(sendToApp)
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
							&& curr.dx === next.dx
							&& curr.c5 === next.c5
							&& curr.dt.a === next.dt.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		ey: function(flags)
		{
			return A3(impl.ey, flags, _Browser_getUrl(), key);
		},
		fm: impl.fm,
		fj: impl.fj,
		fc: impl.fc
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
		? { eu: 'hidden', d3: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { eu: 'mozHidden', d3: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { eu: 'msHidden', d3: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { eu: 'webkitHidden', d3: 'webkitvisibilitychange' }
		: { eu: 'hidden', d3: 'visibilitychange' };
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
		dH: _Browser_getScene(),
		dT: {
			B: _Browser_window.pageXOffset,
			a7: _Browser_window.pageYOffset,
			A: _Browser_doc.documentElement.clientWidth,
			c4: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		A: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		c4: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			dH: {
				A: node.scrollWidth,
				c4: node.scrollHeight
			},
			dT: {
				B: node.scrollLeft,
				a7: node.scrollTop,
				A: node.clientWidth,
				c4: node.clientHeight
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
			dH: _Browser_getScene(),
			dT: {
				B: x,
				a7: y,
				A: _Browser_doc.documentElement.clientWidth,
				c4: _Browser_doc.documentElement.clientHeight
			},
			bQ: {
				B: x + rect.left,
				a7: y + rect.top,
				A: rect.width,
				c4: rect.height
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
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
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
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
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
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
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
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
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
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
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
		return {$: 0, a: a, b: b, c: c, d: d};
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
	return {$: 1, a: a};
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
	return {$: 0, a: a};
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
		if (!builder.p) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.r),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.r);
		} else {
			var treeLen = builder.p * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.s) : builder.s;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.p);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.r) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.r);
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
					{s: nodeList, p: (len / $elm$core$Array$branchFactor) | 0, r: tail});
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
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
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
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {c1: fragment, c5: host, dr: path, dt: port_, dx: protocol, dy: query};
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
					if (_v1.$ === 1) {
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
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
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
		var task = _v0;
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
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
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
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
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
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
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
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
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
		if (!maybe.$) {
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
	return {$: 0, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Unsorted = 0;
var $Orange_OpenSource$elm_advanced_grid$Grid$columnConfigProperties = function (_v0) {
	var id = _v0.n;
	var isEditable = _v0.v;
	var title = _v0.y;
	var tooltip = _v0.z;
	var width = _v0.A;
	var localize = _v0.w;
	return {
		n: id,
		v: isEditable,
		ab: 0,
		y: localize(title),
		z: localize(tooltip),
		aK: true,
		A: width
	};
};
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
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$containsParser = $elm$parser$Parser$succeed($elm$core$Basics$identity);
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
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
		};
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
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.a);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.bn, offset) < 0,
					0,
					{cT: col, f: s0.f, i: s0.i, bn: offset, dD: row, a: s0.a});
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
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.bn, s.dD, s.cT, s);
	};
};
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return (c === ' ') || ((c === '\n') || (c === '\r'));
	});
var $elm$parser$Parser$spaces = $elm$parser$Parser$Advanced$spaces;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {cT: col, ec: contextStack, du: problem, dD: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.dD, s.cT, x, s.f));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$not = _Basics_not;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.bn, s.dD, s.cT, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{cT: newCol, f: s.f, i: s.i, bn: newOffset, dD: newRow, a: s.a});
	};
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
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$makeFilter = function (_v0) {
	var getter = _v0.u;
	var equal = _v0.X;
	var lessThan = _v0._;
	var greaterThan = _v0.Y;
	var contains = _v0.W;
	var typedParser = _v0.bw;
	return {
		W: {
			ae: F2(
				function (value, item) {
					return A2(
						contains,
						getter(item),
						value);
				}),
			an: A2($elm$parser$Parser$keeper, $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$containsParser, typedParser)
		},
		X: {
			ae: F2(
				function (value, item) {
					return A2(
						equal,
						getter(item),
						value);
				}),
			an: A2($elm$parser$Parser$keeper, $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$equalityParser, typedParser)
		},
		Y: {
			ae: F2(
				function (value, item) {
					return A2(
						greaterThan,
						getter(item),
						value);
				}),
			an: A2($elm$parser$Parser$keeper, $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$greaterThanParser, typedParser)
		},
		_: {
			ae: F2(
				function (value, item) {
					return A2(
						lessThan,
						getter(item),
						value);
				}),
			an: A2($elm$parser$Parser$keeper, $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$lessThanParser, typedParser)
		}
	};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$empty = 'Empty';
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize = F2(
	function (key, translations) {
		return A2(
			$elm$core$Maybe$withDefault,
			key,
			A2($elm$core$Dict$get, key, translations));
	});
var $elm$core$String$toLower = _String_toLower;
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$stringEquals = F3(
	function (labels, valueInCell, valueInFilter) {
		return _Utils_eq(
			$elm$core$String$toLower(valueInCell),
			$elm$core$String$toLower(valueInFilter)) || ((valueInCell === '') && _Utils_eq(
			valueInFilter,
			A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$empty, labels)));
	});
var $elm$parser$Parser$Advanced$chompUntilEndOr = function (str) {
	return function (s) {
		var _v0 = A5(_Parser_findSubString, str, s.bn, s.dD, s.cT, s.a);
		var newOffset = _v0.a;
		var newRow = _v0.b;
		var newCol = _v0.c;
		var adjustedOffset = (newOffset < 0) ? $elm$core$String$length(s.a) : newOffset;
		return A3(
			$elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.bn, adjustedOffset) < 0,
			0,
			{cT: newCol, f: s.f, i: s.i, bn: adjustedOffset, dD: newRow, a: s.a});
	};
};
var $elm$parser$Parser$chompUntilEndOr = $elm$parser$Parser$Advanced$chompUntilEndOr;
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
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
						A3($elm$core$String$slice, s0.bn, s1.bn, s0.a),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$stringParser = $elm$parser$Parser$getChompedString(
	$elm$parser$Parser$chompUntilEndOr('\u0000'));
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$stringFilter = F2(
	function (getter, labels) {
		return $Orange_OpenSource$elm_advanced_grid$Grid$Filters$makeFilter(
			{
				W: F2(
					function (a, b) {
						return A2(
							$elm$core$String$contains,
							$elm$core$String$toLower(b),
							$elm$core$String$toLower(a));
					}),
				X: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$stringEquals(labels),
				u: getter,
				Y: F2(
					function (a, b) {
						return _Utils_cmp(
							$elm$core$String$toLower(a),
							$elm$core$String$toLower(b)) > 0;
					}),
				_: F2(
					function (a, b) {
						return _Utils_cmp(
							$elm$core$String$toLower(a),
							$elm$core$String$toLower(b)) < 0;
					}),
				bw: $Orange_OpenSource$elm_advanced_grid$Grid$Parsers$stringParser
			});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$UserDoubleClickedEditableCell = F4(
	function (a, b, c, d) {
		return {$: 21, a: a, b: b, c: c, d: d};
	});
var $rtfeldman$elm_css$Css$Preprocess$ApplyStyles = function (a) {
	return {$: 6, a: a};
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
var $rtfeldman$elm_css$Css$Preprocess$AppendProperty = function (a) {
	return {$: 0, a: a};
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
				case 0:
					var str = style.a;
					var key = A2(
						$elm$core$Maybe$withDefault,
						'',
						$elm$core$List$head(
							A2($elm$core$String$split, ':', str)));
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, key);
				case 1:
					var selector = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-selector'));
				case 2:
					var combinator = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-combinator'));
				case 3:
					var pseudoElement = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-pseudo-element setter'));
				case 4:
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-media-query'));
				case 5:
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
var $rtfeldman$elm_css$Css$Internal$IncompatibleUnits = 0;
var $rtfeldman$elm_css$Css$Structure$Compatible = 0;
var $elm$core$String$fromFloat = _String_fromNumber;
var $rtfeldman$elm_css$Css$Internal$lengthConverter = F3(
	function (units, unitLabel, numericValue) {
		return {
			cE: 0,
			cP: 0,
			aU: 0,
			F: 0,
			bj: 0,
			aY: 0,
			ak: 0,
			aZ: 0,
			a_: 0,
			az: 0,
			aA: 0,
			Z: 0,
			am: numericValue,
			a3: 0,
			a5: unitLabel,
			bz: units,
			fl: _Utils_ap(
				$elm$core$String$fromFloat(numericValue),
				unitLabel)
		};
	});
var $rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty = A3($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, '', 0);
var $rtfeldman$elm_css$Css$alignItems = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'alignItems',
		'align-items',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$VirtualDom$Styled$Attribute = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
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
var $rtfeldman$elm_css$Css$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$prop3 = F4(
	function (key, argA, argB, argC) {
		return A2(
			$rtfeldman$elm_css$Css$property,
			key,
			A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.fl, argB.fl, argC.fl])));
	});
var $rtfeldman$elm_css$Css$borderLeft3 = $rtfeldman$elm_css$Css$prop3('border-left');
var $rtfeldman$elm_css$Css$borderRight3 = $rtfeldman$elm_css$Css$prop3('border-right');
var $rtfeldman$elm_css$Css$prop1 = F2(
	function (key, arg) {
		return A2($rtfeldman$elm_css$Css$property, key, arg.fl);
	});
var $rtfeldman$elm_css$Css$boxSizing = $rtfeldman$elm_css$Css$prop1('box-sizing');
var $Orange_OpenSource$elm_advanced_grid$Grid$cellId = F2(
	function (columnProperties, item) {
		return _Utils_ap(
			columnProperties.n,
			$elm$core$String$fromInt(item.dU));
	});
var $rtfeldman$elm_css$Css$center = $rtfeldman$elm_css$Css$prop1('center');
var $rtfeldman$elm_css$Css$contentBox = {cj: 0, bH: 0, fl: 'content-box'};
var $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence = function (a) {
	return {$: 1, a: a};
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
			case 0:
				var _v2 = declaration.a;
				var properties = _v2.c;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 1:
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
			case 2:
				var otherDeclarations = declaration.b;
				return $elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 3:
				return _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 4:
				var properties = declaration.b;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 5:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 6:
				var record = declaration.a;
				return $elm$core$String$isEmpty(record.ef) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					A3($elm$core$Dict$insert, record.bl, record.ef, keyframesByName),
					declarations);
			case 7:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 8:
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
	return {$: 6, a: a};
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
						{ef: decl, bl: name});
				},
				$elm$core$Dict$toList(keyframesByName)),
			compactedDeclarations);
	});
var $rtfeldman$elm_css$Css$Structure$compactStylesheet = function (_v0) {
	var charset = _v0.cR;
	var imports = _v0.c8;
	var namespaces = _v0.dl;
	var declarations = _v0.eg;
	var _v1 = A3(
		$elm$core$List$foldr,
		$rtfeldman$elm_css$Css$Structure$compactHelp,
		_Utils_Tuple2($elm$core$Dict$empty, _List_Nil),
		declarations);
	var keyframesByName = _v1.a;
	var compactedDeclarations = _v1.b;
	var finalDeclarations = A2($rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
	return {cR: charset, eg: finalDeclarations, c8: imports, dl: namespaces};
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
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
	return '(' + (expression.c$ + (A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$append(': '),
			expression.fl)) + ')'));
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString = function (mediaType) {
	switch (mediaType) {
		case 0:
			return 'print';
		case 1:
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
		case 0:
			var expressions = mediaQuery.a;
			return A2(
				$elm$core$String$join,
				' and ',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions));
		case 1:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'only', mediaType, expressions);
		case 2:
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
	var str = _v0;
	return '::' + str;
};
var $rtfeldman$elm_css$Css$Structure$Output$combinatorToString = function (combinator) {
	switch (combinator) {
		case 0:
			return '+';
		case 1:
			return '~';
		case 2:
			return '>';
		default:
			return '';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString = function (repeatableSimpleSelector) {
	switch (repeatableSimpleSelector.$) {
		case 0:
			var str = repeatableSimpleSelector.a;
			return '.' + str;
		case 1:
			var str = repeatableSimpleSelector.a;
			return '#' + str;
		case 2:
			var str = repeatableSimpleSelector.a;
			return ':' + str;
		default:
			var str = repeatableSimpleSelector.a;
			return '[' + (str + ']');
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString = function (simpleSelectorSequence) {
	switch (simpleSelectorSequence.$) {
		case 0:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
		case 1:
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
		case 0:
			var styleBlock = decl.a;
			return A2($rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock, $rtfeldman$elm_css$Css$Structure$Output$noIndent, styleBlock);
		case 1:
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
		case 2:
			return 'TODO';
		case 3:
			return 'TODO';
		case 4:
			return 'TODO';
		case 5:
			return 'TODO';
		case 6:
			var name = decl.a.bl;
			var declaration = decl.a.ef;
			return '@keyframes ' + (name + (' {\n' + (declaration + '\n}')));
		case 7:
			return 'TODO';
		case 8:
			return 'TODO';
		default:
			return 'TODO';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrint = function (_v0) {
	var charset = _v0.cR;
	var imports = _v0.c8;
	var namespaces = _v0.dl;
	var declarations = _v0.eg;
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
	return {$: 8, a: a};
};
var $rtfeldman$elm_css$Css$Structure$FontFace = function (a) {
	return {$: 5, a: a};
};
var $rtfeldman$elm_css$Css$Structure$PageRule = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Selector = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$Css$Structure$SupportsRule = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Viewport = function (a) {
	return {$: 7, a: a};
};
var $rtfeldman$elm_css$Css$Structure$MediaRule = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
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
					case 0:
						var styleBlock = declarations.a.a;
						return _List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
								A2($rtfeldman$elm_css$Css$Structure$withPropertyAppended, property, styleBlock))
							]);
					case 1:
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
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$TypeSelectorSequence = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatable = F2(
	function (selector, sequence) {
		switch (sequence.$) {
			case 0:
				var typeSelector = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
					typeSelector,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			case 1:
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
			if (!declarations.a.$) {
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
		return {$: 3, a: a, b: b, c: c, d: d, e: e};
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
						case 0:
							var styleBlock = declarations.a.a;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration,
								update(styleBlock));
						case 1:
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
									if ((_v5.b && (_v5.a.$ === 1)) && (!_v5.b.b)) {
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
						case 2:
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
						case 3:
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
						case 4:
							var _v9 = declarations.a;
							return declarations;
						case 5:
							return declarations;
						case 6:
							return declarations;
						case 7:
							return declarations;
						case 8:
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
		return {aP: charsProcessed, aX: hash, aE: seed, a0: shift};
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
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Bitwise$or = _Bitwise_or;
var $Skinney$murmur3$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $Skinney$murmur3$Murmur3$finalize = function (data) {
	var acc = (!(!data.aX)) ? (data.aE ^ A2(
		$Skinney$murmur3$Murmur3$multiplyBy,
		$Skinney$murmur3$Murmur3$c2,
		A2(
			$Skinney$murmur3$Murmur3$rotlBy,
			15,
			A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, data.aX)))) : data.aE;
	var h0 = acc ^ data.aP;
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
		var res = data.aX | ((255 & $elm$core$Char$toCode(c)) << data.a0);
		var _v0 = data.a0;
		if (_v0 === 24) {
			return {
				aP: data.aP + 1,
				aX: 0,
				aE: A2($Skinney$murmur3$Murmur3$mix, data.aE, res),
				a0: 0
			};
		} else {
			return {aP: data.aP + 1, aX: res, aE: data.aE, a0: data.a0 + 8};
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
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
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
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $rtfeldman$elm_css$Hash$fromString = function (str) {
	return A2(
		$elm$core$String$cons,
		'_',
		$rtfeldman$elm_hex$Hex$toString(
			A2($Skinney$murmur3$Murmur3$hashString, $rtfeldman$elm_css$Hash$murmurSeed, str)));
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
			if (maybe.$ === 1) {
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
	return {$: 9, a: a};
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
		if (!declaration.$) {
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
		if (!declaration.$) {
			var structureStyleBlock = declaration.a;
			return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
		} else {
			return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule = F2(
	function (mediaQueries, declaration) {
		switch (declaration.$) {
			case 0:
				var structureStyleBlock = declaration.a;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					mediaQueries,
					_List_fromArray(
						[structureStyleBlock]));
			case 1:
				var newMediaQueries = declaration.a;
				var structureStyleBlocks = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					_Utils_ap(mediaQueries, newMediaQueries),
					structureStyleBlocks);
			case 2:
				var str = declaration.a;
				var declarations = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$SupportsRule,
					str,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
						declarations));
			case 3:
				var str1 = declaration.a;
				var str2 = declaration.b;
				var str3 = declaration.c;
				var str4 = declaration.d;
				var structureStyleBlock = declaration.e;
				return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
			case 4:
				return declaration;
			case 5:
				return declaration;
			case 6:
				return declaration;
			case 7:
				return declaration;
			case 8:
				return declaration;
			default:
				return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet = function (_v0) {
	var declarations = _v0;
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
			if ((!_v14.a.$) && (!_v14.b.$)) {
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
				case 0:
					var property = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, declarations));
				case 1:
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
				case 2:
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
							case 0:
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
							case 1:
								var mediaQueries = declaration.a;
								var styleBlocks = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
							case 2:
								var str = declaration.a;
								var otherSnippets = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
							case 3:
								var str1 = declaration.a;
								var str2 = declaration.b;
								var str3 = declaration.c;
								var str4 = declaration.d;
								var styleBlock = declaration.e;
								return A2(
									$elm$core$List$map,
									A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
									$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
							case 4:
								var str = declaration.a;
								var properties = declaration.b;
								return _List_fromArray(
									[
										A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
									]);
							case 5:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$FontFace(properties)
									]);
							case 6:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$Viewport(properties)
									]);
							case 7:
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
				case 3:
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
				case 5:
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
								{ef: str, bl: name})
							]));
				case 4:
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
		case 0:
			var styleBlock = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
		case 1:
			var mediaQueries = snippetDeclaration.a;
			var styleBlocks = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
		case 2:
			var str = snippetDeclaration.a;
			var snippets = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
		case 3:
			var str1 = snippetDeclaration.a;
			var str2 = snippetDeclaration.b;
			var str3 = snippetDeclaration.c;
			var str4 = snippetDeclaration.d;
			var styleBlock = snippetDeclaration.e;
			return A2(
				$elm$core$List$map,
				A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		case 4:
			var str = snippetDeclaration.a;
			var properties = snippetDeclaration.b;
			return _List_fromArray(
				[
					A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
				]);
		case 5:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$FontFace(properties)
				]);
		case 6:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Viewport(properties)
				]);
		case 7:
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
	var charset = _v0.cR;
	var imports = _v0.c8;
	var namespaces = _v0.dl;
	var snippets = _v0.dK;
	var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
		A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
	return {cR: charset, eg: declarations, c8: imports, dl: namespaces};
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
var $rtfeldman$elm_css$Css$Preprocess$Snippet = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$Preprocess$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$makeSnippet = F2(
	function (styles, sequence) {
		var selector = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return _List_fromArray(
			[
				$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
			]);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$murmurSeed = 15739;
var $rtfeldman$elm_css$Css$Preprocess$stylesheet = function (snippets) {
	return {cR: $elm$core$Maybe$Nothing, c8: _List_Nil, dl: _List_Nil, dK: snippets};
};
var $rtfeldman$elm_css$VirtualDom$Styled$getClassname = function (styles) {
	return $elm$core$List$isEmpty(styles) ? 'unstyled' : A2(
		$elm$core$String$cons,
		'_',
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
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $rtfeldman$elm_css$Html$Styled$Internal$css = function (styles) {
	var classname = $rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
	var classProperty = A2(
		$elm$virtual_dom$VirtualDom$property,
		'className',
		$elm$json$Json$Encode$string(classname));
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, classProperty, styles, classname);
};
var $rtfeldman$elm_css$Html$Styled$Attributes$css = $rtfeldman$elm_css$Html$Styled$Internal$css;
var $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth = 6;
var $rtfeldman$elm_css$Css$Structure$Descendant = 3;
var $rtfeldman$elm_css$Css$Preprocess$NestSnippet = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Global$descendants = $rtfeldman$elm_css$Css$Preprocess$NestSnippet(3);
var $rtfeldman$elm_css$Css$Preprocess$ExtendSelector = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$PseudoClassSelector = function (a) {
	return {$: 2, a: a};
};
var $rtfeldman$elm_css$Css$pseudoClass = function (_class) {
	return $rtfeldman$elm_css$Css$Preprocess$ExtendSelector(
		$rtfeldman$elm_css$Css$Structure$PseudoClassSelector(_class));
};
var $rtfeldman$elm_css$Css$hover = $rtfeldman$elm_css$Css$pseudoClass('hover');
var $rtfeldman$elm_css$Css$Structure$TypeSelector = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$Global$typeSelector = F2(
	function (selectorStr, styles) {
		var sequence = A2($rtfeldman$elm_css$Css$Structure$TypeSelectorSequence, selectorStr, _List_Nil);
		var sel = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return _List_fromArray(
			[
				$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, sel, _List_Nil, styles))
			]);
	});
var $rtfeldman$elm_css$Css$visibility = $rtfeldman$elm_css$Css$prop1('visibility');
var $rtfeldman$elm_css$Css$visible = {a$: 0, T: 0, fl: 'visible', bF: 0};
var $Orange_OpenSource$elm_advanced_grid$Grid$descendantsVisibleOnHover = $rtfeldman$elm_css$Css$hover(
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
var $rtfeldman$elm_css$Css$firstOfType = $rtfeldman$elm_css$Css$pseudoClass('first-of-type');
var $rtfeldman$elm_css$Css$flexEnd = $rtfeldman$elm_css$Css$prop1('flex-end');
var $rtfeldman$elm_css$Css$hidden = {I: 0, a$: 0, fl: 'hidden', bF: 0};
var $rtfeldman$elm_css$VirtualDom$Styled$property = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$property, key, value),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$id = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('id');
var $rtfeldman$elm_css$Css$inlineFlex = {o: 0, fl: 'inline-flex'};
var $rtfeldman$elm_css$Css$justifyContent = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'justifyContent',
		'justify-content',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$withPrecedingHash = function (str) {
	return A2($elm$core$String$startsWith, '#', str) ? str : A2($elm$core$String$cons, '#', str);
};
var $rtfeldman$elm_css$Css$erroneousHex = function (str) {
	return {
		aM: 1,
		ck: 0,
		V: 0,
		cp: 0,
		cx: 0,
		fl: $rtfeldman$elm_css$Css$withPrecedingHash(str)
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
				switch (_char) {
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
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
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
		if ((((!results.a.a.$) && (!results.a.b.$)) && (!results.b.a.$)) && (!results.b.b.$)) {
			var _v5 = results.a;
			var red = _v5.a.a;
			var green = _v5.b.a;
			var _v6 = results.b;
			var blue = _v6.a.a;
			var alpha = _v6.b.a;
			return {
				aM: alpha / 255,
				ck: blue,
				V: 0,
				cp: green,
				cx: red,
				fl: $rtfeldman$elm_css$Css$withPrecedingHash(str)
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
					_Utils_Tuple2('f', 'f'));
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
								_Utils_Tuple2('f', 'f'));
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
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey = $rtfeldman$elm_css$Css$hex('CCC');
var $rtfeldman$elm_css$Css$minHeight = $rtfeldman$elm_css$Css$prop1('min-height');
var $rtfeldman$elm_css$Css$flexShrink = $rtfeldman$elm_css$Css$prop1('flex-shrink');
var $rtfeldman$elm_css$Css$UnitlessFloat = 0;
var $rtfeldman$elm_css$Css$num = function (val) {
	return {
		aA: 0,
		Z: 0,
		bm: 0,
		b3: 0,
		am: val,
		a5: '',
		bz: 0,
		fl: $elm$core$String$fromFloat(val)
	};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$noShrink = $rtfeldman$elm_css$Css$flexShrink(
	$rtfeldman$elm_css$Css$num(0));
var $rtfeldman$elm_css$Css$noWrap = {bg: 0, bW: 0, fl: 'nowrap', at: 0};
var $rtfeldman$elm_css$Css$overflow = $rtfeldman$elm_css$Css$prop1('overflow');
var $rtfeldman$elm_css$Css$paddingLeft = $rtfeldman$elm_css$Css$prop1('padding-left');
var $rtfeldman$elm_css$Css$paddingRight = $rtfeldman$elm_css$Css$prop1('padding-right');
var $rtfeldman$elm_css$Css$PercentageUnits = 0;
var $rtfeldman$elm_css$Css$pct = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, '%');
var $rtfeldman$elm_css$Css$PxUnits = 0;
var $rtfeldman$elm_css$Css$px = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, 'px');
var $rtfeldman$elm_css$Css$solid = {I: 0, aG: 0, fl: 'solid'};
var $rtfeldman$elm_css$Css$spaceBetween = $rtfeldman$elm_css$Css$prop1('space-between');
var $rtfeldman$elm_css$Css$whiteSpace = $rtfeldman$elm_css$Css$prop1('white-space');
var $rtfeldman$elm_css$Css$width = $rtfeldman$elm_css$Css$prop1('width');
var $Orange_OpenSource$elm_advanced_grid$Grid$cellAttributes = F2(
	function (properties, item) {
		return _List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$id(
				A2($Orange_OpenSource$elm_advanced_grid$Grid$cellId, properties, item)),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', properties.n),
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
						$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineFlex),
						$Orange_OpenSource$elm_advanced_grid$Grid$noShrink,
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
						$Orange_OpenSource$elm_advanced_grid$Grid$descendantsVisibleOnHover,
						$rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$hidden),
						$rtfeldman$elm_css$Css$whiteSpace($rtfeldman$elm_css$Css$noWrap),
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$px(properties.A - $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth))
					]))
			]);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$Node = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$Node;
var $rtfeldman$elm_css$Html$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$node;
var $rtfeldman$elm_css$Html$Styled$div = $rtfeldman$elm_css$Html$Styled$node('div');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
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
var $rtfeldman$elm_css$Html$Styled$Events$onDoubleClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'dblclick',
		$elm$json$Json$Decode$succeed(msg));
};
var $rtfeldman$elm_css$VirtualDom$Styled$Unstyled = function (a) {
	return {$: 4, a: a};
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $rtfeldman$elm_css$VirtualDom$Styled$text = function (str) {
	return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
		$elm$virtual_dom$VirtualDom$text(str));
};
var $rtfeldman$elm_css$Html$Styled$text = $rtfeldman$elm_css$VirtualDom$Styled$text;
var $Orange_OpenSource$elm_advanced_grid$Grid$viewString = F3(
	function (field, properties, item) {
		var conditionalAttributes = properties.v ? _List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Events$onDoubleClick(
				A4(
					$Orange_OpenSource$elm_advanced_grid$Grid$UserDoubleClickedEditableCell,
					item,
					field,
					properties.n,
					A2($Orange_OpenSource$elm_advanced_grid$Grid$cellId, properties, item)))
			]) : _List_Nil;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_Utils_ap(
				conditionalAttributes,
				A2($Orange_OpenSource$elm_advanced_grid$Grid$cellAttributes, properties, item)),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(
					field(item))
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$stringColumnConfig = F2(
	function (properties, labels) {
		var id = properties.n;
		var isEditable = properties.v;
		var title = properties.y;
		var tooltip = properties.z;
		var width = properties.A;
		var getter = properties.u;
		var setter = properties.x;
		var localize = properties.w;
		var nestedDataGetter = A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.be;
			},
			getter);
		return {
			O: $Orange_OpenSource$elm_advanced_grid$Grid$compareFields(nestedDataGetter),
			E: $elm$core$Maybe$Nothing,
			av: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$StringFilter(
				A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$stringFilter, getter, labels)),
			ay: setter,
			aj: true,
			b: $Orange_OpenSource$elm_advanced_grid$Grid$columnConfigProperties(properties),
			aD: $Orange_OpenSource$elm_advanced_grid$Grid$viewString(nestedDataGetter),
			aI: nestedDataGetter
		};
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$cityColumn = $Orange_OpenSource$elm_advanced_grid$Grid$stringColumnConfig(
	{
		u: function ($) {
			return $.bI;
		},
		n: 'City',
		v: false,
		w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		x: F2(
			function (item, _v0) {
				return item;
			}),
		y: 'Ville',
		z: 'Une indication pour la colonne Ville',
		A: 300
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$IntFilter = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$ExpectingInt = {$: 1};
var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var $elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {cT: s.cT + (newOffset - s.bn), f: s.f, i: s.i, bn: newOffset, dD: s.dD, a: s.a};
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
		if (handler.$ === 1) {
			var x = handler.a;
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.bn, startOffset) < 0,
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
		var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.a);
		if (floatOffset < 0) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A4($elm$parser$Parser$Advanced$fromInfo, s.dD, s.cT - (floatOffset + s.bn), invalid, s.f));
		} else {
			if (_Utils_eq(s.bn, floatOffset)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.bn, intPair, s);
				} else {
					if (floatSettings.$ === 1) {
						var x = floatSettings.a;
						return A2(
							$elm$parser$Parser$Advanced$Bad,
							true,
							A2($elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _v1 = $elm$core$String$toFloat(
							A3($elm$core$String$slice, s.bn, floatOffset, s.a));
						if (_v1.$ === 1) {
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
	return function (s) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.bn, s.a)) {
			var zeroOffset = s.bn + 1;
			var baseOffset = zeroOffset + 1;
			return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.a) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.ez,
				c.et,
				baseOffset,
				A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.a),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.a) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.ez,
				c.dn,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.a),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.a) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.ez,
				c.cK,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.a),
				s) : A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.ez,
				c.c_,
				c.dc,
				c.c0,
				_Utils_Tuple2(zeroOffset, 0),
				s)));
		} else {
			return A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.ez,
				c.c_,
				c.dc,
				c.c0,
				A3($elm$parser$Parser$Advanced$consumeBase, 10, s.bn, s.a),
				s);
		}
	};
};
var $elm$parser$Parser$Advanced$int = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				cK: $elm$core$Result$Err(invalid),
				c_: expecting,
				c0: $elm$core$Result$Err(invalid),
				et: $elm$core$Result$Err(invalid),
				dc: $elm$core$Result$Ok($elm$core$Basics$identity),
				ez: invalid,
				dn: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$int = A2($elm$parser$Parser$Advanced$int, $elm$parser$Parser$ExpectingInt, $elm$parser$Parser$ExpectingInt);
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$intFilter = function (getter) {
	return $Orange_OpenSource$elm_advanced_grid$Grid$Filters$makeFilter(
		{
			W: F2(
				function (a, b) {
					return A2(
						$elm$core$String$contains,
						$elm$core$String$fromInt(b),
						$elm$core$String$fromInt(a));
				}),
			X: $elm$core$Basics$eq,
			u: getter,
			Y: F2(
				function (a, b) {
					return _Utils_cmp(a, b) > 0;
				}),
			_: F2(
				function (a, b) {
					return _Utils_cmp(a, b) < 0;
				}),
			bw: $elm$parser$Parser$int
		});
};
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
var $Orange_OpenSource$elm_advanced_grid$Grid$intColumnConfig = function (properties) {
	var id = properties.n;
	var title = properties.y;
	var isEditable = properties.v;
	var tooltip = properties.z;
	var width = properties.A;
	var getter = properties.u;
	var setter = properties.x;
	var localize = properties.w;
	var nestedDataGetter = A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.be;
		},
		getter);
	return {
		O: $Orange_OpenSource$elm_advanced_grid$Grid$compareFields(nestedDataGetter),
		E: $elm$core$Maybe$Nothing,
		av: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$IntFilter(
			$Orange_OpenSource$elm_advanced_grid$Grid$Filters$intFilter(getter)),
		ay: F2(
			function (item, value) {
				return A2(
					setter,
					item,
					A2(
						$elm$core$Maybe$withDefault,
						0,
						$elm$core$String$toInt(value)));
			}),
		aj: true,
		b: $Orange_OpenSource$elm_advanced_grid$Grid$columnConfigProperties(properties),
		aD: $Orange_OpenSource$elm_advanced_grid$Grid$viewInt(nestedDataGetter),
		aI: A2($elm$core$Basics$composeR, nestedDataGetter, $elm$core$String$fromInt)
	};
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$idColumn = $Orange_OpenSource$elm_advanced_grid$Grid$intColumnConfig(
	{
		u: function ($) {
			return $.n;
		},
		n: 'Id',
		v: false,
		w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		x: F2(
			function (item, _v0) {
				return item;
			}),
		y: 'Id',
		z: 'Une indication pour la colonne Id',
		A: 50
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$setName = F2(
	function (item, name) {
		var oldData = item.be;
		var newData = _Utils_update(
			oldData,
			{bl: name});
		return _Utils_update(
			item,
			{be: newData});
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$nameColumn = $Orange_OpenSource$elm_advanced_grid$Grid$stringColumnConfig(
	{
		u: function ($) {
			return $.bl;
		},
		n: 'Name',
		v: true,
		w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		x: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$setName,
		y: 'Nom',
		z: 'Une indication pour la colonne Nom',
		A: 100
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$FloatFilter = function (a) {
	return {$: 2, a: a};
};
var $elm$parser$Parser$ExpectingFloat = {$: 5};
var $elm$parser$Parser$Advanced$float = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				cK: $elm$core$Result$Err(invalid),
				c_: expecting,
				c0: $elm$core$Result$Ok($elm$core$Basics$identity),
				et: $elm$core$Result$Err(invalid),
				dc: $elm$core$Result$Ok($elm$core$Basics$toFloat),
				ez: invalid,
				dn: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$float = A2($elm$parser$Parser$Advanced$float, $elm$parser$Parser$ExpectingFloat, $elm$parser$Parser$ExpectingFloat);
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$floatFilter = function (getter) {
	return $Orange_OpenSource$elm_advanced_grid$Grid$Filters$makeFilter(
		{
			W: F2(
				function (a, b) {
					return A2(
						$elm$core$String$contains,
						$elm$core$String$fromFloat(b),
						$elm$core$String$fromFloat(a));
				}),
			X: $elm$core$Basics$eq,
			u: getter,
			Y: F2(
				function (a, b) {
					return _Utils_cmp(a, b) > 0;
				}),
			_: F2(
				function (a, b) {
					return _Utils_cmp(a, b) < 0;
				}),
			bw: $elm$parser$Parser$float
		});
};
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
var $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig = function (properties) {
	var id = properties.n;
	var isEditable = properties.v;
	var title = properties.y;
	var tooltip = properties.z;
	var width = properties.A;
	var getter = properties.u;
	var setter = properties.x;
	var localize = properties.w;
	var nestedDataGetter = A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.be;
		},
		getter);
	return {
		O: $Orange_OpenSource$elm_advanced_grid$Grid$compareFields(nestedDataGetter),
		E: $elm$core$Maybe$Nothing,
		av: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$FloatFilter(
			$Orange_OpenSource$elm_advanced_grid$Grid$Filters$floatFilter(getter)),
		ay: F2(
			function (item, value) {
				return A2(
					setter,
					item,
					A2(
						$elm$core$Maybe$withDefault,
						0,
						$elm$core$String$toFloat(value)));
			}),
		aj: true,
		b: $Orange_OpenSource$elm_advanced_grid$Grid$columnConfigProperties(properties),
		aD: $Orange_OpenSource$elm_advanced_grid$Grid$viewFloat(nestedDataGetter),
		aI: A2($elm$core$Basics$composeR, nestedDataGetter, $elm$core$String$fromFloat)
	};
};
var $rtfeldman$elm_css$Css$backgroundColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'background-color', c.fl);
};
var $rtfeldman$elm_css$Css$border3 = $rtfeldman$elm_css$Css$prop3('border');
var $rtfeldman$elm_css$Css$borderRadius = $rtfeldman$elm_css$Css$prop1('border-radius');
var $rtfeldman$elm_css$Css$displayFlex = A2($rtfeldman$elm_css$Css$property, 'display', 'flex');
var $rtfeldman$elm_css$Css$height = $rtfeldman$elm_css$Css$prop1('height');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGreen = $rtfeldman$elm_css$Css$hex('4d4');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$white = $rtfeldman$elm_css$Css$hex('FFF');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar = F4(
	function (barHeight, getter, properties, item) {
		var nestedDataGetter = A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.be;
			},
			getter);
		var maxWidth = (properties.A - 8) - $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth;
		var actualWidth = (nestedDataGetter(item) / 100) * maxWidth;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
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
						]))
				]),
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
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
									$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey),
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
									$rtfeldman$elm_css$Html$Styled$Attributes$css(
									_List_fromArray(
										[
											$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGreen),
											$rtfeldman$elm_css$Css$width(
											$rtfeldman$elm_css$Css$px(actualWidth)),
											$rtfeldman$elm_css$Css$height(
											$rtfeldman$elm_css$Css$px(barHeight)),
											$rtfeldman$elm_css$Css$borderRadius(
											$rtfeldman$elm_css$Css$px(5)),
											$rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$visible)
										]))
								]),
							_List_Nil)
						]))
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$progressColumn = function () {
	var progressColumnConfig = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
		{
			u: function ($) {
				return $.aJ;
			},
			n: 'Progress',
			v: false,
			w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			x: F2(
				function (item, _v0) {
					return item;
				}),
			y: 'Progrès',
			z: 'Une indication pour la colonne Progrès',
			A: 100
		});
	return _Utils_update(
		progressColumnConfig,
		{
			aD: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.aJ;
				})
		});
}();
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
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value1Column = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
	{
		u: A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.aJ;
			},
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
		n: 'Value1',
		v: false,
		w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		x: F2(
			function (item, _v0) {
				return item;
			}),
		y: 'Valeur 1',
		z: 'Une indication pour la colonne Valeur 1',
		A: 100
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value1ProgressColumn = function () {
	var columnConfig = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
		{
			u: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.aJ;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			n: 'ProgressValue1',
			v: false,
			w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			x: F2(
				function (item, _v0) {
					return item;
				}),
			y: 'Valeur 1',
			z: 'Une indication pour la colonne Valeur 1',
			A: 100
		});
	return _Utils_update(
		columnConfig,
		{
			aD: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.aJ;
				})
		});
}();
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value2Column = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
	{
		u: A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.bA;
			},
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
		n: 'Value2',
		v: false,
		w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		x: F2(
			function (item, _v0) {
				return item;
			}),
		y: 'Valeur 2',
		z: 'Une indication pour la colonne Valeur 2',
		A: 100
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value2ProgressColumn = function () {
	var columnConfig = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
		{
			u: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.bA;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			n: 'ProgressValue2',
			v: false,
			w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			x: F2(
				function (item, _v0) {
					return item;
				}),
			y: 'Valeur 2',
			z: 'Une indication pour la colonne Valeur 2',
			A: 100
		});
	return _Utils_update(
		columnConfig,
		{
			aD: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.bA;
				})
		});
}();
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value3Column = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
	{
		u: A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.bB;
			},
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
		n: 'Value3',
		v: false,
		w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		x: F2(
			function (item, _v0) {
				return item;
			}),
		y: 'Valeur 3',
		z: 'Une indication pour la colonne Valeur 3',
		A: 100
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value3ProgressColumn = function () {
	var columnConfig = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
		{
			u: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.bB;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			n: 'ProgressValue3',
			v: false,
			w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			x: F2(
				function (item, _v0) {
					return item;
				}),
			y: 'Valeur 3',
			z: 'Une indication pour la colonne Valeur 3',
			A: 100
		});
	return _Utils_update(
		columnConfig,
		{
			aD: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.bB;
				})
		});
}();
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value4Column = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
	{
		u: A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.bC;
			},
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
		n: 'Value4',
		v: false,
		w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		x: F2(
			function (item, _v0) {
				return item;
			}),
		y: 'Valeur 4',
		z: 'Une indication pour la colonne Valeur 4',
		A: 100
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value4ProgressColumn = function () {
	var columnConfig = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
		{
			u: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.bC;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			n: 'ProgressValue4',
			v: false,
			w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			x: F2(
				function (item, _v0) {
					return item;
				}),
			y: 'Valeur 4',
			z: 'Une indication pour la colonne Valeur 4',
			A: 100
		});
	return _Utils_update(
		columnConfig,
		{
			aD: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.bC;
				})
		});
}();
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value5Column = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
	{
		u: A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.bD;
			},
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
		n: 'Value5',
		v: false,
		w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		x: F2(
			function (item, _v0) {
				return item;
			}),
		y: 'Valeur 5',
		z: 'Une indication pour la colonne Valeur 5',
		A: 100
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value5ProgressColumn = function () {
	var columnConfig = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
		{
			u: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.bD;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			n: 'ProgressValue5',
			v: false,
			w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			x: F2(
				function (item, _v0) {
					return item;
				}),
			y: 'Valeur 5',
			z: 'Une indication pour la colonne Valeur 5',
			A: 100
		});
	return _Utils_update(
		columnConfig,
		{
			aD: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.bD;
				})
		});
}();
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value6Column = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
	{
		u: A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.bE;
			},
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
		n: 'Value6',
		v: false,
		w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
		x: F2(
			function (item, _v0) {
				return item;
			}),
		y: 'Valeur 6',
		z: 'Une indication pour la colonne Valeur 6',
		A: 100
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value6ProgressColumn = function () {
	var columnConfig = $Orange_OpenSource$elm_advanced_grid$Grid$floatColumnConfig(
		{
			u: A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.bE;
				},
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$truncateDecimals),
			n: 'ProgressValue6',
			v: false,
			w: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$localize,
			x: F2(
				function (item, _v0) {
					return item;
				}),
			y: 'Valeur 6',
			z: 'Une indication pour la colonne Valeur 6',
			A: 100
		});
	return _Utils_update(
		columnConfig,
		{
			aD: A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$viewProgressBar,
				8,
				function ($) {
					return $.bE;
				})
		});
}();
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$columns = function (labels) {
	return _List_fromArray(
		[
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$idColumn,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$nameColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$progressColumn,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$cityColumn(labels),
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value1Column,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value1ProgressColumn,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value2Column,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value2ProgressColumn,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value3Column,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value3ProgressColumn,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value4Column,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value4ProgressColumn,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value5Column,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value5ProgressColumn,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value6ProgressColumn,
			$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$value6Column
		]);
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$rowClass = function (item) {
	var even = _Utils_eq(item.dU / 2, (item.dU / 2) | 0);
	return item.fb ? 'selected-row' : (even ? 'even-row' : '');
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$gridConfig = {
	d2: true,
	d6: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$columns($elm$core$Dict$empty),
	d9: 500,
	ea: 950,
	er: true,
	es: 60,
	eH: $elm$core$Dict$empty,
	eI: 25,
	e7: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$rowClass
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Model = $elm$core$Basics$identity;
var $elm_community$list_extra$List$Extra$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				if (accAcc.b) {
					var acc = accAcc.a;
					return A2(
						$elm$core$List$cons,
						A2(f, x, acc),
						accAcc);
				} else {
					return _List_Nil;
				}
			});
		return $elm$core$List$reverse(
			A3(
				$elm$core$List$foldl,
				scan1,
				_List_fromArray(
					[b]),
				xs));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$visibleColumns = function (_v0) {
	var state = _v0;
	return A2(
		$elm$core$List$filter,
		function (column) {
			return column.b.aK;
		},
		state.g.d6);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$columnsX = function (model) {
	return A3(
		$elm_community$list_extra$List$Extra$scanl,
		F2(
			function (col, x) {
				return x + col.b.A;
			}),
		0,
		$Orange_OpenSource$elm_advanced_grid$Grid$visibleColumns(model));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Item$create = F2(
	function (data, contentIndex) {
		return {eb: contentIndex, be: data, fb: false, dU: contentIndex};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$init = {fl: '', B: 0, a7: 0};
var $FabienHenon$elm_infinite_list_view$InfiniteList$Model = $elm$core$Basics$identity;
var $FabienHenon$elm_infinite_list_view$InfiniteList$init = 0;
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$NoFilter = {$: 4};
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
				return 1;
			} else {
				return 2;
			}
		} else {
			if (!_v0.b) {
				return 1;
			} else {
				return 0;
			}
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$stringToBool = function (string) {
	return $elm$core$String$toLower(string) === 'true';
};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserToggledSelection = function (a) {
	return {$: 29, a: a};
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
var $Orange_OpenSource$elm_advanced_grid$Grid$alwaysPreventDefault = function (msg) {
	return _Utils_Tuple2(msg, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$stopPropagationOnClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
		'click',
		A2(
			$elm$json$Json$Decode$map,
			$Orange_OpenSource$elm_advanced_grid$Grid$alwaysPreventDefault,
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
							$Orange_OpenSource$elm_advanced_grid$Grid$stopPropagationOnClick(
							$Orange_OpenSource$elm_advanced_grid$Grid$UserToggledSelection(item))
						]),
					_List_Nil)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$selectionColumn = function () {
	var properties = {
		u: function ($) {
			return $.fb;
		},
		n: '_MultipleSelection_',
		v: false,
		w: function (_v0) {
			return '';
		},
		y: '',
		z: '',
		A: 40
	};
	return {
		O: $Orange_OpenSource$elm_advanced_grid$Grid$compareBoolField(
			function ($) {
				return $.fb;
			}),
		E: $elm$core$Maybe$Nothing,
		av: $Orange_OpenSource$elm_advanced_grid$Grid$Filters$NoFilter,
		ay: F2(
			function (item, value) {
				return _Utils_update(
					item,
					{
						fb: $Orange_OpenSource$elm_advanced_grid$Grid$stringToBool(value)
					});
			}),
		aj: false,
		b: $Orange_OpenSource$elm_advanced_grid$Grid$columnConfigProperties(properties),
		aD: $Orange_OpenSource$elm_advanced_grid$Grid$viewBool(
			function ($) {
				return $.fb;
			}),
		aI: A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.fb;
			},
			$Orange_OpenSource$elm_advanced_grid$Grid$boolToString)
	};
}();
var $Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumnProperties = function (columnProperties) {
	return _Utils_eq(columnProperties.n, $Orange_OpenSource$elm_advanced_grid$Grid$selectionColumn.b.n);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumn = function (columnConfig) {
	return $Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumnProperties(columnConfig.b);
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
					return $.aK;
				}),
			function ($) {
				return $.b;
			}),
		function (c) {
			return _Utils_update(
				c,
				{E: $elm$core$Maybe$Nothing});
		},
		columns);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$init = F2(
	function (config, data) {
		var indexedItems = A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, value) {
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$Item$create, value, index);
				}),
			data);
		var hasSelectionColumn = function (columns) {
			var _v0 = $elm$core$List$head(columns);
			if (!_v0.$) {
				var firstColumn = _v0.a;
				return $Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumn(firstColumn);
			} else {
				return false;
			}
		};
		var shouldAddSelectionColumn = config.d2 && (!hasSelectionColumn(config.d6));
		var newConfig = shouldAddSelectionColumn ? _Utils_update(
			config,
			{
				d6: A2($elm$core$List$cons, $Orange_OpenSource$elm_advanced_grid$Grid$selectionColumn, config.d6)
			}) : config;
		var sanitizedConfig = _Utils_update(
			newConfig,
			{
				d6: $Orange_OpenSource$elm_advanced_grid$Grid$sanitizedColumns(newConfig.d6)
			});
		var initialState = {
			bK: $elm$core$Maybe$Nothing,
			bc: _List_Nil,
			g: sanitizedConfig,
			au: data,
			aS: 0,
			Q: $elm$core$Maybe$Nothing,
			bO: '',
			bP: $elm$core$Maybe$Nothing,
			bf: false,
			af: false,
			bX: {B: 0, a7: 0},
			c6: $elm$core$Maybe$Nothing,
			bY: $FabienHenon$elm_infinite_list_view$InfiniteList$init,
			b_: false,
			eH: config.eH,
			bo: $elm$core$Maybe$Nothing,
			ab: 0,
			ap: $elm$core$Maybe$Nothing,
			bs: false,
			aF: $elm$core$Maybe$Nothing,
			aq: $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$init,
			m: indexedItems
		};
		return _Utils_update(
			initialState,
			{
				bc: $Orange_OpenSource$elm_advanced_grid$Grid$columnsX(initialState)
			});
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$cities = _List_fromArray(
	['Paris', 'London', 'New York', 'Moscow', 'Roma', 'Berlin', 'Tokyo', 'Delhi', 'Shanghai', 'Sao Paulo', 'Mexico City', 'Cairo', 'Dhaka', 'Mumbai', 'Beijing', '', 'Osaka', 'Karachi', 'Chongqing', 'Buenos Aires', 'Istanbul', 'Kolkata', 'Lagos', 'Manila', 'Tianjin', 'Rio De Janeiro', 'Guangzhou', 'Moscow', 'Lahore', 'Shenzhen', 'Bangalore', 'Paris', 'Bogota', 'Chennai', 'Jakarta', 'Lima', 'Bangkok', 'Seoul', 'Hyderabad', 'London', 'Tehran', 'Chengdu', 'New York', 'Wuhan', 'Ahmedabad', 'Kuala Lumpur', 'Riyadh', 'Surat', 'Santiago', 'Madrid', 'Pune', 'Dar Es Salaam', 'Toronto', 'Johannesburg', 'Barcelona', 'St Petersburg', 'Yangon', 'Alexandria', 'Guadalajara', 'Ankara', 'Melbourne', 'Sydney', 'Brasilia', 'Nairobi', 'Cape Town', 'Rome', 'Montreal', 'Tel Aviv', 'Los Angeles', 'Medellin', 'Jaipur', 'Casablanca', 'Lucknow', 'Berlin', 'Busan', 'Athens', 'Milan', 'Kanpur', 'Abuja', 'Lisbon', 'Surabaya', 'Dubai', 'Cali', 'Manchester']);
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
			bI: A2(
				$elm$core$Maybe$withDefault,
				'None',
				A2(
					$elm_community$list_extra$List$Extra$getAt,
					A2(
						$elm$core$Basics$modBy,
						$elm$core$List$length($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$cities),
						i),
					$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$cities)),
			n: i,
			bl: 'name' + $elm$core$String$fromInt(i),
			aJ: (($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount - i) / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 100,
			bA: (i / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 50,
			bB: (($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount - i) / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 25,
			bC: (i / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 15,
			bD: (($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount - i) / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 10,
			bE: (i / $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount) * 5
		};
	},
	A2($elm$core$List$range, 0, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$itemCount - 1));
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$init = function (_v0) {
	return _Utils_Tuple2(
		{
			a9: false,
			bK: $elm$core$Maybe$Nothing,
			h: A2($Orange_OpenSource$elm_advanced_grid$Grid$init, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$gridConfig, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$items)
		},
		$elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $Orange_OpenSource$elm_advanced_grid$Grid$Ascending = 1;
var $Orange_OpenSource$elm_advanced_grid$Grid$Descending = 2;
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg = function (a) {
	return {$: 1, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$ScrollTo = function (a) {
	return {$: 9, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$SetFilters = function (a) {
	return {$: 7, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$SetSorting = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$ShowPreferences = {$: 10};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedLine = function (a) {
	return {$: 17, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedPreferenceCloseButton = {$: 19};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserToggledAllItemSelection = {$: 27};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $Orange_OpenSource$elm_advanced_grid$Grid$GotCellInfo = function (a) {
	return {$: 5, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$GotHeaderContainerInfo = function (a) {
	return {$: 6, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$NoOp = {$: 4};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$SetEditedValue = function (a) {
	return {$: 1, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$editorId = 'cell-editor';
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
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
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
					task)));
	});
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $Orange_OpenSource$elm_advanced_grid$Grid$focusOn = function (elementId) {
	return A2(
		$elm$core$Task$attempt,
		function (result) {
			return $Orange_OpenSource$elm_advanced_grid$Grid$NoOp;
		},
		$elm$browser$Browser$Dom$focus(elementId));
};
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $Orange_OpenSource$elm_advanced_grid$Grid$getElementInfo = F2(
	function (elementId, msg) {
		return A2(
			$elm$core$Task$attempt,
			function (result) {
				return msg(result);
			},
			$elm$browser$Browser$Dom$getElement(elementId));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$gridHtmlId = '_grid_';
var $Orange_OpenSource$elm_advanced_grid$Grid$headerContainerId = '_header_-_container_';
var $FabienHenon$elm_infinite_list_view$InfiniteList$Config = $elm$core$Basics$identity;
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
	return {bJ: $elm$core$Maybe$Nothing, d9: conf.d9, bd: $FabienHenon$elm_infinite_list_view$InfiniteList$defaultContainer, n: $elm$core$Maybe$Nothing, eB: conf.eB, eD: conf.eD, bn: 200, cg: _List_Nil};
};
var $rtfeldman$elm_css$Css$borderBottom3 = $rtfeldman$elm_css$Css$prop3('border-bottom');
var $rtfeldman$elm_css$Html$Styled$Attributes$class = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('className');
var $Orange_OpenSource$elm_advanced_grid$Grid$gridWidth = function (state) {
	return A3(
		$elm$core$List$foldl,
		function (columnConfig) {
			return $elm$core$Basics$add(columnConfig.b.A);
		},
		0,
		$Orange_OpenSource$elm_advanced_grid$Grid$visibleColumns(state));
};
var $rtfeldman$elm_css$Html$Styled$Events$onClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
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
			case 4:
				var vdom = html.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					styles);
			case 0:
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
			case 1:
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
			case 2:
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
			case 4:
				var vdomNode = html.a;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					styles);
			case 0:
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
			case 1:
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
			case 2:
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
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
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
	if (_v0.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var _v1 = _v0.a;
		var classname = _v1.a;
		var styles = _v1.b;
		return A2($elm$core$Dict$singleton, classname, styles);
	}
};
var $rtfeldman$elm_css$Css$Structure$ClassSelector = function (a) {
	return {$: 0, a: a};
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
		case 4:
			var plainNode = vdom.a;
			return plainNode;
		case 0:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyle, elemType, properties, children);
		case 1:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleNS, ns, elemType, properties, children);
		case 2:
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
		return A2(config.aD, config.b, item);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewRow = F4(
	function (state, idx, listIdx, item) {
		return A3(
			$elm$core$Basics$composeL,
			$rtfeldman$elm_css$Html$Styled$toUnstyled,
			$rtfeldman$elm_css$Html$Styled$div(
				_List_fromArray(
					[
						A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'row'),
						$rtfeldman$elm_css$Html$Styled$Attributes$class(
						state.g.e7(item)),
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$displayFlex,
								$rtfeldman$elm_css$Css$height(
								$rtfeldman$elm_css$Css$px(state.g.eI)),
								$rtfeldman$elm_css$Css$width(
								$rtfeldman$elm_css$Css$px(
									$Orange_OpenSource$elm_advanced_grid$Grid$gridWidth(state))),
								A3(
								$rtfeldman$elm_css$Css$borderBottom3,
								$rtfeldman$elm_css$Css$px(1),
								$rtfeldman$elm_css$Css$solid,
								$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey),
								A2($rtfeldman$elm_css$Css$property, 'direction', 'ltr')
							])),
						$rtfeldman$elm_css$Html$Styled$Events$onClick(
						state.bf ? $Orange_OpenSource$elm_advanced_grid$Grid$NoOp : $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedLine(item))
					])),
			A2(
				$elm$core$List$map,
				function (columnConfig) {
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$viewCell, columnConfig, item);
				},
				$Orange_OpenSource$elm_advanced_grid$Grid$visibleColumns(state)));
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$Constant = function (a) {
	return {$: 0, a: a};
};
var $FabienHenon$elm_infinite_list_view$InfiniteList$withConstantHeight = function (height) {
	return $FabienHenon$elm_infinite_list_view$InfiniteList$Constant(height);
};
var $FabienHenon$elm_infinite_list_view$InfiniteList$withOffset = F2(
	function (offset, _v0) {
		var value = _v0;
		return _Utils_update(
			value,
			{bn: offset});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$infiniteListConfig = function (state) {
	return A2(
		$FabienHenon$elm_infinite_list_view$InfiniteList$withOffset,
		300,
		$FabienHenon$elm_infinite_list_view$InfiniteList$config(
			{
				d9: state.g.d9,
				eB: $FabienHenon$elm_infinite_list_view$InfiniteList$withConstantHeight(state.g.eI),
				eD: $Orange_OpenSource$elm_advanced_grid$Grid$viewRow(state)
			}));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$openedQuickFilterHtmlId = 'openedQuickFilter';
var $FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizesForMultipleHeights = F4(
	function (_v0, getHeight, scrollTop, items) {
		var offset = _v0.bn;
		var containerHeight = _v0.d9;
		var updateComputations = F2(
			function (item, calculatedTuple) {
				var _v1 = calculatedTuple;
				var idx = _v1.bh;
				var elementsCountToSkip = _v1.bS;
				var elementsToShow = _v1.bT;
				var topMargin = _v1.ar;
				var currentHeight = _v1.aR;
				var height = A2(getHeight, idx, item);
				var newCurrentHeight = currentHeight + height;
				return (_Utils_cmp(
					newCurrentHeight,
					$elm$core$Basics$ceiling(scrollTop) - offset) < 1) ? _Utils_update(
					calculatedTuple,
					{aR: newCurrentHeight, bS: elementsCountToSkip + 1, bh: idx + 1, ar: topMargin + height}) : ((_Utils_cmp(
					currentHeight,
					($elm$core$Basics$floor(scrollTop) + containerHeight) + offset) < 0) ? _Utils_update(
					calculatedTuple,
					{
						aR: newCurrentHeight,
						bT: A2($elm$core$List$cons, item, elementsToShow),
						bh: idx + 1
					}) : _Utils_update(
					calculatedTuple,
					{aR: newCurrentHeight, bh: idx + 1}));
			});
		var initialValue = {aR: 0, bS: 0, bT: _List_Nil, bh: 0, ar: 0};
		var computedValues = A3($elm$core$List$foldl, updateComputations, initialValue, items);
		return {
			bR: $elm$core$List$reverse(computedValues.bT),
			cf: computedValues.bS,
			ar: computedValues.ar,
			bv: computedValues.aR
		};
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizesForSimpleHeight = F4(
	function (_v0, itemHeight, scrollTop, items) {
		var offset = _v0.bn;
		var containerHeight = _v0.d9;
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
		return {bR: elementsToShow, cf: elementsCountToSkip, ar: topMargin, bv: totalHeight};
	});
var $FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizes = F3(
	function (configValue, scrollTop, items) {
		var itemHeight = configValue.eB;
		var itemView = configValue.eD;
		var customContainer = configValue.bd;
		if (!itemHeight.$) {
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
		var totalHeight = _v0.bv;
		return totalHeight;
	});
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $FabienHenon$elm_infinite_list_view$InfiniteList$scrollToNthItem = function (_v0) {
	var postScrollMessage = _v0.e3;
	var listHtmlId = _v0.eJ;
	var itemIndex = _v0.eC;
	var configValue = _v0.d7;
	var items = _v0.eE;
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
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 2:
				var x = msg.a;
				var y = msg.b;
				return _Utils_update(
					model,
					{B: x, a7: y});
			case 1:
				var value = msg.a;
				return _Utils_update(
					model,
					{fl: value});
			case 3:
				var editedValue = msg.a;
				return _Utils_update(
					model,
					{fl: editedValue});
			default:
				return model;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$SetPosition = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$closeQuickFilter = function (state) {
	return _Utils_update(
		state,
		{af: false, bo: $elm$core$Maybe$Nothing});
};
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
		return _Utils_eq(columnConfig.b.n, id);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$isColumn = F2(
	function (firstColumnConfig, secondColumnConfig) {
		return _Utils_eq(firstColumnConfig.b.n, secondColumnConfig.b.n);
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.r)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.r, tail);
		return (notAppended < 0) ? {
			s: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.s),
			p: builder.p + 1,
			r: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			s: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.s),
			p: builder.p + 1,
			r: $elm$core$Elm$JsArray$empty
		} : {s: builder.s, p: builder.p, r: appended});
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
			if (!value.$) {
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
			if (!node.$) {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		s: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		p: (len / $elm$core$Array$branchFactor) | 0,
		r: tail
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
					if (!node.$) {
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
					if (!node.$) {
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
					{s: nodeList, p: nodeListSize, r: jsArray});
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
						if (!node.$) {
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
						s: _List_Nil,
						p: 0,
						r: A3(
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
			if (!_v0.$) {
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
				if (!_v0.$) {
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
		if (!_v0.$) {
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
var $elm$core$List$sortWith = _List_sortWith;
var $Orange_OpenSource$elm_advanced_grid$Grid$orderBy = F3(
	function (model, columnConfig, order) {
		switch (order) {
			case 2:
				return _Utils_Tuple2(
					$elm$core$List$reverse(
						A2($elm$core$List$sortWith, columnConfig.O, model.m)),
					2);
			case 1:
				return _Utils_Tuple2(
					A2($elm$core$List$sortWith, columnConfig.O, model.m),
					1);
			default:
				return _Utils_Tuple2(model.m, 0);
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$minColumnWidth = 25;
var $elm$core$Basics$round = _Basics_round;
var $Orange_OpenSource$elm_advanced_grid$Grid$updatePropertiesInColumnConfig = F2(
	function (updateFunction, columnConfig) {
		return _Utils_update(
			columnConfig,
			{
				b: updateFunction(columnConfig.b)
			});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateColumnProperties = F3(
	function (updateFunction, model, columnId) {
		return A3(
			$elm_community$list_extra$List$Extra$updateIf,
			$Orange_OpenSource$elm_advanced_grid$Grid$hasId(columnId),
			$Orange_OpenSource$elm_advanced_grid$Grid$updatePropertiesInColumnConfig(updateFunction),
			model.g.d6);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateColumnWidthProperty = F3(
	function (model, columnConfig, width) {
		var setWidth = function (properties) {
			return _Utils_update(
				properties,
				{A: width});
		};
		return A3($Orange_OpenSource$elm_advanced_grid$Grid$updateColumnProperties, setWidth, model, columnConfig.b.n);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withColumnsXState = function (state) {
	return _Utils_update(
		state,
		{
			bc: $Orange_OpenSource$elm_advanced_grid$Grid$columnsX(state)
		});
};
var $Orange_OpenSource$elm_advanced_grid$Grid$withConfigState = F2(
	function (config, state) {
		return _Utils_update(
			state,
			{g: config});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState = F2(
	function (columns, state) {
		var config = state.g;
		return $Orange_OpenSource$elm_advanced_grid$Grid$withColumnsXState(
			A2(
				$Orange_OpenSource$elm_advanced_grid$Grid$withConfigState,
				_Utils_update(
					config,
					{
						d6: $Orange_OpenSource$elm_advanced_grid$Grid$sanitizedColumns(columns)
					}),
				state));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$resizeColumn = F2(
	function (state, x) {
		var _v0 = state.ap;
		if (!_v0.$) {
			var columnConfig = _v0.a;
			var deltaX = x - state.aS;
			var newWidth = columnConfig.b.A + $elm$core$Basics$round(deltaX);
			var newColumns = (_Utils_cmp(newWidth, $Orange_OpenSource$elm_advanced_grid$Grid$minColumnWidth) > 0) ? A3($Orange_OpenSource$elm_advanced_grid$Grid$updateColumnWidthProperty, state, columnConfig, newWidth) : state.g.d6;
			var newState = A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, newColumns, state);
			return _Utils_update(
				newState,
				{
					bc: $Orange_OpenSource$elm_advanced_grid$Grid$columnsX(state)
				});
		} else {
			return state;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$setFilter = F2(
	function (filterValues, columnConfig) {
		var value = A2($elm$core$Dict$get, columnConfig.b.n, filterValues);
		return _Utils_update(
			columnConfig,
			{E: value});
	});
var $elm_community$list_extra$List$Extra$setIf = F3(
	function (predicate, replacement, list) {
		return A3(
			$elm_community$list_extra$List$Extra$updateIf,
			predicate,
			$elm$core$Basics$always(replacement),
			list);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateIndexes = function (items) {
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (i, item) {
				return _Utils_update(
					item,
					{dU: i});
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
				ab: newOrder,
				aF: $elm$core$Maybe$Just(columnConfig),
				m: updatedItems
			});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$toggleOrder = F3(
	function (model, columnConfig, order) {
		if (order === 1) {
			return _Utils_Tuple2(
				$elm$core$List$reverse(
					A2($elm$core$List$sortWith, columnConfig.O, model.m)),
				2);
		} else {
			return _Utils_Tuple2(
				A2($elm$core$List$sortWith, columnConfig.O, model.m),
				1);
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$toggleSelection = function (item) {
	return _Utils_update(
		item,
		{fb: !item.fb});
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
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
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
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$findFirstOK = function (results) {
	findFirstOK:
	while (true) {
		if (!results.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!results.a.$) {
				var result = results.a.a;
				return $elm$core$Maybe$Just(result);
			} else {
				var tail = results.b;
				var $temp$results = tail;
				results = $temp$results;
				continue findFirstOK;
			}
		}
	}
};
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {cT: col, du: problem, dD: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.dD, p.cT, p.du);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
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
		var parse = _v0;
		var _v1 = parse(
			{cT: 1, f: _List_Nil, i: 1, bn: 0, dD: 1, a: src});
		if (!_v1.$) {
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
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateContainsFilter = F2(
	function (filters, filteringString) {
		return A2(
			$elm$core$Result$map,
			filters.W.ae,
			A2($elm$parser$Parser$run, filters.W.an, filteringString));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateEqualFilter = F2(
	function (filters, filteringString) {
		return A2(
			$elm$core$Result$map,
			filters.X.ae,
			A2($elm$parser$Parser$run, filters.X.an, filteringString));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateGreaterThanFilter = F2(
	function (filters, filteringString) {
		return A2(
			$elm$core$Result$map,
			filters.Y.ae,
			A2($elm$parser$Parser$run, filters.Y.an, filteringString));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateLessThanFilter = F2(
	function (filters, filteringString) {
		return A2(
			$elm$core$Result$map,
			filters._.ae,
			A2($elm$parser$Parser$run, filters._.an, filteringString));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateFilter = F2(
	function (filteringString, filters) {
		var validators = _List_fromArray(
			[$Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateEqualFilter, $Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateLessThanFilter, $Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateGreaterThanFilter, $Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateContainsFilter]);
		return $Orange_OpenSource$elm_advanced_grid$Grid$Filters$findFirstOK(
			A2(
				$elm$core$List$map,
				function (validator) {
					return A2(validator, filters, filteringString);
				},
				validators));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Filters$parseFilteringString = F2(
	function (filteringValue, filter) {
		var filteringString = A2($elm$core$Maybe$withDefault, '', filteringValue);
		if (filteringString === '') {
			return $elm$core$Maybe$Nothing;
		} else {
			switch (filter.$) {
				case 0:
					var stringTypedFilter = filter.a;
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateFilter, filteringString, stringTypedFilter);
				case 1:
					var intTypedFilter = filter.a;
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateFilter, filteringString, intTypedFilter);
				case 2:
					var floatTypedFilter = filter.a;
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$validateFilter, filteringString, floatTypedFilter);
				case 3:
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
			return A2($Orange_OpenSource$elm_advanced_grid$Grid$Filters$parseFilteringString, col.E, col.av);
		},
		model.g.d6);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$withVisibleItems = F2(
	function (visibleItems, state) {
		return _Utils_update(
			state,
			{m: visibleItems});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems = function (state) {
	var allItems = A2(
		$elm$core$List$indexedMap,
		F2(
			function (contentIndex, value) {
				return A2($Orange_OpenSource$elm_advanced_grid$Grid$Item$create, value, contentIndex);
			}),
		state.au);
	var visibleItems = A2(
		$elm$core$List$indexedMap,
		F2(
			function (index, item) {
				return _Utils_update(
					item,
					{dU: index});
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
								return $.be;
							},
							filter),
						remainingValues);
				}),
			allItems,
			$Orange_OpenSource$elm_advanced_grid$Grid$columnFilters(state)));
	var _v0 = state.aF;
	if (!_v0.$) {
		var columnConfig = _v0.a;
		return A4(
			$Orange_OpenSource$elm_advanced_grid$Grid$sort,
			columnConfig,
			state.ab,
			$Orange_OpenSource$elm_advanced_grid$Grid$orderBy,
			A2($Orange_OpenSource$elm_advanced_grid$Grid$withVisibleItems, visibleItems, state));
	} else {
		return A2($Orange_OpenSource$elm_advanced_grid$Grid$withVisibleItems, visibleItems, state);
	}
};
var $Orange_OpenSource$elm_advanced_grid$Grid$withContent = F2(
	function (data, state) {
		return _Utils_update(
			state,
			{au: data});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withDraggedColumn = F2(
	function (draggedColumn, state) {
		return _Utils_update(
			state,
			{Q: draggedColumn});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withEditedColumnId = F2(
	function (id, state) {
		return _Utils_update(
			state,
			{bO: id});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withEditedItem = F2(
	function (maybeItem, state) {
		return _Utils_update(
			state,
			{bP: maybeItem});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withEditorHasFocus = F2(
	function (isEditing, state) {
		return _Utils_update(
			state,
			{bf: isEditing});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$withStringEditorModel = F2(
	function (model, state) {
		return _Utils_update(
			state,
			{aq: model});
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$updateState = F2(
	function (msg, state) {
		switch (msg.$) {
			case 0:
				var columns = msg.a;
				return A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, columns, state);
			case 2:
				return $Orange_OpenSource$elm_advanced_grid$Grid$closeQuickFilter(
					_Utils_update(
						state,
						{af: false}));
			case 3:
				var columnConfig = msg.a;
				var maybeString = msg.b;
				var newColumnconfig = _Utils_update(
					columnConfig,
					{E: maybeString});
				var newColumns = A3(
					$elm_community$list_extra$List$Extra$setIf,
					$Orange_OpenSource$elm_advanced_grid$Grid$isColumn(columnConfig),
					newColumnconfig,
					state.g.d6);
				var newState = A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, newColumns, state);
				return $Orange_OpenSource$elm_advanced_grid$Grid$closeQuickFilter(
					$Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems(newState));
			case 5:
				if (!msg.a.$) {
					var info = msg.a.a;
					var y = info.bQ.a7;
					var x = info.bQ.B;
					var updatedStringEditor = A2(
						$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$update,
						A2($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$SetPosition, x, y),
						state.aq);
					return A2($Orange_OpenSource$elm_advanced_grid$Grid$withStringEditorModel, updatedStringEditor, state);
				} else {
					return state;
				}
			case 6:
				if (!msg.a.$) {
					var info = msg.a.a;
					return _Utils_update(
						state,
						{
							bX: {B: info.bQ.B, a7: info.bQ.a7}
						});
				} else {
					return state;
				}
			case 1:
				var infList = msg.a;
				return _Utils_update(
					state,
					{bY: infList});
			case 7:
				var filterValues = msg.a;
				var newColumns = A2(
					$elm$core$List$map,
					$Orange_OpenSource$elm_advanced_grid$Grid$setFilter(filterValues),
					state.g.d6);
				var newState = A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, newColumns, state);
				return $Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems(newState);
			case 8:
				var columnId = msg.a;
				var sorting = msg.b;
				var sortedColumnConfig = A2(
					$elm_community$list_extra$List$Extra$find,
					$Orange_OpenSource$elm_advanced_grid$Grid$hasId(columnId),
					state.g.d6);
				if (!sortedColumnConfig.$) {
					var columnConfig = sortedColumnConfig.a;
					return A4($Orange_OpenSource$elm_advanced_grid$Grid$sort, columnConfig, sorting, $Orange_OpenSource$elm_advanced_grid$Grid$orderBy, state);
				} else {
					return state;
				}
			case 4:
				return state;
			case 9:
				return state;
			case 10:
				return _Utils_update(
					state,
					{bs: true});
			case 12:
				var updateContent = msg.a;
				var updatedData = A2($elm$core$List$map, updateContent, state.au);
				return $Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems(
					A2($Orange_OpenSource$elm_advanced_grid$Grid$withContent, updatedData, state));
			case 13:
				var updateContent = msg.a;
				var updatedData = A2($elm$core$List$map, updateContent, state.au);
				var updateVisibleItem = function (item) {
					return _Utils_update(
						item,
						{
							be: updateContent(item.be)
						});
				};
				var updatedVisibleItems = A2($elm$core$List$map, updateVisibleItem, state.m);
				return A2(
					$Orange_OpenSource$elm_advanced_grid$Grid$withVisibleItems,
					updatedVisibleItems,
					A2($Orange_OpenSource$elm_advanced_grid$Grid$withContent, updatedData, state));
			case 18:
				var columnConfig = msg.a;
				var mousePosition = msg.b;
				var draggedColumn = {bb: columnConfig, aS: mousePosition.B, b0: '', B: mousePosition.B};
				return A2(
					$Orange_OpenSource$elm_advanced_grid$Grid$withDraggedColumn,
					$elm$core$Maybe$Just(draggedColumn),
					state);
			case 11:
				switch (msg.a.$) {
					case 0:
						var _v1 = msg.a;
						return A2($Orange_OpenSource$elm_advanced_grid$Grid$withEditorHasFocus, false, state);
					case 4:
						var editedItem = msg.a.a;
						var editedColumn = A2(
							$elm$core$Maybe$withDefault,
							$Orange_OpenSource$elm_advanced_grid$Grid$selectionColumn,
							$elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (col) {
										return _Utils_eq(state.bO, col.b.n);
									},
									state.g.d6)));
						var updateEditedValue = F2(
							function (index, item) {
								return _Utils_eq(index, editedItem.eb) ? A2(editedColumn.ay, editedItem, state.aq.fl).be : item;
							});
						var updatedContent = A2($elm$core$List$indexedMap, updateEditedValue, state.au);
						return $Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems(
							A2(
								$Orange_OpenSource$elm_advanced_grid$Grid$withContent,
								updatedContent,
								A2(
									$Orange_OpenSource$elm_advanced_grid$Grid$withEditedItem,
									$elm$core$Maybe$Nothing,
									A2(
										$Orange_OpenSource$elm_advanced_grid$Grid$withStringEditorModel,
										$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$init,
										A2(
											$Orange_OpenSource$elm_advanced_grid$Grid$withEditedColumnId,
											'',
											A2($Orange_OpenSource$elm_advanced_grid$Grid$withEditorHasFocus, false, state))))));
					default:
						var stringEditorMsg = msg.a;
						return A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$withStringEditorModel,
							A2($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$update, stringEditorMsg, state.aq),
							state);
				}
			case 16:
				return _Utils_update(
					state,
					{af: true});
			case 15:
				return state;
			case 14:
				var columnConfig = msg.a;
				return state.af ? state : A4($Orange_OpenSource$elm_advanced_grid$Grid$sort, columnConfig, state.ab, $Orange_OpenSource$elm_advanced_grid$Grid$toggleOrder, state);
			case 17:
				var item = msg.a;
				return state.bf ? state : _Utils_update(
					state,
					{
						bK: $elm$core$Maybe$Just(item)
					});
			case 19:
				return _Utils_update(
					state,
					{bs: false});
			case 20:
				var columnConfig = msg.a;
				var position = msg.b;
				return _Utils_update(
					state,
					{
						aS: position.B,
						ap: $elm$core$Maybe$Just(columnConfig)
					});
			case 22:
				var mousePosition = msg.a;
				var newDraggedColumn = function () {
					var _v3 = state.Q;
					if (!_v3.$) {
						var draggedColumn = _v3.a;
						return $elm$core$Maybe$Just(
							_Utils_update(
								draggedColumn,
								{B: mousePosition.B}));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				return _Utils_update(
					state,
					{Q: newDraggedColumn});
			case 21:
				return state;
			case 23:
				return _Utils_update(
					state,
					{Q: $elm$core$Maybe$Nothing, ap: $elm$core$Maybe$Nothing});
			case 24:
				return state;
			case 25:
				var position = msg.a;
				return A2($Orange_OpenSource$elm_advanced_grid$Grid$resizeColumn, state, position.B);
			case 26:
				var columnConfig = msg.a;
				var draggedColumnConfig = msg.b;
				var _v4 = state.Q;
				if (!_v4.$) {
					var draggedColumn = _v4.a;
					if (_Utils_eq(columnConfig.b.n, draggedColumn.b0)) {
						return state;
					} else {
						var newColumns = A3($Orange_OpenSource$elm_advanced_grid$Grid$moveColumn, columnConfig, draggedColumnConfig, state.g.d6);
						return A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$withDraggedColumn,
							$elm$core$Maybe$Just(
								_Utils_update(
									draggedColumn,
									{b0: columnConfig.b.n})),
							A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, newColumns, state));
					}
				} else {
					return state;
				}
			case 27:
				var newStatus = !state.b_;
				var setSelectionStatus = function (item) {
					return _Utils_update(
						item,
						{fb: newStatus});
				};
				var updatedVisibleItems = A2($elm$core$List$map, setSelectionStatus, state.m);
				return _Utils_update(
					state,
					{b_: newStatus, m: updatedVisibleItems});
			case 28:
				var columnConfig = msg.a;
				var toggleVisibility = function (properties) {
					return _Utils_update(
						properties,
						{aK: !properties.aK});
				};
				var newColumns = A3(
					$elm_community$list_extra$List$Extra$updateIf,
					$Orange_OpenSource$elm_advanced_grid$Grid$isColumn(columnConfig),
					function (col) {
						return _Utils_update(
							col,
							{E: $elm$core$Maybe$Nothing});
					},
					A3($Orange_OpenSource$elm_advanced_grid$Grid$updateColumnProperties, toggleVisibility, state, columnConfig.b.n));
				var stateWithNewColumns = A2($Orange_OpenSource$elm_advanced_grid$Grid$withColumnsState, newColumns, state);
				return $Orange_OpenSource$elm_advanced_grid$Grid$updateVisibleItems(stateWithNewColumns);
			default:
				var item = msg.a;
				var newItems = A3(
					$elm_community$list_extra$List$Extra$updateAt,
					item.dU,
					function (it) {
						return $Orange_OpenSource$elm_advanced_grid$Grid$toggleSelection(it);
					},
					state.m);
				return _Utils_update(
					state,
					{m: newItems});
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$update = F2(
	function (msg, _v0) {
		var state = _v0;
		switch (msg.$) {
			case 24:
				return _Utils_Tuple2(
					state,
					A2($Orange_OpenSource$elm_advanced_grid$Grid$getElementInfo, $Orange_OpenSource$elm_advanced_grid$Grid$headerContainerId, $Orange_OpenSource$elm_advanced_grid$Grid$GotHeaderContainerInfo));
			case 9:
				var isTargetItem = msg.a;
				var targetItemIndex = A2(
					$elm$core$Maybe$withDefault,
					0,
					A2($elm_community$list_extra$List$Extra$findIndex, isTargetItem, state.m));
				return _Utils_Tuple2(
					state,
					$FabienHenon$elm_infinite_list_view$InfiniteList$scrollToNthItem(
						{
							d7: $Orange_OpenSource$elm_advanced_grid$Grid$infiniteListConfig(state),
							eC: targetItemIndex,
							eE: state.m,
							eJ: $Orange_OpenSource$elm_advanced_grid$Grid$gridHtmlId,
							e3: $Orange_OpenSource$elm_advanced_grid$Grid$NoOp
						}));
			case 15:
				var columnConfig = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						state,
						{
							af: true,
							bo: $elm$core$Maybe$Just(columnConfig)
						}),
					$Orange_OpenSource$elm_advanced_grid$Grid$focusOn($Orange_OpenSource$elm_advanced_grid$Grid$openedQuickFilterHtmlId));
			case 21:
				var itemToBeEdited = msg.a;
				var toString = msg.b;
				var columnId = msg.c;
				var editableCellId = msg.d;
				var updatedStringEditor = A2(
					$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$update,
					$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$SetEditedValue(
						toString(itemToBeEdited)),
					state.aq);
				return _Utils_Tuple2(
					A2(
						$Orange_OpenSource$elm_advanced_grid$Grid$withStringEditorModel,
						updatedStringEditor,
						A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$withEditedItem,
							$elm$core$Maybe$Just(itemToBeEdited),
							A2(
								$Orange_OpenSource$elm_advanced_grid$Grid$withEditedColumnId,
								columnId,
								A2($Orange_OpenSource$elm_advanced_grid$Grid$withEditorHasFocus, true, state)))),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$Orange_OpenSource$elm_advanced_grid$Grid$focusOn($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$editorId),
								A2($Orange_OpenSource$elm_advanced_grid$Grid$getElementInfo, editableCellId, $Orange_OpenSource$elm_advanced_grid$Grid$GotCellInfo)
							])));
			default:
				return _Utils_Tuple2(
					A2($Orange_OpenSource$elm_advanced_grid$Grid$updateState, msg, state),
					$elm$core$Platform$Cmd$none);
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var _v1 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, $Orange_OpenSource$elm_advanced_grid$Grid$ShowPreferences, model.h);
				var newGridModel = _v1.a;
				var gridCmd = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a9: true, h: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			case 1:
				switch (msg.a.$) {
					case 17:
						var item = msg.a.a;
						var _v2 = A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$update,
							$Orange_OpenSource$elm_advanced_grid$Grid$UserClickedLine(item),
							model.h);
						var newGridModel = _v2.a;
						var gridCmd = _v2.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									bK: $elm$core$Maybe$Just(item),
									h: newGridModel
								}),
							A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
					case 29:
						var item = msg.a.a;
						var _v3 = A2(
							$Orange_OpenSource$elm_advanced_grid$Grid$update,
							$Orange_OpenSource$elm_advanced_grid$Grid$UserToggledSelection(item),
							model.h);
						var newGridModel = _v3.a;
						var gridCmd = _v3.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: newGridModel}),
							A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
					case 27:
						var _v4 = msg.a;
						var _v5 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, $Orange_OpenSource$elm_advanced_grid$Grid$UserToggledAllItemSelection, model.h);
						var newGridModel = _v5.a;
						var gridCmd = _v5.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: newGridModel}),
							A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
					default:
						var message = msg.a;
						var _v6 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.h);
						var newGridModel = _v6.a;
						var gridCmd = _v6.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{h: newGridModel}),
							A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
				}
			case 2:
				var _v7 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedPreferenceCloseButton, model.h);
				var newGridModel = _v7.a;
				var gridCmd = _v7.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a9: false, h: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			case 3:
				var message = $Orange_OpenSource$elm_advanced_grid$Grid$SetFilters($elm$core$Dict$empty);
				var _v8 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.h);
				var newGridModel = _v8.a;
				var gridCmd = _v8.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{h: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			case 4:
				var filters = $elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2('City', 'o')
						]));
				var message = $Orange_OpenSource$elm_advanced_grid$Grid$SetFilters(filters);
				var _v9 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.h);
				var newGridModel = _v9.a;
				var gridCmd = _v9.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{h: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			case 5:
				var message = A2($Orange_OpenSource$elm_advanced_grid$Grid$SetSorting, 'City', 1);
				var _v10 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.h);
				var newGridModel = _v10.a;
				var gridCmd = _v10.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{h: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			case 6:
				var message = A2($Orange_OpenSource$elm_advanced_grid$Grid$SetSorting, 'City', 2);
				var _v11 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.h);
				var newGridModel = _v11.a;
				var gridCmd = _v11.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{h: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
			default:
				var city = msg.a;
				var message = $Orange_OpenSource$elm_advanced_grid$Grid$ScrollTo(
					function (item) {
						return A2(
							$elm$core$String$startsWith,
							$elm$core$String$toLower(city),
							$elm$core$String$toLower(item.be.bI));
					});
				var _v12 = A2($Orange_OpenSource$elm_advanced_grid$Grid$update, message, model.h);
				var newGridModel = _v12.a;
				var gridCmd = _v12.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{h: newGridModel}),
					A2($elm$core$Platform$Cmd$map, $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg, gridCmd));
		}
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $Orange_OpenSource$elm_advanced_grid$Grid$UserEndedMouseInteraction = {$: 23};
var $rtfeldman$elm_css$Css$auto = {dX: 0, c: 0, aU: 0, bZ: 0, eF: 0, aY: 0, ak: 0, Z: 0, a$: 0, T: 0, ch: 0, a4: 0, N: 0, fl: 'auto'};
var $rtfeldman$elm_css$VirtualDom$Styled$unstyledAttribute = function (prop) {
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, prop, _List_Nil, '');
};
var $rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledAttribute;
var $rtfeldman$elm_css$Css$margin = $rtfeldman$elm_css$Css$prop1('margin');
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {cw: true, cA: false};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 3, a: a};
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
		return {d1: button, cS: clientPos, eG: keys, eV: offsetPos, e_: pagePos, e8: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = 4;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = 0;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = 5;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = 1;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = 2;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = 3;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		default:
			return 0;
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
		return {dY: alt, ed: ctrl, a0: shift};
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
						al: tag(ev),
						cw: options.cw,
						cA: options.cA
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
var $rtfeldman$elm_css$Css$position = $rtfeldman$elm_css$Css$prop1('position');
var $rtfeldman$elm_css$Css$relative = {br: 0, fl: 'relative'};
var $rtfeldman$elm_css$Css$absolute = {br: 0, fl: 'absolute'};
var $rtfeldman$elm_css$Css$backgroundImage = $rtfeldman$elm_css$Css$prop1('background-image');
var $rtfeldman$elm_css$Css$flexDirection = $rtfeldman$elm_css$Css$prop1('flex-direction');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey2 = $rtfeldman$elm_css$Css$hex('BBB');
var $rtfeldman$elm_css$Css$collectStops = $elm$core$List$map(
	function (_v0) {
		var c = _v0.a;
		var len = _v0.b;
		return A2(
			$elm$core$String$append,
			c.fl,
			A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					A2(
						$elm$core$Basics$composeL,
						$elm$core$String$cons(' '),
						function ($) {
							return $.fl;
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
			aN: 0,
			d: 0,
			fl: A2(
				$rtfeldman$elm_css$Css$cssFunction,
				'linear-gradient',
				$rtfeldman$elm_css$Css$collectStops(
					_Utils_ap(
						_List_fromArray(
							[firstStop, secondStop]),
						otherStops)))
		};
	});
var $rtfeldman$elm_css$Css$padding = $rtfeldman$elm_css$Css$prop1('padding');
var $rtfeldman$elm_css$Css$row = {co: 0, bg: 0, fl: 'row'};
var $rtfeldman$elm_css$Css$stop = function (c) {
	return _Utils_Tuple2(c, $elm$core$Maybe$Nothing);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$white2 = $rtfeldman$elm_css$Css$hex('EEE');
var $Orange_OpenSource$elm_advanced_grid$Grid$headerStyles = function (state) {
	return $rtfeldman$elm_css$Html$Styled$Attributes$css(
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$backgroundImage(
				A3(
					$rtfeldman$elm_css$Css$linearGradient,
					$rtfeldman$elm_css$Css$stop($Orange_OpenSource$elm_advanced_grid$Grid$Colors$white2),
					$rtfeldman$elm_css$Css$stop($Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey),
					_List_Nil)),
				$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineFlex),
				$Orange_OpenSource$elm_advanced_grid$Grid$noShrink,
				$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row),
				A3(
				$rtfeldman$elm_css$Css$border3,
				$rtfeldman$elm_css$Css$px(1),
				$rtfeldman$elm_css$Css$solid,
				$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey2),
				$rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$contentBox),
				$rtfeldman$elm_css$Css$height(
				$rtfeldman$elm_css$Css$px(state.g.es - $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth)),
				$Orange_OpenSource$elm_advanced_grid$Grid$descendantsVisibleOnHover,
				$rtfeldman$elm_css$Css$padding(
				$rtfeldman$elm_css$Css$px(2))
			]));
};
var $rtfeldman$elm_css$Css$left = $rtfeldman$elm_css$Css$prop1('left');
var $Orange_OpenSource$elm_advanced_grid$Grid$noContent = $rtfeldman$elm_css$Html$Styled$text('');
var $rtfeldman$elm_css$Css$none = {aN: 0, cM: 0, I: 0, c: 0, o: 0, ev: 0, da: 0, cq: 0, a_: 0, az: 0, Z: 0, e: 0, d: 0, ct: 0, b9: 0, e0: 0, T: 0, cb: 0, e9: 0, a2: 0, aH: 0, N: 0, k: 0, fk: 0, fl: 'none'};
var $rtfeldman$elm_css$Css$pointerEvents = $rtfeldman$elm_css$Css$prop1('pointer-events');
var $rtfeldman$elm_css$Css$top = $rtfeldman$elm_css$Css$prop1('top');
var $rtfeldman$elm_css$Css$column = _Utils_update(
	$rtfeldman$elm_css$Css$row,
	{fl: 'column'});
var $rtfeldman$elm_css$Css$flexGrow = $rtfeldman$elm_css$Css$prop1('flex-grow');
var $rtfeldman$elm_css$Css$flexStart = $rtfeldman$elm_css$Css$prop1('flex-start');
var $Orange_OpenSource$elm_advanced_grid$Grid$resizingHandleWidth = 5;
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedDragHandle = F2(
	function (a, b) {
		return {$: 18, a: a, b: b};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$UserHoveredDragHandle = {$: 24};
var $rtfeldman$elm_css$Css$cursor = $rtfeldman$elm_css$Css$prop1('cursor');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey2 = $rtfeldman$elm_css$Css$hex('888');
var $rtfeldman$elm_css$Css$fontSize = $rtfeldman$elm_css$Css$prop1('font-size');
var $rtfeldman$elm_css$Css$UnitlessInteger = 0;
var $rtfeldman$elm_css$Css$int = function (val) {
	return {
		ai: 0,
		bZ: 0,
		aA: 0,
		Z: 0,
		bm: 0,
		b3: 0,
		am: val,
		a5: '',
		bz: 0,
		fl: $elm$core$String$fromInt(val)
	};
};
var $rtfeldman$elm_css$Css$marginBottom = $rtfeldman$elm_css$Css$prop1('margin-bottom');
var $rtfeldman$elm_css$Css$marginRight = $rtfeldman$elm_css$Css$prop1('margin-right');
var $rtfeldman$elm_css$Css$move = {c: 0, fl: 'move'};
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
	return {B: event.cS.a, a7: event.cS.b};
};
var $rtfeldman$elm_css$Css$zIndex = $rtfeldman$elm_css$Css$prop1('z-index');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewDragHandle = function (columnConfig) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
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
				A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'dragHandle-' + columnConfig.b.n)
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
								$rtfeldman$elm_css$Html$Styled$Attributes$css(
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
									]))
							]),
						_List_Nil)))));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$FilterLostFocus = {$: 2};
var $Orange_OpenSource$elm_advanced_grid$Grid$FilterModified = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedFilter = {$: 16};
var $rtfeldman$elm_css$Css$alignSelf = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'alignSelf',
		'align-self',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$border = $rtfeldman$elm_css$Css$prop1('border');
var $Orange_OpenSource$elm_advanced_grid$Grid$filterInputWidth = function (columnConfig) {
	return $rtfeldman$elm_css$Css$px(
		(columnConfig.b.A - ($Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth * 2)) - (columnConfig.aj ? 30 : 0));
};
var $rtfeldman$elm_css$Css$marginLeft = $rtfeldman$elm_css$Css$prop1('margin-left');
var $rtfeldman$elm_css$Html$Styled$Events$onBlur = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $rtfeldman$elm_css$Html$Styled$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
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
var $rtfeldman$elm_css$Css$stretch = $rtfeldman$elm_css$Css$prop1('stretch');
var $rtfeldman$elm_css$Html$Styled$Attributes$title = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('title');
var $rtfeldman$elm_css$Html$Styled$Attributes$value = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('value');
var $Orange_OpenSource$elm_advanced_grid$Grid$Closed = 1;
var $Orange_OpenSource$elm_advanced_grid$Grid$None = 2;
var $Orange_OpenSource$elm_advanced_grid$Grid$Open = 0;
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedQuickFilterButton = function (a) {
	return {$: 15, a: a};
};
var $elm_community$typed_svg$TypedSvg$Types$Fill = function (a) {
	return {$: 0, a: a};
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
	if (!fill.$) {
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
var $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode = $rtfeldman$elm_css$VirtualDom$Styled$Unstyled;
var $rtfeldman$elm_css$Svg$Styled$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode;
var $elm_community$typed_svg$TypedSvg$Core$node = $elm$virtual_dom$VirtualDom$nodeNS('http://www.w3.org/2000/svg');
var $elm_community$typed_svg$TypedSvg$g = $elm_community$typed_svg$TypedSvg$Core$node('g');
var $elm_community$typed_svg$TypedSvg$TypesToStrings$lengthToString = function (length) {
	switch (length.$) {
		case 0:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'cm';
		case 1:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'em';
		case 2:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'ex';
		case 3:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'in';
		case 4:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'mm';
		case 5:
			var x = length.a;
			return $elm$core$String$fromFloat(x);
		case 6:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + 'pc';
		case 7:
			var x = length.a;
			return $elm$core$String$fromFloat(x) + '%';
		case 8:
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
	return {$: 9, a: a};
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
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
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
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawSvg = F3(
	function (size, svgPath, message) {
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
										$elm_community$typed_svg$TypedSvg$Types$Fill(
											A3($avh4$elm_color$Color$rgb, 0.6, 0.6, 0.6)))
									]),
								_List_Nil)
							]))
					])));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$filterIcon = 'M 0 0 L 15 0 L 9 6 L 9 12 L 6 12 L 6 6 Z';
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$openQuickFilter = 'Open quick filter';
var $rtfeldman$elm_css$Css$paddingTop = $rtfeldman$elm_css$Css$prop1('padding-top');
var $rtfeldman$elm_css$Css$pointer = {c: 0, fl: 'pointer'};
var $Orange_OpenSource$elm_advanced_grid$Grid$Labels$clear = 'Clear';
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
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
var $Orange_OpenSource$elm_advanced_grid$Grid$columnVisibleValues = F2(
	function (columnConfig, state) {
		return $elm_community$list_extra$List$Extra$unique(
			A2(
				$elm$core$List$map,
				columnConfig.aI,
				A2($elm$core$List$sortWith, columnConfig.O, state.m)));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$Icons$width = 15;
var $Orange_OpenSource$elm_advanced_grid$Grid$contextualMenuPosition = function (columnConfig) {
	return ((columnConfig.b.A - $Orange_OpenSource$elm_advanced_grid$Grid$Icons$width) - $Orange_OpenSource$elm_advanced_grid$Grid$resizingHandleWidth) - 10;
};
var $rtfeldman$elm_css$Css$maxHeight = $rtfeldman$elm_css$Css$prop1('max-height');
var $rtfeldman$elm_css$Css$opacity = $rtfeldman$elm_css$Css$prop1('opacity');
var $rtfeldman$elm_css$Css$overflowX = $rtfeldman$elm_css$Css$prop1('overflow-x');
var $rtfeldman$elm_css$Css$overflowY = $rtfeldman$elm_css$Css$prop1('overflow-y');
var $Orange_OpenSource$elm_advanced_grid$Grid$quickFilterPopupStyles = function (columnConfig) {
	return $rtfeldman$elm_css$Html$Styled$Attributes$css(
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
				$rtfeldman$elm_css$Css$left(
				$rtfeldman$elm_css$Css$px(
					$Orange_OpenSource$elm_advanced_grid$Grid$contextualMenuPosition(columnConfig))),
				$rtfeldman$elm_css$Css$top(
				$rtfeldman$elm_css$Css$px(-10)),
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
					A2($elm$core$Basics$max, columnConfig.b.A, 100))),
				$rtfeldman$elm_css$Css$maxHeight(
				$rtfeldman$elm_css$Css$px(400)),
				$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$white),
				$rtfeldman$elm_css$Css$overflowX($rtfeldman$elm_css$Css$hidden),
				$rtfeldman$elm_css$Css$overflowY($rtfeldman$elm_css$Css$auto),
				$rtfeldman$elm_css$Css$whiteSpace($rtfeldman$elm_css$Css$noWrap)
			]));
};
var $rtfeldman$elm_css$Html$Styled$Attributes$tabindex = function (n) {
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $rtfeldman$elm_css$Html$Styled$span = $rtfeldman$elm_css$Html$Styled$node('span');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewEllipsis = F2(
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
var $rtfeldman$elm_css$Css$fontStyle = $rtfeldman$elm_css$Css$prop1('font-style');
var $rtfeldman$elm_css$Css$italic = {aV: 0, fl: 'italic'};
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey3 = $rtfeldman$elm_css$Css$hex('DDD');
var $rtfeldman$elm_css$Css$normal = {cn: 0, aV: 0, ai: 0, cv: 0, fl: 'normal', at: 0};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewQuickFilterEntry = function (params) {
	var style = (params.b$ || _Utils_eq(params.bi, params.bU)) ? $rtfeldman$elm_css$Css$fontStyle($rtfeldman$elm_css$Css$italic) : $rtfeldman$elm_css$Css$fontStyle($rtfeldman$elm_css$Css$normal);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Events$onClick(
				A2($Orange_OpenSource$elm_advanced_grid$Grid$FilterModified, params.bL, params.bV)),
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
						style,
						$rtfeldman$elm_css$Css$hover(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey3)
							]))
					]))
			]),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$text(params.bi)
			]));
};
var $rtfeldman$elm_css$Css$color = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'color', c.fl);
};
var $rtfeldman$elm_css$Html$Styled$hr = $rtfeldman$elm_css$Html$Styled$node('hr');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewResetSelector = F2(
	function (columnConfig, label) {
		var params = {bL: columnConfig, bU: '', bV: $elm$core$Maybe$Nothing, b$: true, bi: label};
		return _Utils_eq(columnConfig.E, $elm$core$Maybe$Nothing) ? _List_Nil : _List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$hr,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$color($Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey2)
							]))
					]),
				_List_Nil),
				$Orange_OpenSource$elm_advanced_grid$Grid$viewQuickFilterEntry(params)
			]);
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewOpenedQuickFilter = F2(
	function (state, columnConfig) {
		var maxQuickFilterPropositions = 100;
		var values = A2(
			$elm$core$List$take,
			maxQuickFilterPropositions,
			A2($Orange_OpenSource$elm_advanced_grid$Grid$columnVisibleValues, columnConfig, state));
		var firstItem = A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm$core$List$head(values));
		var emptyLabel = A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$empty, state.eH);
		var filterPropositions = (firstItem === '') ? A2(
			$elm$core$List$cons,
			emptyLabel,
			A2($elm$core$List$drop, 1, values)) : values;
		var params = function (value) {
			return {
				bL: columnConfig,
				bU: emptyLabel,
				bV: $elm$core$Maybe$Just('=' + value),
				b$: false,
				bi: value
			};
		};
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$Orange_OpenSource$elm_advanced_grid$Grid$quickFilterPopupStyles(columnConfig),
					$rtfeldman$elm_css$Html$Styled$Attributes$tabindex(0),
					$rtfeldman$elm_css$Html$Styled$Events$onBlur($Orange_OpenSource$elm_advanced_grid$Grid$FilterLostFocus),
					$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$openedQuickFilterHtmlId)
				]),
			_Utils_ap(
				A2(
					$elm$core$List$map,
					function (value) {
						return $Orange_OpenSource$elm_advanced_grid$Grid$viewQuickFilterEntry(
							params(value));
					},
					filterPropositions),
				_Utils_ap(
					A2(
						$Orange_OpenSource$elm_advanced_grid$Grid$viewEllipsis,
						$elm$core$List$length(filterPropositions),
						maxQuickFilterPropositions),
					A2(
						$Orange_OpenSource$elm_advanced_grid$Grid$viewResetSelector,
						columnConfig,
						A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$clear, state.eH)))));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewQuickFilter = F2(
	function (state, columnConfig) {
		var isQuickFilterOpen = A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				$Orange_OpenSource$elm_advanced_grid$Grid$isColumn(columnConfig),
				state.bo));
		var quickFilterState = (!columnConfig.aj) ? 2 : (isQuickFilterOpen ? 0 : 1);
		switch (quickFilterState) {
			case 2:
				return $Orange_OpenSource$elm_advanced_grid$Grid$noContent;
			case 0:
				return A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute)
								]))
						]),
					_List_fromArray(
						[
							A2($Orange_OpenSource$elm_advanced_grid$Grid$viewOpenedQuickFilter, state, columnConfig)
						]));
			default:
				return A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
									$rtfeldman$elm_css$Css$displayFlex,
									$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
									$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row),
									$rtfeldman$elm_css$Css$padding(
									$rtfeldman$elm_css$Css$px(2)),
									$rtfeldman$elm_css$Css$paddingTop(
									$rtfeldman$elm_css$Css$px(6))
								])),
							A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'quickFilter-' + columnConfig.b.n),
							$rtfeldman$elm_css$Html$Styled$Events$onClick($Orange_OpenSource$elm_advanced_grid$Grid$UserClickedFilter),
							$rtfeldman$elm_css$Html$Styled$Attributes$title(
							A2($Orange_OpenSource$elm_advanced_grid$Grid$Labels$localize, $Orange_OpenSource$elm_advanced_grid$Grid$Labels$openQuickFilter, state.eH))
						]),
					_List_fromArray(
						[
							A3(
							$Orange_OpenSource$elm_advanced_grid$Grid$Icons$drawSvg,
							$Orange_OpenSource$elm_advanced_grid$Grid$Icons$width,
							$Orange_OpenSource$elm_advanced_grid$Grid$Icons$filterIcon,
							$Orange_OpenSource$elm_advanced_grid$Grid$UserClickedQuickFilterButton(columnConfig))
						]));
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewFilter = F2(
	function (state, columnConfig) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
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
						]))
				]),
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$input,
					_List_fromArray(
						[
							A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'filter-' + columnConfig.b.n),
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$border(
									$rtfeldman$elm_css$Css$px(0)),
									$rtfeldman$elm_css$Css$height(
									$rtfeldman$elm_css$Css$px(state.g.eI)),
									$rtfeldman$elm_css$Css$paddingLeft(
									$rtfeldman$elm_css$Css$px(2)),
									$rtfeldman$elm_css$Css$paddingRight(
									$rtfeldman$elm_css$Css$px(2)),
									$rtfeldman$elm_css$Css$marginLeft(
									$rtfeldman$elm_css$Css$px($Orange_OpenSource$elm_advanced_grid$Grid$resizingHandleWidth)),
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
							A2($elm$core$Maybe$withDefault, '', columnConfig.E))
						]),
					_List_Nil),
					A2($Orange_OpenSource$elm_advanced_grid$Grid$viewQuickFilter, state, columnConfig)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedResizeHandle = F2(
	function (a, b) {
		return {$: 20, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$colResize = {c: 0, fl: 'col-resize'};
var $rtfeldman$elm_css$Css$spaceAround = $rtfeldman$elm_css$Css$prop1('space-around');
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey3 = $rtfeldman$elm_css$Css$hex('AAA');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewVerticalBar = A2(
	$rtfeldman$elm_css$Html$Styled$div,
	_List_fromArray(
		[
			$rtfeldman$elm_css$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$width(
					$rtfeldman$elm_css$Css$px(1)),
					$rtfeldman$elm_css$Css$height(
					$rtfeldman$elm_css$Css$px(10)),
					$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey3)
				]))
		]),
	_List_Nil);
var $Orange_OpenSource$elm_advanced_grid$Grid$viewResizeHandle = function (columnConfig) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$colResize),
						$rtfeldman$elm_css$Css$displayFlex,
						$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$spaceAround),
						$rtfeldman$elm_css$Css$height(
						$rtfeldman$elm_css$Css$pct(100)),
						$rtfeldman$elm_css$Css$visibility($rtfeldman$elm_css$Css$hidden),
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$px($Orange_OpenSource$elm_advanced_grid$Grid$resizingHandleWidth))
					])),
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
var $rtfeldman$elm_css$Css$transparent = {V: 0, fl: 'transparent'};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewArrow = function (horizontalBorder) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
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
						A3(
						horizontalBorder,
						$rtfeldman$elm_css$Css$px(5),
						$rtfeldman$elm_css$Css$solid,
						$Orange_OpenSource$elm_advanced_grid$Grid$Colors$black),
						$rtfeldman$elm_css$Css$margin(
						$rtfeldman$elm_css$Css$px(5))
					]))
			]),
		_List_Nil);
};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewArrowDown = $Orange_OpenSource$elm_advanced_grid$Grid$viewArrow($rtfeldman$elm_css$Css$borderTop3);
var $Orange_OpenSource$elm_advanced_grid$Grid$viewArrowUp = $Orange_OpenSource$elm_advanced_grid$Grid$viewArrow($rtfeldman$elm_css$Css$borderBottom3);
var $Orange_OpenSource$elm_advanced_grid$Grid$viewSortingSymbol = F2(
	function (state, columnConfig) {
		var _v0 = state.aF;
		if (!_v0.$) {
			var config = _v0.a;
			return _Utils_eq(config.b.n, columnConfig.b.n) ? ((state.ab === 2) ? $Orange_OpenSource$elm_advanced_grid$Grid$viewArrowUp : $Orange_OpenSource$elm_advanced_grid$Grid$viewArrowDown) : $Orange_OpenSource$elm_advanced_grid$Grid$noContent;
		} else {
			return $Orange_OpenSource$elm_advanced_grid$Grid$noContent;
		}
	});
var $rtfeldman$elm_css$Css$lineHeight = $rtfeldman$elm_css$Css$prop1('line-height');
var $Orange_OpenSource$elm_advanced_grid$Grid$viewTitle = F2(
	function (state, columnConfig) {
		var titleFontStyle = function () {
			var _v0 = state.aF;
			if (!_v0.$) {
				var column = _v0.a;
				return _Utils_eq(column.b.n, columnConfig.b.n) ? $rtfeldman$elm_css$Css$fontStyle($rtfeldman$elm_css$Css$italic) : $rtfeldman$elm_css$Css$fontStyle($rtfeldman$elm_css$Css$normal);
			} else {
				return $rtfeldman$elm_css$Css$fontStyle($rtfeldman$elm_css$Css$normal);
			}
		}();
		return A2(
			$rtfeldman$elm_css$Html$Styled$span,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							titleFontStyle,
							$rtfeldman$elm_css$Css$lineHeight(
							$rtfeldman$elm_css$Css$num(1.2))
						]))
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(columnConfig.b.y)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewDataHeader = F3(
	function (state, columnConfig, conditionalAttributes) {
		var attributes = _List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$displayFlex,
						$Orange_OpenSource$elm_advanced_grid$Grid$noShrink,
						$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row)
					]))
			]);
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			attributes,
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_Utils_ap(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Attributes$css(
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$displayFlex,
										$Orange_OpenSource$elm_advanced_grid$Grid$noShrink,
										$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$column),
										$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$flexStart),
										$rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$hidden),
										$rtfeldman$elm_css$Css$width(
										$rtfeldman$elm_css$Css$px((columnConfig.b.A - $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth) - $Orange_OpenSource$elm_advanced_grid$Grid$resizingHandleWidth))
									]))
							]),
						conditionalAttributes),
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$div,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$css(
									_List_fromArray(
										[
											$rtfeldman$elm_css$Css$displayFlex,
											$Orange_OpenSource$elm_advanced_grid$Grid$noShrink,
											$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row),
											$rtfeldman$elm_css$Css$flexGrow(
											$rtfeldman$elm_css$Css$num(1)),
											$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$flexStart)
										]))
								]),
							_List_fromArray(
								[
									$Orange_OpenSource$elm_advanced_grid$Grid$viewDragHandle(columnConfig),
									A2($Orange_OpenSource$elm_advanced_grid$Grid$viewTitle, state, columnConfig),
									A2($Orange_OpenSource$elm_advanced_grid$Grid$viewSortingSymbol, state, columnConfig)
								])),
							A2($Orange_OpenSource$elm_advanced_grid$Grid$viewFilter, state, columnConfig)
						])),
					$Orange_OpenSource$elm_advanced_grid$Grid$viewResizeHandle(columnConfig)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewGhostHeader = function (state) {
	var _v0 = state.Q;
	if (!_v0.$) {
		var draggedColumn = _v0.a;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			A2(
				$elm$core$List$cons,
				$Orange_OpenSource$elm_advanced_grid$Grid$headerStyles(state),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
								$rtfeldman$elm_css$Css$left(
								$rtfeldman$elm_css$Css$px(draggedColumn.B - state.bX.B)),
								$rtfeldman$elm_css$Css$top(
								$rtfeldman$elm_css$Css$px(2)),
								$rtfeldman$elm_css$Css$pointerEvents($rtfeldman$elm_css$Css$none)
							]))
					])),
			_List_fromArray(
				[
					A3($Orange_OpenSource$elm_advanced_grid$Grid$viewDataHeader, state, draggedColumn.bb, _List_Nil)
				]));
	} else {
		return $Orange_OpenSource$elm_advanced_grid$Grid$noContent;
	}
};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserMovedResizeHandle = function (a) {
	return {$: 25, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey = $rtfeldman$elm_css$Css$hex('666');
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousemove', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $Orange_OpenSource$elm_advanced_grid$Grid$UserClickedHeader = function (a) {
	return {$: 14, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserDraggedColumn = function (a) {
	return {$: 22, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$UserSwappedColumns = F2(
	function (a, b) {
		return {$: 26, a: a, b: b};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onEnter = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseenter', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $Orange_OpenSource$elm_advanced_grid$Grid$draggingAttributes = F2(
	function (state, currentColumn) {
		var _v0 = state.Q;
		if (!_v0.$) {
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
				A2($Orange_OpenSource$elm_advanced_grid$Grid$isColumn, currentColumn, draggedColumn.bb) ? _List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$opacity(
								$rtfeldman$elm_css$Css$num(0))
							]))
					]) : _List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
						$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onEnter(
							function (_v1) {
								return A2($Orange_OpenSource$elm_advanced_grid$Grid$UserSwappedColumns, currentColumn, draggedColumn.bb);
							}))
					]));
		} else {
			return _List_Nil;
		}
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewSelectionHeader = F2(
	function (state, _v0) {
		var areAllItemsChecked = A2(
			$elm$core$List$all,
			function ($) {
				return $.fb;
			},
			state.m);
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$px($Orange_OpenSource$elm_advanced_grid$Grid$selectionColumn.b.A - $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth)),
							$rtfeldman$elm_css$Css$displayFlex,
							$Orange_OpenSource$elm_advanced_grid$Grid$noShrink,
							$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
							$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center)
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
							$Orange_OpenSource$elm_advanced_grid$Grid$stopPropagationOnClick($Orange_OpenSource$elm_advanced_grid$Grid$UserToggledAllItemSelection)
						]),
					_List_Nil)
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewHeader = F3(
	function (state, columnConfig, index) {
		var headerId = 'header-' + columnConfig.b.n;
		var conditionalAttributes = (_Utils_eq(state.ap, $elm$core$Maybe$Nothing) && (!state.af)) ? _List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Events$onClick(
				$Orange_OpenSource$elm_advanced_grid$Grid$UserClickedHeader(columnConfig))
			]) : _List_Nil;
		var attributes = _List_fromArray(
			[
				A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', headerId),
				$rtfeldman$elm_css$Html$Styled$Attributes$id(headerId),
				$Orange_OpenSource$elm_advanced_grid$Grid$headerStyles(state),
				$rtfeldman$elm_css$Html$Styled$Attributes$title(columnConfig.b.z)
			]);
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_Utils_ap(attributes, conditionalAttributes),
			_List_fromArray(
				[
					$Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumn(columnConfig) ? A2($Orange_OpenSource$elm_advanced_grid$Grid$viewSelectionHeader, state, columnConfig) : A3(
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
		$Orange_OpenSource$elm_advanced_grid$Grid$visibleColumns(state));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewHeaderContainer = function (state) {
	var conditionalAttributes = (!_Utils_eq(state.ap, $elm$core$Maybe$Nothing)) ? _List_fromArray(
		[
			$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
			$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove(
				function (event) {
					return $Orange_OpenSource$elm_advanced_grid$Grid$UserMovedResizeHandle(
						$Orange_OpenSource$elm_advanced_grid$Grid$toPosition(event));
				}))
		]) : _List_Nil;
	var attributes = _List_fromArray(
		[
			$rtfeldman$elm_css$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$backgroundColor($Orange_OpenSource$elm_advanced_grid$Grid$Colors$darkGrey),
					$rtfeldman$elm_css$Css$displayFlex,
					$Orange_OpenSource$elm_advanced_grid$Grid$noShrink,
					$rtfeldman$elm_css$Css$height(
					$rtfeldman$elm_css$Css$px(state.g.es))
				])),
			$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$headerContainerId)
		]);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_Utils_ap(attributes, conditionalAttributes),
		$Orange_OpenSource$elm_advanced_grid$Grid$viewHeaders(state));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$InfiniteListMsg = function (a) {
	return {$: 1, a: a};
};
var $rtfeldman$elm_css$Html$Styled$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode;
var $FabienHenon$elm_infinite_list_view$InfiniteList$decodeToModel = A2(
	$elm$json$Json$Decode$map,
	$elm$core$Basics$identity,
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
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $elm$html$Html$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
var $FabienHenon$elm_infinite_list_view$InfiniteList$addAttribute = F3(
	function (f, value, newAttributes) {
		if (value.$ === 1) {
			return newAttributes;
		} else {
			var v = value.a;
			return A2(
				$elm$core$List$cons,
				f(v),
				newAttributes);
		}
	});
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $FabienHenon$elm_infinite_list_view$InfiniteList$attributes = F2(
	function (totalHeight, _v0) {
		var styles = _v0.cg;
		var id = _v0.n;
		var _class = _v0.bJ;
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
		var itemView = configValue.eD;
		var customContainer = configValue.bd;
		var scrollTop = _v0;
		var _v1 = A3($FabienHenon$elm_infinite_list_view$InfiniteList$computeElementsAndSizes, configValue, scrollTop, items);
		var skipCount = _v1.cf;
		var elements = _v1.bR;
		var topMargin = _v1.ar;
		var totalHeight = _v1.bv;
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
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$height(
						$rtfeldman$elm_css$Css$px(state.g.d9)),
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$px(
							$Orange_OpenSource$elm_advanced_grid$Grid$gridWidth(state))),
						$rtfeldman$elm_css$Css$overflowX($rtfeldman$elm_css$Css$hidden),
						$rtfeldman$elm_css$Css$overflowY($rtfeldman$elm_css$Css$auto),
						A2($rtfeldman$elm_css$Css$property, 'direction', 'rtl')
					])),
				$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
				$FabienHenon$elm_infinite_list_view$InfiniteList$onScroll($Orange_OpenSource$elm_advanced_grid$Grid$InfiniteListMsg)),
				$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$gridHtmlId)
			]),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$fromUnstyled(
				A3(
					$FabienHenon$elm_infinite_list_view$InfiniteList$view,
					$Orange_OpenSource$elm_advanced_grid$Grid$infiniteListConfig(state),
					state.bY,
					state.m))
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewGrid = function (state) {
	var conditionalAttributes = ((!_Utils_eq(state.ap, $elm$core$Maybe$Nothing)) || (!_Utils_eq(state.Q, $elm$core$Maybe$Nothing))) ? _List_fromArray(
		[
			$rtfeldman$elm_css$Html$Styled$Events$onMouseUp($Orange_OpenSource$elm_advanced_grid$Grid$UserEndedMouseInteraction),
			$rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled(
			$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onLeave(
				function (_v0) {
					return $Orange_OpenSource$elm_advanced_grid$Grid$UserEndedMouseInteraction;
				}))
		]) : _List_Nil;
	var attributes = _List_fromArray(
		[
			$rtfeldman$elm_css$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$width(
					$rtfeldman$elm_css$Css$px(state.g.ea + $Orange_OpenSource$elm_advanced_grid$Grid$cumulatedBorderWidth)),
					$rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$auto),
					$rtfeldman$elm_css$Css$margin($rtfeldman$elm_css$Css$auto),
					$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative)
				]))
		]);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_Utils_ap(attributes, conditionalAttributes),
		state.g.er ? _List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$width(
								$rtfeldman$elm_css$Css$px(
									$Orange_OpenSource$elm_advanced_grid$Grid$gridWidth(state)))
							]))
					]),
				_List_fromArray(
					[
						$Orange_OpenSource$elm_advanced_grid$Grid$viewHeaderContainer(state)
					])),
				$Orange_OpenSource$elm_advanced_grid$Grid$viewGhostHeader(state),
				$Orange_OpenSource$elm_advanced_grid$Grid$viewRows(state)
			]) : _List_fromArray(
			[
				$Orange_OpenSource$elm_advanced_grid$Grid$viewHeaderContainer(state),
				$Orange_OpenSource$elm_advanced_grid$Grid$viewRows(state),
				$Orange_OpenSource$elm_advanced_grid$Grid$viewGhostHeader(state)
			]));
};
var $rtfeldman$elm_css$Css$Structure$PseudoElement = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$Preprocess$WithPseudoElement = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$pseudoElement = function (element) {
	return $rtfeldman$elm_css$Css$Preprocess$WithPseudoElement(element);
};
var $rtfeldman$elm_css$Css$after = $rtfeldman$elm_css$Css$pseudoElement('after');
var $rtfeldman$elm_css$Css$before = $rtfeldman$elm_css$Css$pseudoElement('before');
var $rtfeldman$elm_css$Css$angleConverter = F2(
	function (suffix, angleVal) {
		return {
			dZ: 0,
			U: 0,
			fl: _Utils_ap(
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
	var value = _v0.fl;
	return {
		k: 0,
		fl: A2(
			$rtfeldman$elm_css$Css$cssFunction,
			'rotate',
			_List_fromArray(
				[value]))
	};
};
var $rtfeldman$elm_css$Css$valuesOrNone = function (list) {
	return $elm$core$List$isEmpty(list) ? {fl: 'none'} : {
		fl: A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				function ($) {
					return $.fl;
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
var $Orange_OpenSource$elm_advanced_grid$Grid$viewClosebutton = A2(
	$rtfeldman$elm_css$Html$Styled$div,
	_List_fromArray(
		[
			$rtfeldman$elm_css$Html$Styled$Attributes$css(
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
				])),
			$rtfeldman$elm_css$Html$Styled$Events$onClick($Orange_OpenSource$elm_advanced_grid$Grid$UserClickedPreferenceCloseButton),
			A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'data-testid', 'configureDisplayCloseCross')
		]),
	_List_Nil);
var $Orange_OpenSource$elm_advanced_grid$Grid$UserToggledColumnVisibility = function (a) {
	return {$: 28, a: a};
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
						$rtfeldman$elm_css$Html$Styled$Attributes$id(columnConfig.b.n),
						$rtfeldman$elm_css$Html$Styled$Attributes$type_('checkbox'),
						$rtfeldman$elm_css$Html$Styled$Attributes$checked(columnConfig.b.aK),
						$rtfeldman$elm_css$Html$Styled$Events$onClick(
						$Orange_OpenSource$elm_advanced_grid$Grid$UserToggledColumnVisibility(columnConfig))
					]),
				_List_Nil),
				A2(
				$rtfeldman$elm_css$Html$Styled$label,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$marginLeft(
								$rtfeldman$elm_css$Css$px(5))
							])),
						$rtfeldman$elm_css$Html$Styled$Attributes$for(columnConfig.b.n)
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text(columnConfig.b.y)
					]))
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$viewPreferences = function (state) {
	var dataColumns = A2(
		$elm$core$List$filter,
		A2($elm$core$Basics$composeL, $elm$core$Basics$not, $Orange_OpenSource$elm_advanced_grid$Grid$isSelectionColumn),
		state.g.d6);
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						A3(
						$rtfeldman$elm_css$Css$border3,
						$rtfeldman$elm_css$Css$px(1),
						$rtfeldman$elm_css$Css$solid,
						$Orange_OpenSource$elm_advanced_grid$Grid$Colors$lightGrey2),
						$rtfeldman$elm_css$Css$margin($rtfeldman$elm_css$Css$auto),
						$rtfeldman$elm_css$Css$padding(
						$rtfeldman$elm_css$Css$px(5)),
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$px(state.g.ea * 0.6))
					]))
			]),
		A2(
			$elm$core$List$cons,
			$Orange_OpenSource$elm_advanced_grid$Grid$viewClosebutton,
			A2($elm$core$List$map, $Orange_OpenSource$elm_advanced_grid$Grid$viewColumnVisibilitySelector, dataColumns)));
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditorMsg = function (a) {
	return {$: 11, a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNode = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS = F4(
	function (a, b, c, d) {
		return {$: 3, a: a, b: b, c: c, d: d};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$NodeNS = F4(
	function (a, b, c, d) {
		return {$: 1, a: a, b: b, c: c, d: d};
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
			case 0:
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
			case 1:
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
			case 2:
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
			case 3:
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
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$EditorLostFocus = {$: 0};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserChangedValue = function (a) {
	return {$: 3, a: a};
};
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserSubmittedForm = function (a) {
	return {$: 4, a: a};
};
var $rtfeldman$elm_css$Html$Styled$form = $rtfeldman$elm_css$Html$Styled$node('form');
var $rtfeldman$elm_css$Html$Styled$Events$alwaysPreventDefault = function (msg) {
	return _Utils_Tuple2(msg, true);
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
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
var $Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$view = F2(
	function (model, item) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$form,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
									$rtfeldman$elm_css$Css$left(
									$rtfeldman$elm_css$Css$px(model.B)),
									$rtfeldman$elm_css$Css$top(
									$rtfeldman$elm_css$Css$px(model.a7))
								])),
							$rtfeldman$elm_css$Html$Styled$Events$onSubmit(
							$Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserSubmittedForm(item))
						]),
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$input,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$css(
									_List_fromArray(
										[
											$rtfeldman$elm_css$Css$flexGrow(
											$rtfeldman$elm_css$Css$num(1))
										])),
									$rtfeldman$elm_css$Html$Styled$Attributes$id($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$editorId),
									$rtfeldman$elm_css$Html$Styled$Events$onBlur($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$EditorLostFocus),
									$rtfeldman$elm_css$Html$Styled$Events$onInput($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$UserChangedValue),
									$rtfeldman$elm_css$Html$Styled$Attributes$value(model.fl)
								]),
							_List_Nil)
						]))
				]));
	});
var $Orange_OpenSource$elm_advanced_grid$Grid$viewStringEditor = function (state) {
	var _v0 = state.bP;
	if (!_v0.$) {
		var editedItem = _v0.a;
		var updatedStringEditorView = A2($Orange_OpenSource$elm_advanced_grid$Grid$StringEditor$view, state.aq, editedItem);
		return A2($rtfeldman$elm_css$Html$Styled$map, $Orange_OpenSource$elm_advanced_grid$Grid$StringEditorMsg, updatedStringEditorView);
	} else {
		return $Orange_OpenSource$elm_advanced_grid$Grid$noContent;
	}
};
var $Orange_OpenSource$elm_advanced_grid$Grid$view = function (_v0) {
	var state = _v0;
	return $rtfeldman$elm_css$Html$Styled$toUnstyled(
		state.bs ? $Orange_OpenSource$elm_advanced_grid$Grid$viewPreferences(state) : A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_List_fromArray(
				[
					$Orange_OpenSource$elm_advanced_grid$Grid$viewGrid(state),
					$Orange_OpenSource$elm_advanced_grid$Grid$viewStringEditor(state)
				])));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewGrid = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background-color', 'white'),
				A2($elm$html$Html$Attributes$style, 'margin-left', 'auto'),
				A2($elm$html$Html$Attributes$style, 'margin-right', 'auto'),
				A2($elm$html$Html$Attributes$style, 'color', '#555555')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$map,
				$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$GridMsg,
				$Orange_OpenSource$elm_advanced_grid$Grid$view(model.h))
			]));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$DisplayPreferences = {$: 0};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$HidePreferences = {$: 2};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$ResetFilters = {$: 3};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$SetAscendingOrder = {$: 5};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$SetDecendingOrder = {$: 6};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$SetFilters = {$: 4};
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
		'id:' + ($elm$core$String$fromInt(item.be.n) + (' - name: ' + (item.be.bl + ''))));
};
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewClickedItem = function (model) {
	var selectedItem = function () {
		var _v0 = model.bK;
		if (!_v0.$) {
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
	return {$: 7, a: a};
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
	var state = _v0;
	return A2(
		$elm$core$List$filter,
		function ($) {
			return $.fb;
		},
		state.m);
};
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewSelectedItems = function (model) {
	var selectedItems = $Orange_OpenSource$elm_advanced_grid$Grid$selectedAndVisibleItems(model.h);
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
				model.a9 ? A2($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewButton, 'Hide Preferences', $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$HidePreferences) : A2($Orange_OpenSource$elm_advanced_grid$Examples$LargeList$viewButton, 'Show Preferences', $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$DisplayPreferences),
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
		ey: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$init,
		fc: function (_v0) {
			return $elm$core$Platform$Sub$none;
		},
		fj: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$update,
		fm: $Orange_OpenSource$elm_advanced_grid$Examples$LargeList$view
	});
_Platform_export({'Examples':{'LargeList':{'init':$Orange_OpenSource$elm_advanced_grid$Examples$LargeList$main(
	$elm$json$Json$Decode$succeed(0))(0)}}});}(this));