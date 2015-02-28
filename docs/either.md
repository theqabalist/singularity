# Either Monad

Represents a value or an error, semantically represented as a Right value and a Left value respectively.  Semantically, operations proceed on a Right, and do not execute on a Left.  Unlike a Maybe, a Left state gives insight into the nature of the failure.

## Construction
This type has two public constructors which are ```Right``` and ```Left``` which both take 1 argument.

```javascript
var s = require("singularity").monad,
    myRight = s.Right.from(5),
    myLeft = s.Left.from(10),
    extract = s.Maybe
        .destructure()
        .Right(function (x) { return x; })
        .Left(function (x) { return x; });

console.log(extract(
    myRight
        .map(function (x) { return x + 5; })
        .flatMap(function (x) {
            var val;
            try {
                val = s.Right.from(brittlePIDRead(x));
            } catch (e) {
                val = s.Left.from(e);
            }
            return val;
        })
        .map(function (x) { return capitalize(x); })
)); // will print a string if brittlePIDRead succeeds, and an exception if it fails
```