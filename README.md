# Custom Types Serializer

[![npm](https://img.shields.io/npm/v/custom-types-serializer/latest.svg)](https://www.npmjs.com/package/custom-types-serializer) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Serialization made finally easy. This library enables you to:

- Write custom serializers for any javascript classes, objects or functions.
- Combine serializers to serialize objects with properties of different types.
- Split serialization and deserialization into separate files (reduces bundle size in some cases).
- Serialize most common javascript types with built-in serializers.
- Preserve javascript references (including circular) with a built-in serializer.

This library takes advantage of replacer and reviver callbacks provived by [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters) and [JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#parameters).

## Installation

```bash
yarn add custom-types-serializer
```

Playground - https://codesandbox.io/s/custom-types-serializer-z6onp

## Usage

### Serialize Javascript

Serialize most common javascript types with built-in `jsSerializer`/`jsDeserializer`.

```javascript
import { jsSerializer, jsDeserializer } from "custom-types-serializer";

const data = {
  error: new Error("Something went wrong."),
  symbol: Symbol("test"),
  set: new Set([new Date(1234567890), undefined, NaN, -0, 123n, /^(?=abc).*$/i]),
};
const serialized = JSON.stringify(data, jsSerializer.getReplacer());
const deserialized = JSON.parse(serialized, jsDeserializer.getReviver());

console.log([...deserialized.set.values()][0].getTime()); // 1234567890
```

### Serialize Custom Types

Create custom serializers with `customType()`.

```javascript
import moment from "moment";
import { customType } from "custom-types-serializer";

const momentType = customType("Moment");
const momentSerializer = momentType.createSerializer(
  // Use `original` value because moment implements `.toJSON()`.
  (_value, { original }) => moment.isMoment(original),
  String
);
const momentDeserializer = momentType.createDeserializer((isoString) => moment(isoString));

const data = {
  date: moment("2018-06-26 17:30"),
};
const serialized = JSON.stringify(data, momentSerializer.getReplacer());
const deserialized = JSON.parse(serialized, momentDeserializer.getReviver());

console.log(deserialized.date.format("MMMM Do YYYY, h:mm:ss a")); // "June 26th 2018, 5:30:00 pm"
```

### Combine Serializers/Deserializers

Use `Serializer.combine(...serializers)` and `Deserializer.combine(...deserializers)` to apply multiple serializers to the same object.

Use `referenceSerializer`, `referenceDeserializer` to preserve references.

```javascript
import { Serializer, Deserializer, mapSerializer, mapDeserializer, referenceSerializer, referenceDeserializer } from "custom-types-serializer";

const mySerializer = Serializer.combine(referenceSerializer, mapSerializer);
const myDeserializer = Deserializer.combine(referenceDeserializer, mapDeserializer);

const data = new Map();
const circular = { data };
data.set("a", circular);
data.set("b", circular);

const serialized = JSON.stringify(data, mySerializer.getReplacer());
const deserialized = JSON.parse(serialized, myDeserializer.getReviver());

console.log(deserialized.get("a").data === deserialized); // true
console.log(deserialized.get("a") === deserialized.get("b")); // true
```

### Serialize Functions

```javascript
import { customType } from "custom-types-serializer";

const registeredFunctions = [];

const functionType = customType("Function");
const functionSerializer = functionType.createSerializer(
  (x) => typeof x === "function",
  (fn) => registeredFunctions.push(fn) - 1
);
const functionDeserializer = functionType.createDeserializer((id) => registeredFunctions[id]);

const serialized = JSON.stringify(
  {
    doSmth() {
      return "okay";
    },
  },
  functionSerializer.getReplacer()
);
const deserialized = JSON.parse(serialized, functionDeserializer.getReviver());

console.log(deserialized.doSmth()); // "okay"
```
