# Reader/Environment/Function Monad
Represents a calculation which relies on a value provided later.

## Construction
This type has no public constructors, it is abstract.  A few factories exist:

* Reader.mreturn
* Reader.ask (see below)
* Reader.asks (see below)
* Reader.local (see below)

## Interface
Aside from the standard ```fmap```, ```ap```, and ```mbind```, the Reader type has a few more helpers.

### #ask, #asks(f), #local(f)
These methods exist to provide a more pleasant code structure than using the constructors directly.  It takes this

```javascript
var env = {
        envSize: 2,
        random: "other"
    },
    r = Reader.asks(prop("envSize")).mbind(function (size) {
        return Reader.local(function () { return {a: 1, b: 2}; }, Reader.mreturn(5).mbind(function (v) {
            return Reader.ask().mbind(function (env) {
                return Reader.mreturn(size + v + env.a);
            });
        })).mbind(function (v2) {
            return Reader.asks(prop("envSize")).mbind(function (size2) {
                return Reader.mreturn(v2 + size2);
            });
        });
    });
expect(r.run(env)).toBe(10);
```

and turns it into this

```javascript
var env = {
        envSize: 2,
        random: "other"
    },
    r = Reader.mreturn(5)
        .asks(prop("envSize"), function (size, v) {
            return Reader.mreturn(size + v);
        })
        .local(function () { return {a: 1, b: 2}; }, function (v) {
            return Reader.ask().mbind(function (env) {
                return Reader.mreturn(env.a + v);
            });
        })
        .asks(prop("envSize"), function (size, v2) {
            return Reader.mreturn(size + v2);
        });

expect(r.run(env)).toBe(10);
```

Which is basically to say that they are special versions of mbind that allow you to do two things at once so you don't
have to nest things to maintain context for combinatorial operations. However, there are limitations
to this approach which is namely that a call to ```ask```, ```asks```, or ```local``` is only good for the function it is used in.
If a value is required by a subsequent chained call, then nesting will be required.

### #local(f)
The local method exists to allow modification of the value provided to the reader.

```javascript
var env = "hello",
    r = Reader
        .mreturn(11)
        .local(function (x) { return x + " world"; }, function (v) {
            return Reader.ask().mbind(function (e) {
                return Reader.mreturn(e.length === v);
            });
        });
expect(r.run(env)).toBe(true);
```

Evaluations in the local context, as expected, only extend to the reader provided by the second function.  The
environment the resumes its previous state.

### #run(e)
As the reader represents a computation dependent on a provided value, ```run``` is the way to provide that value.