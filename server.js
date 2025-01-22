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
          } catch (err) {
            response.writeHead(400, {
              "Content-Type": "application/json; charset=utf-8",
            });
            response.end(JSON.stringify({ error: "Invalid JSON format" }));
            return;
          }

          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error("Ошибка чтения файла:", err);
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
              console.error("Ошибка парсинга файла:", err);
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

            offersArray.push(newOffer);

            fs.writeFile(
              filePath,
              JSON.stringify(offersArray, null, 2),
              (err) => {
                if (err) {
                  console.error("Ошибка записи в файл:", err);
                  response.writeHead(500, {
                    "Content-Type": "application/json; charset=utf-8",
                  });
                  response.end(
                    JSON.stringify({ error: "Failed to write updated data" })
                  );
                } else {
                  console.log("Данные успешно добавлены в файл");

                  response.writeHead(200, {
                    "Content-Type": "application/json; charset=utf-8",
                  });
                  response.end(JSON.stringify(offersArray, null, 2));
                }
              }
            );
          });
        });
      } else {
        response.statusCode = 404;
        response.end(JSON.stringify({ error: "Not Found" }));
      }
    } else {
      response.statusCode = 405;
      response.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  })
  .listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });
