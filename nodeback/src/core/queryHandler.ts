import * as querystring from "querystring";
import * as fs from "fs";
import { readFile } from "./utils";

export class Handler {
  public static firewire = (response, request) => {
    console.log("Request handler 'firewrie' was called.");
    const path = "./public/firewireData.txt";
    if (path) {
      readFile(path, res => {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify(res));
        response.end();
      });
    } else {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end();
    }
  };

  public static firewire2 = (response, request) => {
    console.log("Request handler 'firewire2' was called.");
    const path = "./public/static0906_2D.txt";
    if (path) {
      readFile(path, res => {
        response.writeHead(200, { "Content-Type": "application/json" });
        // console.log(res);
        response.write(JSON.stringify(res));
        response.end();
      });
    } else {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end();
    }
  };
}
