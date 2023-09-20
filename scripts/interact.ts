// An example script that shows how to interact programmatically with a deployed contract
// You must customise it according to your contract's specifications

import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

require('dotenv').config();
const { ethers } = require("hardhat");
import { expect } from "chai";

async function main() {
  const [deployer] = await ethers.getSigners();
  const contract = await ethers.getContractFactory("EnvironmentalAsset"); // Specify here your contract name
  const contractAddress = process.env.CONTRACT_ADDRESS; // Read contract address from environment variable

  ////////////////
  //  PAYLOAD  //
  //////////////

  // Specify here the payload of the to-be-called function
  const userAccount = process.env.ACCOUNT_ADDRESS; // Read contract address from environment variable
 
  ///////////////
  //  ATTACH  //
  /////////////

  const Contract = contract.attach(contractAddress);

  ////////////////
  //  SENDING  //
  //////////////

  const tx = await Contract.getBalance(userAccount); // Specify here the to-be-called function name
  console.log("The transaction hash is:", tx.hash);
  const receipt = await tx.wait();
  console.log(
    "The transaction returned the following transaction receipt:\n",
    receipt,
  );
}

// To run it, invoke `npx hardhat run scripts/interact.ts --network <network_name>`
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});