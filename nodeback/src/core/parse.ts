// import * as url from "url";
import * as http from "http";
import { URL } from "url";

export function parse(request: http.IncomingMessage, callback: any) {
    const rurl = request.url;
    if (rurl) {
        const u = new URL(rurl);
        const pathname = u.pathname;
        const path = u.searchParams.get('path');
        if (path) {
            callback(false, path);
            return;
        }
    }
    callback(true, null);
}