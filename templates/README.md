# MMM-SmartCloset

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Thinking about what to wear for the day? This Module is here to simplify your everyday looks by allowing you to see it displayed as you get ready for the day.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-SmartCloset',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `option1`        | *Required* DESCRIPTION HERE
| `option2`        | *Optional* DESCRIPTION HERE TOO <br><br>**Type:** `int`(milliseconds) <br>Default 60000 milliseconds (1 minute)
