const hre = require("hardhat");

const contractAddress = "0x02d7aDF152439b2a113216354F54846D3f4B92Ad";

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    //Deploy the CryptoDevs Contract
    const nftContract = await hre.ethers.deployContract("CryptoDevs", [contractAddress]);
    //wait for the contract deployment
    await nftContract.waitForDeployment();
    //print the address of the deployed contract
    console.log("NFT Contract Address:", nftContract.target);
    //Sleep for 30 secs while Etherscan indexes the new contract deployment
    await sleep(30*1000); 
    //Verify the contract on etherscan
    await hre.run("verify:verify", {
        address: nftContract.target,
        constructorArguments: [contractAddress],
    });
}

//Call the main function and catch if there are any errors
main() 
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });