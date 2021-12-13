import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export interface Lamports {
  lamports: BN;
}
export interface StLamports {
  stLamports: BN;
}

export interface ExchangeRate {
  solBalance: Lamports;
  stSolSupply: StLamports;
}

export interface Addresses {
  solidoProgramId: PublicKey;
  solidoInstanceId: PublicKey;
  stSolMintAddress: PublicKey;
}
