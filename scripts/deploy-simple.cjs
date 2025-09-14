const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Smart Energy Ecosystem contracts...");

  // Get the contract factories
  const EnergyToken = await ethers.getContractFactory("EnergyToken");
  const TradeManager = await ethers.getContractFactory("TradeManager");
  const CompensationManager = await ethers.getContractFactory("CompensationManager");

  // Deploy EnergyToken
  console.log("Deploying EnergyToken...");
  const energyToken = await EnergyToken.deploy();
  await energyToken.waitForDeployment();
  const energyTokenAddress = await energyToken.getAddress();
  console.log("EnergyToken deployed to:", energyTokenAddress);

  // Deploy TradeManager
  console.log("Deploying TradeManager...");
  const tradeManager = await TradeManager.deploy(energyTokenAddress);
  await tradeManager.waitForDeployment();
  const tradeManagerAddress = await tradeManager.getAddress();
  console.log("TradeManager deployed to:", tradeManagerAddress);

  // Deploy CompensationManager
  console.log("Deploying CompensationManager...");
  const compensationManager = await CompensationManager.deploy(energyTokenAddress);
  await compensationManager.waitForDeployment();
  const compensationManagerAddress = await compensationManager.getAddress();
  console.log("CompensationManager deployed to:", compensationManagerAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("EnergyToken:", energyTokenAddress);
  console.log("TradeManager:", tradeManagerAddress);
  console.log("CompensationManager:", compensationManagerAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });