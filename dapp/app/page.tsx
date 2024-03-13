"use client";
import styles from "./index.module.css";
import { BrowserProvider } from "ethers";
import { JsonRpcProvider } from "ethers/providers";
import Image from "next/image";
import Minting from "../components/mintingPanel";
import Staking from "../components/stakingPanel";
import Withdraw from "../components/withdrawPanel";
import { useEffect, useState } from "react";
import { getContract } from "../config";
import Background from "../public/images/BG.jpg";
import style from "./button.module.css";
export default function Home() {
  const [walletKey, setwalletKey] = useState("");
  const [chosenButton, setChosenButton] = useState<number>();

 
  const Desktop = () => {
    return (
      <div>
        <div className={styles.desktop1Child}> <Minting /></div>
        <div className={styles.desktop1Item}>  <Staking /></div>
        <div className={styles.desktop1Inner}> <Withdraw /></div>
      </div>
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (walletKey !== "") {
        setChosenButton(0);
      } else {
        setChosenButton(4);
      }
    }
  }, [walletKey]);

  const connectWallet = async () => {
    const { ethereum } = window as any;

    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: [
            "https://sepolia-rollup.arbitrum.io/rpc",
            "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
          ],
          chainId: "0x66eee",
          chainName: "Arbitrum Sepolia",
        },
      ],
    });

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setwalletKey(accounts[0]);

    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x66eee",
        },
      ],
    });
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-12 relative"
      style={{
        backgroundImage: `url(${Background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "80%",
        overflow: "hidden",
      }}
    >
      <Desktop />
      <div className="absolute top-0 left-0 w-full h-30 bg-black bg-opacity-50 z-10;">
        <p className="left-0 top-0 flex w-full justify-space-between items-center p-8 pb-6 pt-8 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:p-4 lg:dark:bg-transparent">
          <div className="flex items-center group">
            <a
              href="https://www.youtube.com/shorts/8_KFck-foNc"
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              <Image
                src="/images/Bubbles.png"
                alt="Bubbles"
                className="mr-3 mb-1 group-hover:scale-105 group transition duration-300 motion-reduce:transform-none"
                width={60}
                height={64}
                priority
              />
            </a>
            <a
              href="https://www.youtube.com/shorts/8_KFck-foNc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-bubbles text-3xl -ml-2 group-hover:scale-105 transition duration-300 motion-reduce:transform-none "
            >
            <span>
              Bubbles | Blub Blub Blub
            </span>
            </a>
          </div>
          <button
            onClick={() => {
              connectWallet();
            }}
            className="text-white font-bubbles text-xl ml-auto hover:scale-105 transition duration-300 motion-reduce:transform-none border-4 rounded-full border-grey-lightest p-4 shadow text-grey-lightest"
          >
            {walletKey !== "" && (
              <>
                <span className="">
                  {" "}
                  Connected:{" "}
                </span>
                <span className="font-sans">
                  {walletKey.substring(0, 7)}
                  {walletKey.length > 7 ? "..." : ""}
                </span>
              </>
            )}
            {walletKey === "" && <span className="">Connect Wallet</span>}
          </button>
        </p>
      </div>

      

      

    
    </main>
  );
}