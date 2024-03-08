import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { getContract } from "../config";
import Image from "next/image";

function Withdraw() {
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [elapsedStakeTime, setElapsedStakeTime] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const withdrawAmountString = withdrawAmount?.toString();

  const withdrawCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      setSubmitted(true);
      setTransactionHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };

  const getWithdrawAmount = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const withdrawAmount = await contract.getWithdraw(signer);

      setWithdrawAmount(withdrawAmount);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };

  const getElapsedStakeTime = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const elapsedStakeTime = await contract.getElapsedStakeTime(signer);

      setElapsedStakeTime(elapsedStakeTime);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };

  return (
    <div
    className="mt-20 grid text-white text-center p-10 bg-gradient-to-b from-red-500 to-red-700 transition-all border-white border-8"
    style={{
      width: "52vh",
      height: "40vh",
      position: "relative",
      }}
    >
      <div className="flex justify-center items-center flex-col">
        <div className="mb-2 minting-container flex items-center">
          <span className="mt-5 flex justify-center items-center font-bubbles text-white text-2xl">
            Withdrawable Bubbles: &nbsp;{" "}
            <p
              className="font-sans text-white text-2xl"
              style={{ marginTop: "-4px" }}
            >
              {withdrawAmountString}
            </p>
            <Image
              src="/images/Bubbles.png"
              alt="Left Image"
              width={30}
              height={30}
              className="ml-1"
            />
          </span>
          <button
            onClick={() => {
              getWithdrawAmount();
            }}
          >
            <Image
              src="/images/refresh.svg"
              alt="Left Image"
              width={20}
              height={20}
              className="ml-4 mt-5"
              style={{ filter: "invert(1)", transition: "transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </button>
        </div>

        <div className=" minting-container flex items-center">
          <p className=" flex justify-center items-center font-bubbles text-white text-xl ">
            Withdraw Status: &nbsp;
            <span style={{ color: elapsedStakeTime > 60 ? "lime" : "maroon" }}>
              {elapsedStakeTime > 60
                ? " BLUB BLUB TIME"
                : " You can't blow bubbles yet "}
            </span>
          </p>
          <button
            onClick={() => {
              getElapsedStakeTime();
            }}
          >
            <Image
              src="/images/refresh.svg"
              alt="Left Image"
              width={20}
              height={20}
              className="ml-4"
              style={{ filter: "invert(1)", transition: "transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </button>
        </div>

        <button
          className="mt-8 flex justify-center items-center font-bubbles text-red-500 text-2xl rounded-full p-3 bg-white transition duration-200 ease-in-out hover:bg-gray-200 hover:shadow-lg"
          onClick={() => {
            withdrawCoin();
          }}
        >
          WITHDRAW
        </button>
        <div className="mt-5 ">
          {submitted && (
            <div className="minting-container flex items-center">
              <Image
                src="/images/Bubbles.png"
                alt="Left Image"
                width={40}
                height={40}
                className="mr-5"
              />
              <p className="font-bubbles text-white">Withdraw Successful!</p>
              <Image
                src="/images/Bubbles.png"
                alt="Left Image"
                width={40}
                height={40}
                className="ml-5"
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          {submitted && (
            <div className="minting-container flex items-center">
              <a
                href={`https://sepolia.arbiscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bubbles text-cyan-300 cursor-pointer hover:scale-105 transition"
              >
                Click to View Transaction
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
