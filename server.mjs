import path from "path";
import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router(path.join("dist", "db", "app.json"));

// Middleware for handling CORS
const corsMiddleware = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Handle preflight requests
  }
  next();
};

const middlewares = jsonServer.defaults({
  static: "dist",
});

const port = process.env.PORT || 3131;

// Use CORS middleware
server.use(corsMiddleware);

// Use default middlewares and router
server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});

export default server;
