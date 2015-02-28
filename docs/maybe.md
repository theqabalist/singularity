# Maybe/Option Monad

Represents a value which may or may not exist.  Semantically, operations continue on a Just, and do not execute on a None.

## Construction
This type has two public constructors which are ```Just``` and ```None``` which take 1 argument and 0 arguments respectively.

However, there is also a semi-intelligent constructor on the Maybe itself, which will coerce based on existence of value.  Any value that is ```undefined``` or ```null``` is a None and everything else is a Just.

```javascript
var s = require("singularity").monad,
    myJust = s.Maybe.from(5),
    myNone = s.Maybe.from(undefined),
    printer = s.Maybe
        .destructure()
        .Just(function (x) { console.log(x); })
        .None(function () {});

printer(myJust); // prints 5
printer(myNone); // nothing prints
```

It is possible to do ```s.Just.from(undefined)```, but for semantic reasons, this is discouraged unless this is **really** the behavior you are looking for.
