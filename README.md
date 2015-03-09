### <p align="center"><img src="docs/logo.png" height="192" /></p>

# singularity
The goal of singularity is to provide reference implementations for [all major monads](http://en.wikipedia.org/wiki/Monad_%28functional_programming%29), <i>[all major monad transformers](http://en.wikipedia.org/wiki/Monad_transformer)</i>, <i>[a selection of comonads](http://en.wikipedia.org/wiki/Monad_(functional_programming)#Comonads)</i> and <i>[arrows](http://en.wikipedia.org/wiki/Arrow_%28computer_science%29)</i>.

Italicized concepts are not yet implemented in any fashion.  This is because during primary development of this library, this document functions as both a record and spec.

[![Build Status](https://travis-ci.org/theqabalist/singularity.svg?branch=master)](https://travis-ci.org/theqabalist/singularity) [![Circle CI](https://circleci.com/gh/theqabalist/singularity.svg?style=svg)](https://circleci.com/gh/theqabalist/singularity)


## Monads

* [Maybe/Option](docs/maybe.md)
* [IO](docs/io.md)
* [State](docs/state.md)
* [Environment/Reader](docs/reader.md)
* [Writer](docs/writer.md)
* <i>Continuation</i>

In addition to these documented in wikipedia, additional monads provided are:

* [Either](docs/either.md)
* <i>Validation</i>
* <i>Future (effectful)</i>
* Arr (Array)
* <i>List (Linked List)</i>

As all monads are applicatives, and all applicatives are functors, the following methods should be guaranteed on each instance:

* map (functor map)
* ap (applicative apply)
* mbind (monadic bind)

On the type constructors are provided

* from (constructor method)

On the types proper are provided

* destructure (provides basic type pattern matched dispatch)
* from (return function)
* lift (lifts a function into a monadically aware function)

## <i>Monad Transformers</i>
* <i>Option Transformer</i>
* <i>Exception Transformer</i>
* <i>Reader Transformer</i>
* <i>State Transformer</i>
* <i>Writer Transformer</i>
* <i>Continuation Transformer</i>

## <i>Comonads</i>
* <i>Product</i>
* <i>Function</i>
* <i>Costate</i>

## Algebraic Data Type
Because javascript has no syntactic concept of algebraic data types, like Haskell does, a generic
type declaration facility was created in order to enable working with types of this nature.

### Declaration
In the algebraic module, there is a function ```data``` that has the signature ```data(name, constructors)```
In the concreteSpec is provided names for the type constructors and the number of contained data fields.
So
```javascript
type = adt.data("Maybe", {Just: 1, None: 0});
```
Declares a type called ```Maybe``` with two constructors, ```Just``` and ```None```, which wrap 1 and 0
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
For any methods that may make sense to have, but not make sense on a instance, a "static" method provider exists.
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

### Abstract Types
Hiding type constructors can allow for more abstract code as all construction must be done through factories.  Abstract types cause 2 notable restrictions:

* No access to type constructors (type.Just would be undefined but type.Maybe would be available)
* No access to destructuring against constructor types, except inside builder context.

```javascript
var t = type.abstract();
t.Just === undefined; // true
t.Maybe.destructure === undefined; // true
t = t.implements("contrive", {
    Just: function (x, m, t) {
        return t.Maybe.destructure()
            .Just(function (v) { return x + v; })
            .None(function () { return undefined; })(m); // this is allowed
    },
    None: function (m, t) {
        return undefined;
    }
});
```

## Installation

Available from npm:

```
npm install singularity
```

Or available in single compressed artifact from [releases](https://github.com/theqabalist/singularity/releases) (good for web usage).
