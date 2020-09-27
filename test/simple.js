const fetch = require("node-fetch");
const { URLSearchParams } = require('url');
const scHTTP = require("../");

module.exports = {
    async test_simple(test) {

        test.expect(1);

        const server = require("http").createServer();

        scHTTP.body(server)
            .filter((data) => (data && typeof data === "object" && !isNaN(+data.vote) && typeof data.for === "string"))
            .map((data) => ({
                contestant: data.for.substr(0, 1).toUpperCase(),
                vote: data.vote <= 256 && data.vote >= 0 && +data.vote || NaN
            }))
            .filter((nr) => !isNaN(nr.vote))
            .map((vote) => "F:" + vote.contestant + ",V:" + vote.vote.toString(16))
            .each(
                (voteString) => {
                    test.equals("F:X,V:a0", voteString);
                    server.close();
                    test.done();
                }
            );

        server.listen(27180);
        server.on("listening", () => {
            console.log("Server listening");
            fetch("http://localhost:27180/", {
                method: "POST",
                body: new URLSearchParams({
                    for: "Xavier",
                    vote: 160
                })
            })
            .then(
                r => {
                    console.log(r)
                }
            )
            .catch(
                (e) => test.ok(0, "The server should respond correctly")
            );
        })
    }
};
