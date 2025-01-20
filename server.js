const http = require("http");
const fs = require("fs");
const path = require("path");
const generateOffers = require("./controllers/generateOffers");

const offers = generateOffers();
fs.writeFileSync(
  `${__dirname}/data/photos.txt`,
  JSON.stringify(offers, null, 2)
);

http
  .createServer(function (request, response) {
    response.setHeader("Content-Type", "application/json; charset=utf-8");

    if (request.method === "GET") {
      if (request.url === "/offers") {
        fs.readFile(`${__dirname}/data/photos.txt`, "utf8", (err, data) => {
          if (err) {
            response.statusCode = 500;
            response.end(JSON.stringify({ error: "Failed to read file" }));
            return;
          }
          response.statusCode = 200;
          response.end(data);
        });
      } else {
        response.statusCode = 404;
        response.end(JSON.stringify({ error: "Not Found" }));
      }
    } else if (request.method === "POST") {
      if (request.url === "/") {
        return;
      } else {
        response.statusCode = 404;
        response.end(JSON.stringify({ error: "Not Found" }));
      }
    } else {
      response.statusCode = 405;
      response.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  })
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
