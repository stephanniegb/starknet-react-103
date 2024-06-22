"use client";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useMemo } from "react";
import { Button } from "./ui/Button";

function WalletConnected() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <div className="flex flex-wrap justify-between items-center gap-4  w-full ">
      <span>Connected: {shortenedAddress}</span>
      <button
        className="bg-emerald-800 text-white px-8 py-2 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}

function ConnectWallet() {
  const { connectors, connect } = useConnect();

  return (
    <div>
      <span>Choose a wallet: </span>
      {connectors.map((connector) => {
        return (
          <Button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="bg-emerald-800 text-white px-8 py-[.3rem] rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
          >
            {connector.id}
          </Button>
        );
      })}
    </div>
  );
}

export default function WalletBar() {
  const { address } = useAccount();

  return (
    <div className="border-solid border-b-2 border-emerald-950 py-4">
      {address ? <WalletConnected /> : <ConnectWallet />}
    </div>
  );
}
