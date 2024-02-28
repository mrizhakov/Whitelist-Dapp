// Original HardHat script
//
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = hre.ethers.parseEther("0.001");

//   const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Lock with ${ethers.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


//added new deployement script

const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  /*
    DeployContract in ethers.js is an abstraction used to deploy new smart contracts,
    so whitelistContract here is a factory for instances of our Whitelist contract.
    */
  // here we deploy the contract
  const whitelistContract = await hre.ethers.deployContract("Whitelist", [10]);
   // 10 is the Maximum number of whitelisted addresses allowed

  // wait for the contract to deploy
  await whitelistContract.waitForDeployment();
  // print the address of the deployed contract
  console.log("Whitelist Contract Address: ", whitelistContract.target);
  // Sleep for 30 seconds while Etherscan indexes the new contract deployment
  await sleep(30 * 1000);
  // Verify the contract on etherscan
  await hre.run("verify:verify", {
    address: whitelistContract.target,
    constructorArguments: [10],
  });
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });