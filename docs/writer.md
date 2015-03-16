# Writer Monad
Represents a manner by which to collect auxiliary output during calculation.

## Construction
This type has no public constructors, it is abstract.  A few factories exist:

* Writer.mreturn(zero, val)
* Writer.typed(mType).mreturn(val) -- for providing the monoidal type ahead of time

Unlike other monads, this type requires a particular interface on the collector type, which is that it needs to be
monoidal, which is to say it needs to supply an mzero on the type, which returns an instance which must define mappend.
Obviously this type should obey the monoidal laws.

The singularity Arr type is an array backed monad+monoid in nature, and conforms to these restrictions.

```javascript
function add5(v) {
    return Writer.mreturn(Arr.mreturn("added 5"), v + 5);
}

function mult5(v) {
    return Writer.mreturn(Arr.mreturn("mult by 5"), v * 5);
}
var aWriter = Writer.typed(Arr),
    w = aWriter.lift(function (a, b) { return a + b; }),
    m1 = aWriter.mreturn(0).mbind(add5),
    m2 = aWriter.mreturn(2).mbind(mult5);
expect(w.ap(m1).ap(m2).output().toJs()).toEqual(["added 5", "mult by 5"]);
```

Here you can see use of the ```typed``` factory which relieves you from having to do this otherwise:

```javascript
function add5(v) {
    return Writer.mreturn(Arr.mreturn("added 5"), v + 5);
}

function mult5(v) {
    return Writer.mreturn(Arr.mreturn("mult by 5"), v * 5);
}
var w = Writer.lift(Arr.mzero(), function (a, b) { return a + b; }),
    m1 = Writer.mreturn(Arr.mzero(), 0).mbind(add5),
    m2 = Writer.mreturn(Arr.mzero(), 2).mbind(mult5);
expect(w.ap(m1).ap(m2).output().toJs()).toEqual(["added 5", "mult by 5"]);
```

It's not a huge gain, but it makes the code a little bit more readable without the extra noise of the mzero call.

## Interface
Aside from the standard ```fmap```, ```ap```, and ```mbind```, the Writer type has a few more helpers.

### #output()
Is used to retrieve the monoidal collector.

### #data()
Is used to retrieve the value.
