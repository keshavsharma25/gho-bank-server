import { Address } from "viem";

export type SupplyParamsType = {
  asset: Address;
  owner: Address;
  amount: bigint;
  date: Date;
};

export type SupplyWithPermitParamsType = {
  asset: Address;
  owner: Address;
  amount: bigint;
  deadline: bigint;
  date: Date;
  v: bigint;
  r: string;
  s: string;
};
