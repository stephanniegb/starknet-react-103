"use client";
import WalletBar from "@/components/WalletBar";
import { CONTRACT_ADDRESS } from "@/addresses";
import CONTRACT_ABI from "../abis/abi.json";
import {
  useContract,
  useContractRead,
  useAccount,
  useContractWrite,
  useExplorer,
} from "@starknet-react/core";
import { useMemo, useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    balanceAccount: "",
    approveSpender: "",
    approveAmount: "",
    allowanceOwner: "",
    allowanceSender: "",
    transferFromSender: "",
    transferFromRecipient: "",
    transferFromAmount: "",
    transferRecipient: "",
    transferAmount: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { address: usersAddress } = useAccount();
  const explorer = useExplorer();
  const {
    data: nameData,
    error: nameError,
    refetch: nameRefetch,
  } = useContractRead({
    functionName: "name",
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    args: [],
    watch: true,
  });

  const {
    data: symbolData,
    error: symbolError,
    refetch: symbolRefetch,
  } = useContractRead({
    functionName: "symbol",
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    args: [],
    watch: true,
  });

  const {
    data: totalSupplyData,
    error: totalSupplyError,
    refetch: totalSupplyRefetch,
  } = useContractRead({
    functionName: "totalSupply",
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    args: [],
    watch: true,
  });

  const {
    data: decimalData,
    error: decimalError,
    refetch: decimalRefetch,
  } = useContractRead({
    functionName: "decimals",
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    args: [],
    watch: true,
  });

  const {
    data: balanceOfData,
    error: balanceOfError,
    refetch: balanceOfRefetch,
  } = useContractRead({
    functionName: "balanceOf",
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    args: [formData.balanceAccount],
    watch: true,
  });

  const {
    data: allowanceData,
    error: allowanceError,
    refetch: allowanceRefetch,
  } = useContractRead({
    functionName: "allowance",
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    args: [formData.allowanceOwner, formData.allowanceSender],
    watch: true,
  });

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  const transferFromCalls = useMemo(() => {
    if (
      !contract ||
      !usersAddress ||
      !formData.transferFromSender ||
      !formData.transferFromRecipient ||
      !formData.transferFromAmount
    )
      return [];
    return contract.populateTransaction["transferFrom"]!(
      formData.transferFromSender,
      formData.transferFromRecipient,
      formData.transferFromAmount
    );
  }, [
    contract,
    usersAddress,
    formData.transferFromSender,
    formData.transferFromRecipient,
    formData.transferFromAmount,
  ]);

  const {
    writeAsync: transferFromWriteAsync,
    data: transferFromData,
    isPending,
  } = useContractWrite({
    calls: transferFromCalls,
  });

  const handleTransferFrom = async () => {
    transferFromWriteAsync();
  };

  const transferCalls = useMemo(() => {
    if (
      !contract ||
      !usersAddress ||
      !formData.transferRecipient ||
      !formData.transferAmount
    )
      return [];
    return contract.populateTransaction["transfer"]!(
      formData.transferRecipient,
      formData.transferAmount
    );
  }, [
    contract,
    usersAddress,
    formData.transferRecipient,
    formData.transferAmount,
  ]);
  const {
    writeAsync: transferWriteAsync,
    data: transferData,
    isPending: transferIsPending,
  } = useContractWrite({
    calls: transferCalls,
  });
  const handleTransfer = async () => {
    transferWriteAsync();
  };

  const approveCalls = useMemo(() => {
    if (
      !contract ||
      !usersAddress ||
      !formData.approveSpender ||
      !formData.approveAmount
    )
      return [];
    return contract.populateTransaction["approve"]!(
      formData.approveSpender,
      formData.approveAmount
    );
  }, [contract, usersAddress, formData.approveSpender, formData.approveAmount]);
  const {
    writeAsync: approveWriteAsync,
    data: approveData,
    isPending: approveIsPending,
  } = useContractWrite({
    calls: approveCalls,
  });
  const handleApprove = async () => {
    approveWriteAsync();
  };

  return (
    <main className=" px-4 lg:px-20 py-10">
      <WalletBar />
      <section className="py-20 flex flex-col gap-8">
        <div className="flex flex-wrap justify-between items-center gap-4  w-full p border-solid border-b-2 border-emerald-950 py-4">
          <p>Name: {nameData ? nameData.toString() : ""}</p>
          <button
            onClick={() => nameRefetch}
            className="bg-emerald-800 text-white px-8 py-2 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
          >
            Query
          </button>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4  w-full p border-solid border-b-2 border-emerald-950 py-4">
          <p>Symbol: {symbolData ? symbolData.toString() : ""}</p>
          <button
            onClick={() => symbolRefetch}
            className="bg-emerald-800 text-white px-8 py-2 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
          >
            Query
          </button>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4  w-full p border-solid border-b-2 border-emerald-950 py-4">
          <p>
            Total supply:{" "}
            {totalSupplyData
              ? Number(totalSupplyData) / 10 ** Number(decimalData)
              : ""}
          </p>
          <button
            onClick={() => totalSupplyRefetch}
            className="bg-emerald-800 text-white px-8 py-2 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
          >
            Query
          </button>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4  w-full p border-solid border-b-2 border-emerald-950 py-4">
          <p>Decimal: {decimalData ? decimalData.toString() : ""}</p>
          <button
            onClick={() => decimalRefetch}
            className="bg-emerald-800 text-white px-8 py-2 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
          >
            Query
          </button>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4  w-full p border-solid border-b-2 border-emerald-950 py-4">
          <div className="flex flex-col gap-4   w-full md:w-[500px]">
            <input
              onChange={handleInputChange}
              name="balanceAccount"
              type="text"
              placeholder="Account"
              className="rounded-full  py-2 px-6 text-black"
            />

            <p>Balance: {balanceOfData ? balanceOfData.toString() : ""}</p>
          </div>
          <button
            onClick={() => balanceOfRefetch}
            className="bg-emerald-800 text-white px-8 py-2 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
          >
            Query
          </button>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4  w-full p border-solid border-b-2 border-emerald-950 py-4">
          <div className="flex flex-col gap-4   w-full md:w-[500px]">
            <input
              onChange={handleInputChange}
              name="allowanceOwner"
              type="text"
              placeholder="Owner"
              className="rounded-full  py-2 px-6 text-black"
            />
            <input
              onChange={handleInputChange}
              name="allowanceSender"
              type="text"
              placeholder="Sender"
              className="rounded-full  py-2 px-6 text-black"
            />

            <p>Allowance: {allowanceData ? allowanceData.toString() : ""}</p>
          </div>
          <button
            onClick={() => allowanceRefetch}
            className="bg-emerald-800 text-white px-8 py-2 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
          >
            Query
          </button>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4  w-full p border-solid border-b-2 border-emerald-950 py-4">
          <div className="flex flex-col gap-4   w-full md:w-[500px]">
            <p>Approve:</p>
            <input
              onChange={handleInputChange}
              name="approveSpender"
              type="text"
              placeholder="Spender"
              className="rounded-full  py-2 px-6 text-black"
            />
            <input
              onChange={handleInputChange}
              name="approveAmount"
              type="text"
              placeholder="Amount"
              className="rounded-full  py-2 px-6 text-black"
            />
            {approveData?.transaction_hash && (
              <a
                className="underline"
                href={explorer.transaction(approveData?.transaction_hash)}
                target="_blank"
                rel="noreferrer"
              >
                Go to {explorer.name}
              </a>
            )}
          </div>

          <button
            onClick={handleApprove}
            className="bg-emerald-800 text-white px-8 py-2 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
          >
            Transact
          </button>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4  w-full p border-solid border-b-2 border-emerald-950 py-4">
          <div className="flex flex-col gap-4   w-full md:w-[500px]">
            <p>Transfer From:</p>
            <input
              onChange={handleInputChange}
              name="transferFromSender"
              type="text"
              placeholder="Sender"
              className="rounded-full  py-2 px-6 text-black"
            />
            <input
              onChange={handleInputChange}
              name="transferFromRecipient"
              type="text"
              placeholder="Recipient"
              className="rounded-full  py-2 px-6 text-black"
            />
            <input
              onChange={handleInputChange}
              name="transferFromAmount"
              type="text"
              placeholder="Amount"
              className="rounded-full  py-2 px-6 text-black"
            />
            {transferFromData?.transaction_hash && (
              <a
                className="underline"
                href={explorer.transaction(transferFromData?.transaction_hash)}
                target="_blank"
                rel="noreferrer"
              >
                Go to {explorer.name}
              </a>
            )}
          </div>
          <button
            onClick={handleTransferFrom}
            className="bg-emerald-800 text-white px-8 py-2 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
          >
            Transact
          </button>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-4  w-full p border-solid border-b-2 border-emerald-950 py-4">
          <div className="flex flex-col gap-4   w-full md:w-[500px]">
            <p>Transfer:</p>
            <input
              onChange={handleInputChange}
              name="transferRecipient"
              type="text"
              placeholder="Recipient"
              className="rounded-full  py-2 px-6 text-black"
            />

            <input
              onChange={handleInputChange}
              name="transferAmount"
              type="text"
              placeholder="Amount"
              className="rounded-full  py-2 px-6 text-black"
            />
            {transferData?.transaction_hash && (
              <a
                className="underline"
                href={explorer.transaction(transferData?.transaction_hash)}
                target="_blank"
                rel="noreferrer"
              >
                Go to {explorer.name}
              </a>
            )}
          </div>
          <button
            onClick={handleTransfer}
            className="bg-emerald-800 text-white px-8 py-2 rounded-full text-ellipsis whitespace-nowrap overflow-hidden"
          >
            Transact
          </button>
        </div>
      </section>
    </main>
  );
}
