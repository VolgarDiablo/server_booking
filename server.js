const http = require("http");
const fs = require("fs");
const path = require("path");
const config = require("./config/config");
const generateOffers = require("./utils/generateOffers");

const offers = generateOffers();
const filePath = path.join(__dirname, "/data/photos.txt");

fs.writeFileSync(filePath, JSON.stringify(offers, null, 2));

http
  .createServer(function (request, response) {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    if (request.method === "GET") {
      if (request.url === "/offers") {
        fs.readFile(filePath, "utf8", (err, data) => {
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
      if (request.url === "/offers") {
        let body = "";

        request.on("data", (chunk) => {
          body += chunk;
        });

        request.on("end", () => {
          let newOffer;
          try {
            newOffer = JSON.parse(body);

            // Преобразование данных к нужной структуре, если необходимо
            const formattedOffer = {
              author: newOffer.author,
              offer: {
                title: newOffer.offer.title,
                address: newOffer.offer.address,
                price: Number(newOffer.offer.price),
                type: newOffer.offer.type,
                rooms: Number(newOffer.offer.rooms),
                guests: Number(newOffer.offer.guests),
                checking: newOffer.offer.checking,
                checkout: newOffer.offer.checkout,
                features: newOffer.offer.features,
                description: newOffer.offer.description,
                photos: newOffer.offer.photos,
                location: {
                  x: Number(newOffer.offer.location?.x),
                  y: Number(newOffer.offer.location?.y),
                },
              },
            };

            fs.readFile(filePath, "utf8", (err, data) => {
              if (err) {
                response.writeHead(500, {
                  "Content-Type": "application/json; charset=utf-8",
                });
                response.end(JSON.stringify({ error: "Failed to read file" }));
                return;
              }

              let offersArray;
              try {
                offersArray = JSON.parse(data);
              } catch (err) {
                response.writeHead(500, {
                  "Content-Type": "application/json; charset=utf-8",
                });
                response.end(
                  JSON.stringify({
                    error: "File content is not a valid JSON array",
                  })
                );
                return;
              }

              offersArray.push(formattedOffer);

              fs.writeFile(
                filePath,
                JSON.stringify(offersArray, null, 2),
                (err) => {
                  if (err) {
                    response.writeHead(500, {
                      "Content-Type": "application/json; charset=utf-8",
                    });
                    response.end(
                      JSON.stringify({ error: "Failed to write updated data" })
                    );
                  } else {
                    response.writeHead(200, {
                      "Content-Type": "application/json; charset=utf-8",
                    });
                    response.end(JSON.stringify(offersArray, null, 2));
                  }
                }
              );
            });
          } catch (err) {
            response.writeHead(400, {
              "Content-Type": "application/json; charset=utf-8",
            });
            response.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
          }
        });
      }
    } else {
      response.statusCode = 405;
      response.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  })
  .listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });
