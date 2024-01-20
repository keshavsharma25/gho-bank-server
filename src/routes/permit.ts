import { Request, Response, Router } from "express";
import { dbClient, getLastBookKeepId } from "../utils/db";
import { scheduleJob } from "node-schedule";
import { scheduleSupplyWithPermit } from "../utils/scheduler";
import { Address } from "viem";
import { getAccountConfig } from "../utils/getAccountConfig";

export const permitRoute = Router();

permitRoute.post("/", async (req: Request, res: Response) => {
  try {
    const { asset, account, amount, deadline, v, r, s } = req.body;
    const { error: dbError } = await dbClient.from("BookKeep").insert({
      asset,
      account,
      amount,
      deadline,
      v,
      r,
      s,
      isPermit: true,
    });

    if (dbError) {
      throw new Error(dbError.message);
    }

    const lastBookKeepId = await getLastBookKeepId(account);

    if (lastBookKeepId) {
      await dbClient
        .from("Accounts")
        .update({
          last_bookkeep_id: lastBookKeepId,
        })
        .eq("account", account);
    }

    const { interval } = await getAccountConfig(account);

    const date = new Date();
    console.log("Executed at time: ", date);
    date.setSeconds(date.getSeconds() + Number(interval));

    scheduleJob(date, async (fireDate) => {
      await scheduleSupplyWithPermit({
        amount: BigInt(amount as string),
        asset: asset as Address,
        owner: account as Address,
        deadline: BigInt(deadline),
        date: fireDate,
        v: BigInt(v),
        r,
        s,
      });
    });

    res.sendStatus(200);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      res.sendStatus(400);
    }
  }
});
