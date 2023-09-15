
import { ethers } from "hardhat";

const name = "name";
const type = "asset";
const price = 100;
const initial_supply = 10000;
const exp_date = 25122023; //DDMMYYYY

async function main() {

  const deploy_contract = await ethers.deployContract("EnvironmentalAsset", [name, type, price, initial_supply, exp_date]);

  await deploy_contract.waitForDeployment();

  console.log("EnvironmentalAsset is deployed to : ",await deploy_contract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
