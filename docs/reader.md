# Reader/Environment/Function Monad
Represents a calculation which relies on a value provided later.

## Construction
This type has no public constructors, it is abstract.  A few factories exist:

* Reader.from
* Reader.ask (see combine below)
* Reader.asks (see combine below)

## Interface
Aside from the standard ```fmap```, ```ap```, and ```flatMap```, the Reader type has a few more helpers.

### #combine
The combine method exists to provide a more pleasant code structure when using the ask/asks constructs.  It takes this

```javascript
var env = {
        envSize: 2,
        random: "other"
    },
    r = Reader.from(5)
        .flatMap(function (v) {
            return Reader.asks(prop("envSize"))
                .flatMap(function (size) {
                    return Reader.ask()
                        .flatMap(function (e) {
                            return Reader.from(size + v === Object.keys(e).length + v);
                        });
                });
        });
expect(r.run(env)).toBe(true);
```

and turns it into this

```javascript
var env = {
        envSize: 2,
        random: "other"
    },
    r = Reader.from(5)
        .combine(prop("envSize"), function (size, v) {
            return Reader.from(size + v);
        })
        .combine(function (env, v) {
            return Reader.from(Object.keys(env).length + 5 === v);
        });

expect(r.run(env)).toBe(true);
```

Which is basically to say that it is a special version of flatMap that allows you to do two things at once so you don't have to nest things to maintain context for combinatorial operations.

### #local
The local method exists to allow modification of the value provided to the reader.

```javascript
var env = "hello",
    r = Reader
        .from(11)
        .combine(function (env, v) {
            return Reader.from(env.length === v);
        })
        .local(function (x) { return x + " world"; });
expect(r.run(env)).toBe(true);
```

It is important to note that because the reader abstracts a sort of function composition, "procedural" looking things like the call to ```local``` are actually evaluated backward.  This means calls to ```local``` need to come spatially **after** the computational peices that require the modified context.

### #run
As the reader represents a computation dependent on a provided value, ```run``` is the way to provide that value.