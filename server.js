const http = require("http");
const fs = require("fs");
const path = require("path");
const config = require("./config/config");
const generateOffers = require("./services/generateOffers");

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
      if (request.url === "/offer") {
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
              author: newOffer.author || { avatar: "img/avatars/default.png" },
              offer: {
                title: newOffer.offer.title || "Untitled",
                address: newOffer.offer.address || "",
                price: Number(newOffer.offer.price) || 0,
                type: newOffer.offer.type || "flat",
                rooms: Number(newOffer.offer.rooms) || 1,
                guests: Number(newOffer.offer.guests) || 1,
                checking: newOffer.offer.checking || "12:00",
                checkout: newOffer.offer.checkout || "12:00",
                features: Array.isArray(newOffer.offer.features)
                  ? newOffer.offer.features
                  : [],
                description: newOffer.offer.description || "",
                photos: Array.isArray(newOffer.offer.photos)
                  ? newOffer.offer.photos
                  : [],
                location: {
                  x: Number(newOffer.offer.location?.x) || 0,
                  y: Number(newOffer.offer.location?.y) || 0,
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
                if (!Array.isArray(offersArray)) {
                  throw new Error("File content is not a valid JSON array");
                }
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
