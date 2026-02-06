import "dotenv/config";
import app from "./app.js";
import http from "http";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);


const port = process.env.PORT || 3000;

if (process.argv[1] === __filename) {
  const server = http.Server(app);

  const startServer = async () => {
    try {
    

      server.listen(port, () => {
        console.log(`App is listening on port ${port}`);
      });

      const exitHandler = () => {
        if (server) {
          server.close(() => {
            console.log("Server closed");
            process.exit(1);
          });
        } else {
          process.exit(1);
        }
      };

      const unexpectedErrorHandler = (error) => {
        console.log(error);
        exitHandler();
      };

      process.on("uncaughtException", unexpectedErrorHandler);
      process.on("unhandledRejection", unexpectedErrorHandler);
      process.on("SIGTERM", () => {
        console.log("SIGTERM received");
        if (server) {
          server.close();
        }
      });

    } catch (error) {
      console.error('Unable to connect to the databases:', error);
      process.exit(1);
    }
  };

  startServer();
}

// export default app;
// //for vercel