import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { getContract } from "../config";
import Image from "next/image";

function Staking() {
  const [stakingAmount, setStakingAmount] = useState<number>(0);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const stakedAmountString = stakedAmount?.toString();

  const getStake = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const stakedInEth = await contract.getStake(signer);
      setStakedAmount(stakedInEth);
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

  const stakeCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.stake(stakingAmount);
      await tx.wait();
      setSubmitted(true);
      setTransactionHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };

  const amountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setStakingAmount(Number(inputValue));
      console.log(inputValue);
    } else {
      setStakingAmount(0);
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
        <div className="mb-10 minting-container flex items-center">
          <span className="mt-9 flex justify-center items-center font-bubbles text-white text-2xl">
            Bubbles Staked: &nbsp;{" "}
            <p
              className="text-white font-sans text-2xl"
              style={{ marginTop: "-4px" }}
            >
              {stakedAmountString}
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
              getStake();
            }}
          >
            <Image
              src="/images/refresh.svg"
              alt="Left Image"
              width={20}
              height={20}
              className="ml-4 mt-8"
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

        <input
          type="number"
          className="rounded-full p-2 focus:outline-none focus:ring-4 focus:ring-white focus:border-transparent bg-red-400 caret-white"
          value={stakingAmount}
          onChange={(e) => amountChange(e)}
          placeholder="Enter amount to stake"
          style={{ color: "white" }}
        />
        <button
          className="mt-8 flex justify-center items-center font-bubbles text-red-500 text-2xl rounded-full p-3 bg-white transition duration-200 ease-in-out hover:bg-gray-200 hover:shadow-lg"
          onClick={() => {
            stakeCoin();
          }}
        >
          STAKE
        </button>
        <div className="mt-1 text-2xl">
          {submitted && (
            <div className="minting-container flex items-center">
              <Image
                src="/images/Bubbles.png"
                alt="Left Image"
                width={40}
                height={40}
                className="mr-5"
              />
              <p className="font-bubbles text-white">Staking successful!</p>
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

export default Staking;
