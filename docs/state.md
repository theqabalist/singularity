# State Monad
Represents a calculation which relies on a value provided later, which will be updated
during calculation.

## Construction
This type has one public constructor ```state``` that takes 1 argument, which is
a function of type ```s -> (t, s)```.

This type has numerous factories as well:

* State.from
* State.get (see below) -- retrieve the state
* State.gets (see below) -- query the state
* State.put (see below) -- replace the state
* State.modify (see below) -- change the state with a function

## Usage
Please see [example1](../examples/state.example1.js) and [example2](../examples/state.example2.js)

## Interface
Aside from the standard ```fmap```, ```ap```, and ```flatMap```, the State type has a few more helpers.

### #get(), #gets(f), #put(s), #modify(f)
These methods exist to provide a more pleasant code structure than using the constructors directly.
It is similar to the convenience methods on the [Reader](reader.md), and shares the same limitations
which is namely that a call to ```get``` or ```gets``` is only good for the function it is used in.
If a value is required by a subsequent chained call, then nesting will be required.

### #run(state)
This is used to execute the monad with an initial state.

### #evalState(state)
This is used to execute the monad with an initial state and return the result.

### #execState(state)
This is used to execute the monad with an initial state and return the final state.