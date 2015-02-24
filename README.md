# singularjs
The goal of singular is to provide reference implementations for all major monads documented [here](http://en.wikipedia.org/wiki/Monad_%28functional_programming%29).

These include:

* Maybe/Option
* IO
* State
* Environment/Reader
* Writer
* Continuation

In addition to these documented, additional monads in the likeness and vain of Haskell are:

* Either
* Validation

As all monads are applicatives, and all applicatives are functors, the following methods should be guaranteed on each type:

* map (functor map)
* ap (applicative apply)
* flatMap (monadic bind)
* from (constructor method)

Additionally, on the type constructors are provided

* destructure (provides basic type pattern matched dispatch)
* from (available where sensible, acts as a semi-intelligent constructor or return function)
* lift (lifts a function into a monadically aware function)

## Algebraic Data Type
Because javascript has no syntactic concept of algebraic data types, like Haskell does, a generic
type declaration facility was created in order to enable working with types of this nature.

### Declaration
In the algebraic module, there is a function ```data``` that has the signature ```data(abstractName, concreteSpec)```
In the concreteSpec is provided names for the subtypes and the number of contained data fields.
So
```javascript
type = adt.data("Maybe", {Just: 1, None: 0});
```
Declares a type called ```Maybe``` with two subtypes, ```Just``` and ```None```, which wrap 1 and 0
peices of data respectively.

### Implements
Using this type declaration we can now begin to implement methods against it, using the ```implements```
method.
```javascript
type.implements("map", {
    Just: function (v, f, t) { return t.Just.from(f(v)); },
    None: function (f, t) { return t.None.from(); }
});
```
This call will create a new type from the old one, so it is important to note that if for some reason
you are changing your type at runtime, old instances made before a type created after a call to any of
the type adjustment methods will not have any of the new methods.

The signature for the implementation methods is ```function(unwrappedData1..unwrappedDataN, methodArgs1...methodArgsN, typeContext)```.
Which is to say that any and all wrapped data in the type is exposed first, followed by any data that is called on the method,
followed finally by a type context so that access to the type and subtypes related to the implementing type are available.

### Static
For any methods that may make sense to have, but not make sense on a subtype basis, a "static" method provider exists.
```javascript
type.static("lift", function (f, t) {
    return t.Just(curry(f));
});
```
In this instance, it doesn't make sense to "lift" from a Just or a None, and because Javascript does not have
the best facility for type based dispatch unless you are using objects, we can't easily use and extend a polymorphic
```lift``` function, as we need to know what type we are lifting into.  Placing this on the t.Maybe object then makes
the most sense.

### Destructuring
Destructuring is a common form of pattern matching with algebraic data types in Haskell.  While full destructuring is not supported by ES5, a limited form of destructuring based on type is supported by the algebraic data type provider.
```javascript
var isJust = type.Maybe
    .destructure()
    .Just(function () { return true; })
    .None(function () { return false; }),
    inst = type.Just.from(5);

isJust(inst) === true;
```
