import "dotenv/config";
import express from "express";
import {
  watchAllTokenApprovals,
  watchAllTokenTransfersForAllAccs,
} from "./utils/watchEvents";
import { permitRoute } from "./routes/permit";

const main = async () => {
  const server = express();

  server.use(express.json());
  server.use("/permit", permitRoute);

  server.get("/", (_, res) => {
    res.send("hello world");
  });

  watchAllTokenApprovals();
  await watchAllTokenTransfersForAllAccs();

  server.listen(8080, () => {
    console.log("Starting server...");
  });
};

main().catch((err) => {
  console.error(err);
});
