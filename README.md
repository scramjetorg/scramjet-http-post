Scramjet HTTP POST
-------------------

[![Greenkeeper badge](https://badges.greenkeeper.io/signicode/scramjet-http-post.svg)](https://greenkeeper.io/)

A simple HTTP server providing a stream of HTTP POST payloads in scramjet.


## API

The module exposes the following methods:

### scHTTP.body

`scHTTP.body([scramjet, ]server)` - a stream of post contents sent to the given server.

Arguments:

* `server` - your HTTP server

Currently suppotes POST content-types:

* `application/json` and `text/json`
* `application/form-data`

**Example**

Grabs "votes" off a http server and pushes to command line.

```javascript
    const scramjet = require("scramjet");
    const server = require("http").createServer().listen(6080);
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

As of version 2.0 Scramjet is MIT Licensed and as of 1.0.0 so is this module.
