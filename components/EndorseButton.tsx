// components/EndorseButton.tsx
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { endorseUser } from "@/utils/aptos";

export default function EndorseButton({ target }: { target: string }) {
  const { account, signAndSubmitTransaction } = useWallet();

  const handleEndorse = async () => {
    try {
      const hash = await endorseUser(account, target);
      alert("Endorsement submitted: " + hash);
    } catch (err) {
      console.error(err);
      alert("Failed to endorse.");
    }
  };

  return <button onClick={handleEndorse}>Endorse</button>;
}
