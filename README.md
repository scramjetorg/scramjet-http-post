## Usage (I hope...)

Grabs votes off a http server and pushes to command line.

```javascript
    const scramjet = require("scramjet");
    const server = require("http").createServer();
    const scHTTP = require("scramjet-http-post");

    scHTTP.body(scramjet, server)
        .filter((data) => data && typeof data === "object" && +data.vote && typeof data.for === "string")
        .map((data) => ({
            contestant: data.for.substr(1),
            vote: data.vote <= 256 && data.vote >= 0 && +data.vote || NaN
        }))
        .filter((nr) => !Math.isNan(nr))
        .map((vote) => "F:" + data.for + ",V:" + data.vote.toString(16))
        .pipe(process.stdout);
```

## License and contributions

At this moment Scramjet is released under the terms of GPL-3.

## Disclamer

This release is sponsored by a bottle of a Cabernet Franc wine which to be franc
smells a little like a sweaty horse... But tastes surprisingly well...

I'll run this tomorrow when my intelligence drops to some responsible levels.
