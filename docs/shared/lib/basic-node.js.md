# BasicNode

The ```BasicNode``` serves as the base class for any ```bsNode```. It is mainly responsible for storing meta information and node properties.

## Brief

A glance of the structure of ```BasicNode```.

data members | description | rationale
--- | --- | ---
```_id``` | A unique ID in ```bson``` format. | Each ```bsNode``` should have a unique identifier.
```class``` | The constructor of the child class. | The ```BasicNode``` should store info on the child class, so it may derive properties from its child class.
```props``` | A ```json``` representative of the ```bsNode``` properties. | Each ```bsNode``` should contain some properties, and the parent class would be the best place to store them.
```observers``` | An array of ```json``` containing callback functions. | Whenever a ```bsNode``` completes execution, it must propagate its outputs to the next nodes. The callback functions serve this purpose.
```callbacks``` | An array containing callback functions. | Whenever a ```bsNode``` has a state change, it must notify the UI.
```instance``` | A ```json``` containing the current state of the ```bsNode```. | A ```bsNode``` may have its state changed upon events such as reset and execute. This data member contains the current state, and upon reset the states are copied from its ```props``` to restore original state.

member functions | description | rationale
--- | --- | ---
```reset()``` | Resets the ```bsNode``` into its original state. | A ```bsNode``` can be reused if it can be reset.
```execute()``` | Executes the ```bsNode``` and update outputs at ```this.instance.outputs```. | This serves as the core payload of the ```bsNode```.
```sendOnReady(output, input)``` | Registers an observer to the ```bsNode```. | This instructs the ```bsNode``` to propagate its outputs to the next node, given its own outbound port and the target's inbound port.
```revokeSendOnReady(output, input)``` | Removes a registered observer. | The reverse of ```this.sendOnReady```, which allows the user to undo an observer registration.
```registerCallback(callback)``` | Registers a callback. | The UI can be notified of any state changes or errors.
```receive(port, data, propagate = true)``` | Receives data at a port. | The ```bsNode``` receives data at a specific port, and may automatically execute when it is ready, controlled by rhe ```propagate``` flag.
```isReady()``` | Checks if a ```bsNode``` is ready to execute. | A ```bsNode``` is ready to be executed when all its inbound ports are ready and with a value other than ```undefined```.
```setProps(props = {})``` | Sets the node properties, and resets the node. | This allows a node's property to be changed by the user.
```getInboundPort(port)``` | Returns a ```json``` containing a setter function for an inbound port. | This allows another ```bsNode``` to store the setter function for later use, for example when it is ready to propagate.
```getOutboundPort(port)``` | Returns a ```json``` containing a getter function for an outbound port. | This allows another ```bsNode``` to store the getter function for later use in order to get the realtime data at the outbound port.
```serialize()``` | Returns a serialized form of the ```bsNode```. | MongoDB cannot store class objects as it only accept ```json``` type documents, therefore it is necessary to write a serialization method, which returns a ```json``` that can be deserialized back into a class instance later.

## Design

Following the strategy of functional programming, a ```Program``` should be defined as a complex function build with simpler functions. This inspired the design of the building block.

> The basic build block would be ```Function```, which is visualized by ```Node```.

Back in elementary school math, people are taught the idea that a function is like a *black box* (machine), that takes some input and returns some output. We take the idea, and used ```Node``` to visualize such black box. A ```Node``` would take in data from input ports, execute, and propogate the result to its output ports.

The executor function of each ```Node``` plays the role of the main payload of the *black box*. The function accepts two parameters, ```props``` (configuration settings) and ```inputs``` (function inputs). The executor function returns a ```Promise``` which resolves to a result, as there is no prediction to when the execution completes.

```JavaScript
static executor = (props, inputs) => {
	return new Promise((resolve, reject) => {
		// payload
	});
};
```

After execution, the ```Node``` must then pass on its results to its outputs, and also propagate the data to other nodes. Note that ```this.class.executor``` refers to the ```executor``` function mentioned above.

```JavaScript
execute() {
	return new Promise((resolve, reject) => {
		// executor payload
		this.class.executor(this.props, this.instance.inputs).then((result) => {
			// pass results to output ports
			Object.keys(this.instance.outputs).forEach((key) => {
				this.instance.outputs[key] = result[key];
			});
			// propagate data to other nodes
			this.observers.forEach((item) => {
				item.func();
			});
			// notify UI
			this.callbacks.forEach((callback) => {
				callback(null, this);
			});
			resolve(result);
		}).catch((err) => {
			// an error occured
			// do not propagate data
			this.callbacks.forEach((callback) => {
				callback(err, this);
			});
			reject(err);
		});
	});
}
```

## Development Journal

This jounral highlights some of the critical commits regarding the development of ```basic-node.js```.


### commit 4bc348258d8f274f7879d6ed6a7dd38b9b880e6a

Feb 1, 2019

Front end requested a mechanism in which a callback function may be registered, such that the UI may be notified of any state changes. The states in which the callbacks are triggered include:

- on ```Node``` reset
- on ```Node``` execution complete

