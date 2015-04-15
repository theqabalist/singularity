# Task Monad
Represents instructions for an asynchronous effectful action that may fail. It is, in effect, a Async[Either[Error, T]]. See [async](./async.md) for the underlying asynchronous monad.

## Construction
This type has no public constructors, it is abstract. Tasks may be constructed 
with the following static functions:
	* mreturn -- lifts a pure value into a Task context
	* callback -- constructs a task from a callback function. The input function
	  should accept as its only parameter a function. Upon being called, this function should run perform the asynchronous task and pass an Either[Error, T] to the paramater it receives.
    * delay -- Wraps a thunk in a setTimeout call using callback. This is useful 
      should you have a long running computation that you would like to break into pieces to free up the event loop.
	* node -- Converts any node style asynchronous function into a 
	  function that accepts 1 fewer parameters and returns a task

## Usage
Please see [here](../examples/task.example.js)

## #$(initial)
This method is used to run the asynchronous action. Pass it a single callback function that will receive the result of the task chain as an either