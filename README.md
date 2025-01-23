# Custom Types Serializer

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
