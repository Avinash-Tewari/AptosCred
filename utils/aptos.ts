// utils/aptos.ts
import { AptosClient, AptosAccount, TxnBuilderTypes, BCS } from "aptos";

export const client = new AptosClient("https://fullnode.devnet.aptoslabs.com");

export async function endorseUser(endorser: AptosAccount, userAddress: string) {
  const payload = {
    type: "entry_function_payload",
    function: "aptoscred::reputation::endorse",
    arguments: [userAddress],
    type_arguments: [],
  };

  const txnRequest = await client.generateTransaction(endorser.address(), payload);
  const signedTxn = await client.signTransaction(endorser, txnRequest);
  const result = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(result.hash);
  return result.hash;
}
