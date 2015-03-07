# IO Monad
Represents a synchronous, effectful action.  For asynchronous-aware, effectful action, please see the Future monad.

## Construction
This type no public constructors, it is abstract.  A factory is provided as IO.from.

## Usage
Please see [here](../examples/io.example.js)

## #$(initial)
This method is used to actually performed the described IO type.