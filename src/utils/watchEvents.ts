import { Address } from "viem";
import { client } from "./client";
import { BANK_ADDRESS, Tokens } from "./constants";
import { abi } from "../abi/erc20WithPermit";

const watchTokenApprovals = (token: Tokens, to: Address) => {
  const unwatch = client.watchContractEvent({
    address: token as Address,
    abi: abi,
    eventName: "Approval",
    args: {
      spender: to,
    },
    onLogs: (logs) => {
      console.log(logs);
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