An extra data member ```this.callbacks``` is therefore needed. The callback function would follow the NodeJS callback standard.

```JavaScript
//sample callback
(err, res) => {
	if (err) {
		throw err;
	}
	// res will be an instance of Node
}
```

callback functions may be registered via the new method ```registerCallback```.

### commit 43d5f6fd717516f63958752f9914e45d9abd5fd5

Jan 9, 2019

A large scale reimplementation is decided as the ```BasicNode``` class contains many redundant data members. The file is wiped clean, and rebuilt with a much simpler design, with previous experience in mind.

A data member ```this.cache``` was used to store an old copy of the properties, so the ```bsNode``` may be reset by copying the props back from this variable. This idea is dropped as the properties may now be derived from its child classes instead. The corresponding child class of a ```bsNode``` may now be found by ```this.class```.

The constructor of ```BasicNode``` is therefore reworked. The code is much cleaner with much better performance as deep copying is no longer required.

```JavaScript
constructor(args) {
	this._id = new ObjectID().toHexString();
	this.class = args['class'];
	this.setProps(args['props']);
	this.observers = [];
	this.reset();
}
```

The execution function is also now derived from the child class. It now returns a JavaScript Promise, as there are plans to support async functions in future. This implementation makes the ```BasicNode``` much more flexible.

```JavaScript
execute() {
	return new Promise((resolve, reject) => {
		this.class.executor(this.instance.props, this.instance.inputs).then((result) => {
			Object.keys(this.instance.outputs).forEach((key) => {
				this.instance.outputs[key] = result[key];
			});
			this.observers.forEach((item) => {
				item.func();
			});
			resolve(result);
		});
	});
}
```

### commit 45a8ceae3f662230573ccf8c42eae879644c7065

Sep 29, 2018

It is decided that the ```bsNode``` has to be serializable. However ```this.observers``` is currently an array of callback functions, which are not serializable to ```json``` format. The structure of ```this.observers``` needs to be modified.

The new design as follows. ```this.observers``` is now an array of ```json``` containing the callback function as well as port names and target ```bsNode``` ID.

```JavaScript
this.observers = [
	...this.observers,
	{
		_id: input._id,
		outbound: output.port,
		inbound: input.port,
		func: (() => {
			input.func(output.func());
		})
	}
];
```

Class methods ```getInboundPort``` and ```getOutboundPort``` also needs to be updated.

```JavaScript
getInboundPort(port) {
	return {
		_id: this._id,
		port: port,
		func: ((output) => {
			this.receive(port, output);
		})
	};
}
```

Finally the ```serialize``` method may be implemented.

```JavaScript
serialize() {
	return {
		_id: this._id,
		class: this.instance.cache.class,
		args: this.instance.cache.args,
		observers: this.observers.map((item) => {
			return {
				_id: item._id,
				outbound: item.outbound,
				inbound: item.inbound
			};
		})
	}
}
```

### commit 3460052fa1ac7de8969aa9d6b9dbbd9a714e410a

Aug 22, 2018

```BasicNode``` is designed to serve as the base class of any ```bsNode```. The design of ```BasicNode``` focuses on storing all necessary information required to map a visualization Node to a Function.

We may see a breakdown of the ```BasicNode```:
- ```this.args``` stores the node properties
- ```this.instance``` stores the node states
	- ```props``` is a copy of the node props
	- ```input``` stores the input ports
	- ```output``` stores the output ports
	- ```execute``` stores the entire execution function
- ```this.observers``` stores an array of callback functions

An initial attempt to implement ```constructor```.

```JavaScript
constructor(args) {
	this.args = args;
	this.instance = {
		props: args.props,
		input: args.input.reduce((accumulator, current) => {
			return Object.assign({}, accumulator, {
				[current]: undefined
			});
		}, {}),
		execute: args.execute,
		output: args.output.reduce((accumulator, current) => {
			return Object.assign({}, accumulator, {
				[current]: undefined
			});
		}, {})
	};
	this.observers = [];
}
```

An initial attempt to implement ```getInboundPort``` and ```getOutboundPort```.

```JavaScript
getInboundPort(port) {
	return ((output) => {
		this.receive(port, output);
	});
}
```
```JavaScript
getOutboundPort(port) {
	return (() => {
		return this.instance.output[port];
	});
}
```
```JavaScript
getOutboundPort(port) {
	return {
		_id: this._id,
		port: port,
		func: (() => {
			return this.instance.output[port];
		})
	};
}
```

Instead of trivial getters and setters, it is decided that these class methods should return getter and setter functions itself. This allows other classes to store the getter and setter functions, and invoke them whenever necessary, while preserving realtime data.

For example, the following implementation would be deemed wrong, as the output port returned is stale data.

```JavaScript
getOutboundPort(port) {
	return this.instance.output[port];
}
```

The execution function is quite trivial, which returns the result directly.

```JavaScript
execute() {
	let result = this.instance.execute(this.instance.props, this.instance.input);
	Object.keys(this.instance.output).forEach((key) => {
		this.instance.output[key] = result[key];
	});
	this.observers.forEach((item) => {
		item();
	});
	return this.instance.output;
}
```
