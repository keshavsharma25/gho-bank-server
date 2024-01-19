import { Address } from "viem";
import { permitToken } from "../abi";
import { client } from "./client";
import { BANK_ADDRESS, Tokens } from "./constants";
import { scheduleSupply } from "./scheduler";

const watchTokenApprovals = (token: Tokens, to: Address) => {
  const unwatch = client.watchContractEvent({
    address: token as Address,
    abi: permitToken,
    eventName: "Approval",
    args: {
      spender: to,
    },
    onLogs: async (logs) => {
      console.log("Tx Hash: ", logs[0]?.transactionHash);
      console.log("EventName: ", logs[0]?.eventName);
      console.log(logs[0]?.args);

      if (token === Tokens.AAVE) {
        await scheduleSupply(123, new Date());
      }
    },
  });

  return unwatch;
};

export const watchAllTokenApprovals = () => {
  const tokens = Object.values(Tokens);

  tokens.forEach((token: Tokens) => {
    watchTokenApprovals(token, BANK_ADDRESS);
  });
};
