import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token as SplToken,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
// @ts-ignore
import * as BufferLayout from "buffer-layout";
import { MAINNET_ADDRESSES } from "./constants";

export async function ensureStakeAccountExists(
  connection: Connection,
  owner: PublicKey
) {
  const associatedStSolAccount = await SplToken.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    MAINNET_ADDRESSES.stSolMintAddress,
    owner
  );

  const { value: accounts } = await connection
    .getTokenAccountsByOwner(owner, {
      mint: MAINNET_ADDRESSES.stSolMintAddress,
    })
    .catch(() => ({ value: [] }));

  const stakeAccount = accounts.find(
    (a) => a.pubkey.toBase58() === associatedStSolAccount.toBase58()
  );
  if (stakeAccount) {
    return stakeAccount.pubkey;
  }

  return SplToken.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    MAINNET_ADDRESSES.stSolMintAddress,
    associatedStSolAccount,
    owner,
    owner
  );
}

export async function deposit(
  senderSol: PublicKey,
  recipientStSol: PublicKey,
  amount: BN
): Promise<TransactionInstruction> {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.nu64("amount"), // little endian
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 1, // 1 for deposit instruction
      amount,
    },
    data
  );

  const [reserveAccount] = await PublicKey.findProgramAddress(
    [
      MAINNET_ADDRESSES.solidoInstanceId.toBuffer(),
      Buffer.from("reserve_account"),
    ],
    MAINNET_ADDRESSES.solidoProgramId
  );

  const [mintAuthority] = await PublicKey.findProgramAddress(
    [
      MAINNET_ADDRESSES.solidoInstanceId.toBuffer(),
      Buffer.from("mint_authority"),
    ],
    MAINNET_ADDRESSES.solidoProgramId
  );

  const keys = [
    {
      pubkey: MAINNET_ADDRESSES.solidoInstanceId,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: senderSol,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: recipientStSol,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: MAINNET_ADDRESSES.stSolMintAddress,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: reserveAccount, isSigner: false, isWritable: true },
    { pubkey: mintAuthority, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
  ];

  return new TransactionInstruction({
    keys,
    programId: MAINNET_ADDRESSES.solidoProgramId,
    data,
  });
}

// Note: Withdraw initializes the recipient stake account; it should be a new fresh address.
// Would throw an exception if the amount is too low (can happen due to the stake account rent exemption requirement)
// or too high (can happen due to balancing requirements).
export async function withdraw(
  // snapshot: Snapshot,
  senderStSol: PublicKey,
  recipientWithdrawAuthority: PublicKey,
  recipientStakeAccount: PublicKey,
  amount: BN
): Promise<TransactionInstruction> {
  throw new Error("Not implemented");
  return new TransactionInstruction({
    keys: [],
    programId: MAINNET_ADDRESSES.solidoProgramId,
  });
}
