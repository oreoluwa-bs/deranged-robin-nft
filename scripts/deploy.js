const { ethers } = require("hardhat");

async function main() {
  const DerangedRobin = await ethers.getContractFactory("DerangedRobin");
  const derangedRobin = await DerangedRobin.deploy();

  await derangedRobin.deployed();

  console.log("NFT deployed to:", derangedRobin.address);

  // console.log(`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
