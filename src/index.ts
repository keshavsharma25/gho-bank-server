import express from "express";
import { watchAllTokenApprovals } from "./utils/watchEvents";
import "dotenv/config";

const main = async () => {
  const server = express();

  console.log("Starting server...");
  server.listen(8080);

  watchAllTokenApprovals();
};

main()
  .then(() => {})
  .catch((err) => {
    console.error(err);
  });
