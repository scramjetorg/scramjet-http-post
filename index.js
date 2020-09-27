const http = require("http");
const querystring = require("querystring");
const API_VERSION = 1;

const getScramjetVersion = (scramjet) => {
    if (!(scramjet = scramjet.API(API_VERSION)))
        throw new Error("Scramjet API version " + API_VERSION + " required!");

    return scramjet;
};

const makeServer = (callback, scramjet, server) => {
    if (scramjet instanceof http.Server) {
        [scramjet, server] = [require("scramjet"), scramjet];
    }

    var stream = new (getScramjetVersion(scramjet).DataStream)();
    server.on("request", callback(stream));
    return stream;
};

module.exports = makeServer;
module.exports.debug = () => {};
module.exports.body = makeServer.bind(null, (stream) => (req, res) => {
    // Set CORS headers
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || "*");
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');

	if (req.method === 'OPTIONS') {
		res.writeHead(200);
		return res.end();
	} else if (req.method !== 'POST') {
        res.writeHead(409, "Method not supported");
        return res.end();
    }

    const body = [];
    req.on("data", (chunk) => body.push(chunk));
    req.on("error", (...args) => debug(...args));
    req.on("end", () => {
        try {
            const type = ("" + req.headers["content-type"]).split(";");
            const data = Buffer.concat(body).toString("UTF-8");
            let entity;
            switch(type[0]) {
                case "application/json":
                case "text/json":
                    entity = JSON.parse(data);
                    break;
                case "application/form-data":
                case "application/x-www-form-urlencoded":
                    entity = querystring.parse(data);
                    break;
                default:
                    res.writeHead(415, `Unsupported Media Type - "${req.headers["content-type"]}"`);
                    return res.end();
            }

            // TODO: how to do throttling?
            stream.write(entity);

            res.writeHead(204, "No content");
            res.end();
        } catch(e) {
            res.writeHead(422, "Unprocessable Entity");
            this.debug(e && e.stack);
            return res.end();
        }
    });
});

module.exports.uri = () => module.exports.debug("NOT YET IMPLEMENTED: uri");
module.exports.request = () => module.exports.debug("NOT YET IMPLEMENTED: request");
