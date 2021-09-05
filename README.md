# Custom Types Serializer

[![npm](https://img.shields.io/npm/v/custom-types-serializer/latest.svg)](https://www.npmjs.com/package/custom-types-serializer)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Enables you to serialize any custom javascript type or structure of any complexity.

Comes with a pre-built `jsSerializer` for most common javascript types.

Provides `Serializer.create()` and `Serializer.combine()` for implementing and reusing your own serializer plugins.

### Installation

```bash
yarn add custom-types-serializer
```

<b>3Kb</b> minified.

Playground - https://codesandbox.io/s/custom-types-serializer-z6onp

### Simple Usage

```javascript
import { jsSerializer, createReplacer, createReviver } from "custom-types-serializer";

const object = {
  error: new Error("Something went wrong."),
  symbol: Symbol("test"),
  set: new Set([new Date(12345), undefined, NaN, -0, 123n, /^(?=abc).*$/g]),
};
const serialized = JSON.stringify(object, createReplacer(jsSerializer));
const deserialized = JSON.parse(serialized, createReviver(jsSerializer));

[...deserialized.set.values()][0].getTime(); // <- 12345
```

### Advanced Usage

Create your own serializable custom types with `customType()`.

```javascript
import moment from "moment";
import { customType, createReviver, createReplacer } from "custom-types-serializer";

const data = { date: moment("2018-06-27 17:30") };
const serialized = JSON.stringify(
  data,
  createReplacer((value, { parent, key }) => {
    // Use `parent[key]` to access the original value, because moment implements `.toJSON()`.
    if (moment.isMoment(parent[key])) {
      return customType("Moment", value);
    }
    return value;
  })
);
const deserialized = JSON.parse(
  serialized,
  createReviver((value, type) => {
    if (type === "Moment") {
      return moment(value);
    }
    return value;
  })
);

deserialized.date.format("MMMM Do YYYY, h:mm:ss a"); // <- "June 27th 2018, 5:30:00 pm"
```

### Using `.toJSON()`

```javascript
import { customType, createReviver } from "custom-types-serializer";

class MyClass {
  subClasses = [new MySubClass(), new MySubClass()];
  toJSON() {
    return customType("MyClass", { subClasses: this.subClasses });
  }
}
class MySubClass {
  state = { randomValue: Math.random() };
  getValue() {
    return this.state.randomValue;
  }
  toJSON() {
    return customType("MySubClass", { state: this.state });
  }
}

const instance = new MyClass();
const serialized = JSON.stringify(instance);
const deserialized = JSON.parse(
  serialized,
  createReviver((value, type) => {
    if (type === "MySubClass") {
      const mySubClass = new MySubClass();
      mySubClass.state = value.state; // hydrate MySubClass instance
      return mySubClass;
    }
    if (type === "MyClass") {
      const myClass = new MyClass();
      myClass.subClasses = value.subClasses; // hydrate MyClass instance
      return myClass;
    }
    return value;
  })
);

deserialized.subClasses[1].getValue() === instance.subClasses[1].getValue(); // <- true
```

### Pluggable Serializers

Use `Serializer.create` and `Serializer.combine` to create and combine custom serializers.

```javascript
import { Serializer, createReplacer, createReviver, jsSerializer } from "custom-types-serializer";

const registeredFunctions = [];
const functionSerializer = Serializer.create(
  "Function", // give unique id
  (x) => typeof x === "function", // check
  (fn) => registeredFunctions.push(fn) - 1, // replace with serializable
  (id) => registeredFunctions[id] // revive
);

const serialized = JSON.stringify(
  {
    doSmth() {
      return "okay";
    },
  },
  createReplacer(functionSerializer)
);
const deserialized = JSON.parse(serialized, createReviver(functionSerializer));

deserialized.doSmth(); // <- "okay"

export const mySerializer = Serializer.combine(jsSerializer, functionSerializer);
// Use `mySerializer` to serialize most js types and functions.
```
