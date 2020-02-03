import * as querystring from "querystring";
import * as fs from "fs";
import {readFile} from "./utils";
import {parse} from "./parse";

export class Handler {

      public static firewire = (response, request) => {
        console.log("Request handler 'readFile' was called.");
				console.log("about to parse");
				const path = "./public/firewireData.txt";
				if(path) {
					readFile(path, (res) => {
						response.writeHead(200, {"Content-Type": "application/json"});
						// console.log(res);
						response.write(JSON.stringify(res));
						response.end();
					});
				} else {
					response.writeHead(404, {"Content-Type": "application/json"});
					response.end();
				}
        // parse(request, (error: boolean, path: string | null) => {
				// 	console.log("parsing done");
				// 	if(path) {
				// 		readFile(path, (res) => {
				// 			response.writeHead(200, {"Content-Type": "application/json"});
				// 			response.write(JSON.stringify(res));
				// 		});
				// 	} else {
				// 		response.writeHead(404, {"Content-Type": "application/json"});
				// 	}
        //   response.end();
        // });
      }

};
