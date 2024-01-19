import "dotenv/config";
import express, { Request, Response } from "express";
import { watchAllTokenApprovals } from "./utils/watchEvents";
import bodyParser from "body-parser";
import { dbClient } from "./utils/db";

const main = async () => {
  const server = express();

  server.use(bodyParser.json());

  console.log("Starting server...");

  server.post("/permit", (req: Request, res: Response) => {
    const { account, amount, deadline, v, r, s } = req.body;

    dbClient.from("BookKeep").insert({
      account,
      amount,
      deadline,
      v,
      r,
      s,
      isPermit: true,
    });

    res.send("Successfuly sent value");
  });

  server.get("/", (req, res) => {
    res.send("hello world");
  });

  watchAllTokenApprovals();
  server.listen(8080, () => {
    console.log("listening whereever you are");
  });
};

main().catch((err) => {
  console.error(err);
});
