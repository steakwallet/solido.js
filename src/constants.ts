import { PublicKey } from "@solana/web3.js";
import { Addresses } from "./interfaces";

export const MAINNET_ADDRESSES: Addresses = {
  solidoProgramId: new PublicKey(
    "CrX7kMhLC3cSsXJdT7JDgqrRVWGnUpX3gfEfxxU2NVLi"
  ),
  solidoInstanceId: new PublicKey(
    "49Yi1TKkNyYjPAFdR9LBvoHcUjuPX4Df5T5yv39w2XTn"
  ),
  stSolMintAddress: new PublicKey(
    "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj"
  ),
};
