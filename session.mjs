import { createServer } from "http";
import { readFile } from "fs";

console.clear();

let db = [
  { name: "yesh", pass: "pass", session: false, sessionId: 0 },
  { name: "hari", pass: "sri", session: false, sessionId: 0 },
];

const server = createServer();
server.listen(80);

server.on("request", (req, res) => {
  console.log(req.url);
  console.log(req.method);
  if (req.url === "/") {
    if (req.headers["cookie"]) {
      let id = req.headers["cookie"].split("=")[1];
      let found = db.filter(elem=>{
          return elem.sessionId===id
     })
      console.log(found);
      res.end("Welcome "+found[0].name);
    }
    else {
     res.end("<script>window.location.pathname='/login'</script>")
    }
  } else if (req.url === "/login" && req.method === "GET") {
    readFile("./ser.html", (err, data) => {
      res.end(data);
    });
  } else if (req.url === "/login" && req.method === "POST") {
    let data = "";
    req.on("data", (d) => {
      data += d.toString();
    });
    req.on("end", () => {
      const userData = JSON.parse(data);
      let found = db.filter((elem) => {
        return elem.name === userData.name;
      });
      if (found[0].session) {
        res.writeHead(404);
        res.end();
      } else {
        let val = found[0].pass + Math.random();
        res.writeHead(200, {
          "set-cookie": `session=${val}`,
        });
        db.map((elem) => {
             if (elem.name == found[0].name) {
                  elem.sessionId = val;
               }
          });

        res.end();
      }
    });
  } else if (req.url === "/userError") {
    res.end("<h1>Already Logged in</h1>");
  }
});