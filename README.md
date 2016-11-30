## Usage (I hope...)

Grabs votes off a http server and pushes to command line.

```javascript
    const scramjet = require("scramjet");
    const server = require("http").createServer();
    const scHTTP = require("scramjet-http-post");

    scHTTP.body(scramjet, server)
        .filter((data) => (data && typeof data === "object" && !isNaN(+data.vote) && typeof data.for === "string"))
        .map((data) => ({
            contestant: data.for.substr(0, 1).toUpperCase(),
            vote: data.vote <= 256 && data.vote >= 0 && +data.vote || NaN
        }))
        .filter((nr) => (console.log(nr), !isNaN(nr.vote)))
        .map((vote) => "F:" + vote.contestant + ",V:" + vote.vote.toString(16))
        .on("error", (err) => console.log(err && err.stack))
        .pipe(process.stdout);
```

## License and contributions

As of version 2.0 Scramjet is MIT Licensed and so is this module.
