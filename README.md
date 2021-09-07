# Custom Types Serializer

[![npm](https://img.shields.io/npm/v/custom-types-serializer/latest.svg)](https://www.npmjs.com/package/custom-types-serializer) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Serialization made finally easy. This library enables you to:

1. Write custom serialization plugins for any javascript classes, objects or functions.
2. Combine plugins together so that objects containing values of different types can be serialized.
3. Split serialization/deserialization to separate files (reduces bundle size in some cases).
4. Serialize most common javascript types with built-in plugins.
5. Preserve javascript references (including circular) with a built-in plugin.

This library takes advantage of replacer/reviver callbacks provived by [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters) and [JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#parameters) respectively.

## Installation

```bash
yarn add custom-types-serializer
```

Playground - https://codesandbox.io/s/custom-types-serializer-z6onp

## Usage

### Serialize Javascript

Serialize most common javascript types with built-in `jsReplacer`/`jsReviver`.

```javascript
import { jsReplacer, jsReviver } from "custom-types-serializer";

const data = {
  error: new Error("Something went wrong."),
  symbol: Symbol("test"),
  set: new Set([new Date(1234567890), undefined, NaN, -0, 123n, /^(?=abc).*$/g]),
};
const serialized = JSON.stringify(data, jsReplacer.getCallback());
const deserialized = JSON.parse(serialized, jsReviver.getCallback());

[...deserialized.set.values()][0].getTime(); // 1234567890
```

### Serialize Custom Types

Write your own serialization plugins with `customType()`.

```javascript
import moment from "moment";
import { customType } from "custom-types-serializer";

const momentType = customType("Moment");
const momentReplacer = momentType.createReplacer(
  // Use `original` value because moment implements `.toJSON()`.
  (_value, { original }) => moment.isMoment(original),
  String
);
const momentReviver = momentType.createReviver((isoString) => moment(isoString));

const data = {
  date: moment("2018-06-26 17:30"),
};
const serialized = JSON.stringify(data, momentReplacer.getCallback());
const deserialized = JSON.parse(serialized, momentReviver.getCallback());

deserialized.date.format("MMMM Do YYYY, h:mm:ss a"); // "June 26th 2018, 5:30:00 pm"
```

### Combine Plugins

Use `Replacer.combine(...replacers)` and `Reviver.combine(...revivers)` to combine plugins.

Use `referenceReplacer`, `referenceReviver` to preserve references.

```javascript
import { Replacer, Reviver, mapReplacer, mapReviver, referenceReplacer, referenceReviver } from "custom-types-serializer";

const myReplacer = Replacer.combine(referenceReplacer, mapReplacer);
const myReviver = Reviver.combine(referenceReviver, mapReviver);

const data = new Map();
const circular = { data };
data.set("a", circular);
data.set("b", circular);

const serialized = JSON.stringify(data, myReplacer.getCallback());
const deserialized = JSON.parse(serialized, myReviver.getCallback());

deserialized.get("a").data === deserialized; // true
deserialized.get("a") === deserialized.get("b"); // true
```

### Serialize Functions

```javascript
import { customType } from "custom-types-serializer";

const registeredFunctions = [];

const functionType = customType("Function");
const functionReplacer = functionType.createReplacer(
  (x) => typeof x === "function",
  (fn) => registeredFunctions.push(fn) - 1
);
const functionReviver = functionType.createReviver((id) => registeredFunctions[id]);

const serialized = JSON.stringify(
  {
    doSmth() {
      return "okay";
    },
  },
  functionReplacer.getCallback()
);
const deserialized = JSON.parse(serialized, functionReviver.getCallback());

deserialized.doSmth(); // "okay"
```
