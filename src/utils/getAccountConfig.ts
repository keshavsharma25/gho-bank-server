import { Address } from "viem";
import { Bank } from "../abi";
import { client } from "./client";
import { BANK_ADDRESS } from "./constants";

export const getAccountConfig = async (account: Address) => {
  const data = await client.readContract({
    address: BANK_ADDRESS,
    abi: Bank,
    functionName: "getAccountConfig",
    args: [account],
  });

  return {
    threshold: data[0],
    interval: data[1],
  };
};
