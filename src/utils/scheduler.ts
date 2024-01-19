import { Address } from "viem";
import { Bank, permitToken } from "../abi";
import { getAccount, client } from "./client";
import { BANK_ADDRESS, Tokens } from "./constants";

export const scheduleSupply = async (id: number, date: Date) => {
  // TODO: After adding DB implement adding id
  const asset: Tokens = Tokens.AAVE;
  const owner: Address = "0xE6E065248026b1a91820b631A7bbB79AB6C53677";

  const amount = await client.readContract({
    address: asset,
    abi: permitToken,
    functionName: "allowance",
    args: [owner, BANK_ADDRESS],
  });

  try {
    console.log(`Supplying ${id} on ${date}`);

    if (Number(amount) > 0) {
      const managerAccount = getAccount();

      const tx = await client.writeContract({
        account: managerAccount,
        address: BANK_ADDRESS,
        abi: Bank,
        functionName: "supply",
        args: [asset, amount, owner],
      });

      const receipt = await client.waitForTransactionReceipt({
        hash: tx,
      });

      console.log("Tx receipt: ", receipt.transactionHash);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }
};
