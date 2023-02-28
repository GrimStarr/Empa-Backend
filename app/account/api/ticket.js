const { Router } = require("express");
const { json } = require("body-parser");
const router = new Router();
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");
const request = require("request");
const https = require("https");
const Stream = require("stream").Transform;

// var download = function (uri, callback) {
//   request.head(uri, function (err, res, body) {
//     console.log("content-type:", res.headers["content-type"]);
//     console.log("content-length:", res.headers["content-length"]);

//     request(uri)
//       .pipe(fs.createWriteStream(`../../public/pdf/qr.png`))
//       .on("close", callback);
//   });
//};

router.get("/:data", (req, res) => {
  const data = req.params.data;

  //   download(
  //     `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${data}`,
  //     function () {
  //       console.log("done");
  //     }
  //   );

  https.get(
    `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${data}`,
    (result) => {
      let img = new Stream();
      result.on("data", (chunk) => {
        img.push(chunk);
      });

      result.on("end", () => {
        const filesDir = path.join(__dirname, `../../public/pdf`);
        let filname = filesDir + "/qr.png";
        fs.writeFileSync(filname, img.read());

        const html = fs.readFileSync(
          path.join(__dirname, "../../views/template.html"),
          "utf-8"
        );

        var options = {
          width: "600px",
          height: "225px",
          border: "5mm",
        };

        var users = [
          {
            imgurl: `http://beta.empasoft.mn:5000/static/pdf/qr.png`,
          },
        ];

        var document = {
          html: html,
          data: {
            users: users,
          },
          path: "../../public/pdf/output.pdf",
          type: "",
        };
        pdf
          .create(document, options)
          .then(() => {
            var dataPDF = fs.readFileSync("../../public/pdf/output.pdf");
            res.contentType("application/pdf");
            res.send(dataPDF);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  );
});

module.exports = router;
