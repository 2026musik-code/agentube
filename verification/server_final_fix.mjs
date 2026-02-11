import http from "http";
import html from "../src/html.js";

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === "/") {
        // Mock injection of key using the NEW marker
        const injectedHtml = html.replace(
            "/* INJECT_KEY_HERE */",
            `const UPSTREAM_KEY = "MOCK_KEY";`
        );
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(injectedHtml);
    } else if (req.url === "/auth" && req.method === "POST") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(3011, () => {
    console.log("Server running on port 3011");
});
