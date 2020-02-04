import * as http from "http";
import { URL } from "url";
import { route } from "./router";
import { Handler } from "./queryHandler";

export class Server {
  public static start = () => {
    const hostname = "127.0.0.1";
    const port = 3000;
    const allowOrigin = {
      "http://127.0.0.1:8000": true
    };

    function onRequest(request, response) {
      let pathname = "null";
      const { origin } = request.headers;
      console.log(request.url, origin);
      response.setHeader("access-control-allow-origin", "*");
      if (allowOrigin[origin]) {
        console.log("allow origin");
        response.setHeader("access-control-allow-origin", "*");
      }
      if (request.url === "/") {
        route(Handler, null, response, request);
      } else {
        pathname = new URL(`http://${hostname}:${port}${request.url}`).pathname;
        console.log(pathname.slice(1));
        route(Handler, pathname.slice(1), response, request);
      }
      console.log("Request for " + pathname + " received.");
    }

    http.createServer(onRequest).listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  };
}
