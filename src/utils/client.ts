import { Address, createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

export const client = createWalletClient({
  chain: sepolia,
  transport: http(process.env["RPC_URL"]),
}).extend(publicActions);

export const getAccount = () => {
  const privateKey = process.env["PRIVATE_KEY"];
  if (!privateKey) {
    throw new Error("Private Key does not exist in environment variables");
  }

  return privateKeyToAccount(privateKey as Address);
};
