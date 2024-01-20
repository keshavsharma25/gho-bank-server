import { scheduleJob } from "node-schedule";
import { Address } from "viem";
import { permitToken } from "../abi";
import { client } from "./client";
import { BANK_ADDRESS, Tokens } from "./constants";
import { getAccountConfig } from "./getAccountConfig";
import { scheduleSupply } from "./scheduler";

const watchTokenApproval = (token: Tokens, to: Address) => {
  const unwatch = client.watchContractEvent({
    address: token as Address,
    abi: permitToken,
    eventName: "Approval",
    args: {
      spender: to,
    },
    onLogs: async (logs) => {
      try {
        console.log("Tx Hash: ", logs[0]?.transactionHash);
        console.log("EventName: ", logs[0]?.eventName);
        if (!(logs && logs[0])) {
          throw new Error("Logs does not exist!");
        }

        const { address, args, blockNumber } = logs[0];

        const { timestamp } = await client.getBlock({
          blockNumber,
        });

        console.log(timestamp);

        if (address && args && args.value && args.owner) {
          // const permitData = await getIsPermit(args.owner);

          // if (!permitData) {
          //   throw new Error("isPermit does not exist!");
          // }

          // const { isPermit } = permitData;
          const isPermit = false;

          if (isPermit) {
            return 0;
          }

          const { interval } = await getAccountConfig(args.owner);
          const triggerTimestamp = timestamp + interval;
          console.log(triggerTimestamp);

          const triggerTime = new Date(Number(triggerTimestamp) * 1000);
          console.log(triggerTime);

          const params = {
            asset: address,
            amount: args.value,
            owner: args.owner,
            date: triggerTime,
          };

          scheduleJob(triggerTime, async (fireDate) => {
            console.log("Fire Date: ", fireDate);
            await scheduleSupply(params);
          });

          return 1;
        }

        return 0;
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error in WatchTokenApproval callback for schedule");
          console.error(err.message);
        }
      }
    },
  });

  return unwatch;
};

export const watchAllTokenApprovals = () => {
  const tokens = Object.values(Tokens);

  tokens.forEach((token: Tokens) => {
    watchTokenApproval(token, BANK_ADDRESS);
  });
};
