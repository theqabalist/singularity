singularjs
==========
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

* fold (reduce/extract)
* map (functor map)
* ap (applicative apply)
* flatMap (monadic bind)

Additionally, on the type constructors are provided

* from (acts as a semi-intelligent constructor or return function)
* liftM (lifts a function into a monadically aware function)
