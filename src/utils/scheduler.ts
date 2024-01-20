import { Bank } from "../abi";
import { SupplyParamsType, SupplyWithPermitParamsType } from "../types";
import { client, getAccount } from "./client";
import { BANK_ADDRESS } from "./constants";

export const scheduleSupply = async ({
  asset,
  amount,
  date,
  owner,
}: SupplyParamsType) => {
  try {
    if (Number(amount) > 0) {
      console.log(`Supplying on behalf of ${owner} at time: ${date}`);
      const managerAccount = getAccount();

      const tx = await client.writeContract({
        account: managerAccount,
        address: BANK_ADDRESS,
        abi: Bank,
        functionName: "supply",
        args: [asset, amount, owner],
      });

      const { status } = await client.waitForTransactionReceipt({
        hash: tx,
      });

      console.log("-------------------------------------");
      console.log(`Tx hash: ${tx}`);
      console.log(`Tx status: ${status}`);
      console.log("-------------------------------------");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }
};

export const scheduleSupplyWithPermit = async ({
  amount,
  asset,
  deadline,
  date,
  owner,
  v,
  r,
  s,
}: SupplyWithPermitParamsType) => {
  try {
    if (Number(amount) > 0) {
      console.log(`Supplying on behalf of ${owner} at time: ${date}`);
      const managerAccount = getAccount();

      const tx = await client.writeContract({
        account: managerAccount,
        address: BANK_ADDRESS,

        abi: Bank,
        functionName: "supplyWithPermit",
        args: [asset, amount, owner, deadline, v, r, s],
      });

      const { status } = await client.waitForTransactionReceipt({
        hash: tx,
      });

      console.log("-------------------------------------");
      console.log(`Tx hash: ${tx}`);
      console.log(`Tx status: ${status}`);
      console.log("-------------------------------------");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }
};
