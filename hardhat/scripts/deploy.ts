import { ethers } from "hardhat";

async function main() {

  const rpsFactory = await ethers.getContractFactory("RPSFactory");

  const rps = await rpsFactory.deploy();

  await rps.deployed;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
