export function route(handle, pathname: string | null, response, request) {
	console.log("About to route a request for " + pathname);
	if (pathname == null) {
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("hello, world!");
		response.end();
		return ;
	} 
	if (typeof handle[pathname] === 'function') {
			handle[pathname](response, request);
	} else {
			console.log("No request handler found for " + pathname);
			response.writeHead(404, {"Content-Type": "text/html"});
			response.write("404 Not found");
			response.end();
	}
}
