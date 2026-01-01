import path from "path";
import { createServer } from "./index";
import * as express from "express";

async function start() {
  const app = await createServer();
  const port = process.env.PORT || 3000;

  // In production, serve the built SPA files
  const __dirname = import.meta.dirname;
  const distPath = path.join(__dirname, "../../frontend/dist");

  // Serve static files
  app.use(express.static(distPath));

  // Handle React Router - serve index.html for all non-API routes
  // This middleware catches all remaining routes and serves the SPA
  app.use((req, res, next) => {
    // Skip if it's an API or health check request
    if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
      return next();
    }
    // Serve the SPA entry point
    res.sendFile(path.join(distPath, "index.html"));
  });

  const server = app.listen(port, () => {
    console.log(`🚀 Abayas Storefront server running on port ${port}`);
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("🛑 Received SIGTERM, shutting down gracefully");
    server.close(() => process.exit(0));
  });

  process.on("SIGINT", () => {
    console.log("🛑 Received SIGINT, shutting down gracefully");
    server.close(() => process.exit(0));
  });

  // Keep the server alive
  server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
