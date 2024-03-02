import { ethers } from "hardhat";

async function main() {
  const lock = await ethers.deployContract("Bubbles", ["0x72c009Ca402b416F79d4A59bd4550Ff9719F5CcD"]);

  await lock.waitForDeployment();

  console.log(
    `Token deployed to ${lock.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});