import hre from "hardhat";
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Smart Energy Ecosystem contracts...");

  // Get the contract factories
  const EnergyToken = await ethers.getContractFactory("EnergyToken");
  const TradeManager = await ethers.getContractFactory("TradeManager");
  const CompensationManager = await ethers.getContractFactory("CompensationManager");

  // Deploy EnergyToken
  console.log("📄 Deploying EnergyToken...");
  const energyToken = await EnergyToken.deploy();
  await energyToken.waitForDeployment();
  const energyTokenAddress = await energyToken.getAddress();
  console.log("✅ EnergyToken deployed to:", energyTokenAddress);

  // Deploy TradeManager
  console.log("📄 Deploying TradeManager...");
  const tradeManager = await TradeManager.deploy(energyTokenAddress);
  await tradeManager.waitForDeployment();
  const tradeManagerAddress = await tradeManager.getAddress();
  console.log("✅ TradeManager deployed to:", tradeManagerAddress);

  // Deploy CompensationManager
  console.log("📄 Deploying CompensationManager...");
  const compensationManager = await CompensationManager.deploy(energyTokenAddress);
  await compensationManager.waitForDeployment();
  const compensationManagerAddress = await compensationManager.getAddress();
  console.log("✅ CompensationManager deployed to:", compensationManagerAddress);

  console.log("\n🎉 Deployment Summary:");
  console.log("=".repeat(50));
  console.log("EnergyToken:", energyTokenAddress);
  console.log("TradeManager:", tradeManagerAddress);
  console.log("CompensationManager:", compensationManagerAddress);
  console.log("=".repeat(50));

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contracts: {
      EnergyToken: energyTokenAddress,
      TradeManager: tradeManagerAddress,
      CompensationManager: compensationManagerAddress,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n💾 Deployment info saved to deployments.json");
  console.log("🔗 Add these addresses to your backend .env file:");
  console.log(`ENERGY_TOKEN_ADDRESS=${energyTokenAddress}`);
  console.log(`TRADE_MANAGER_ADDRESS=${tradeManagerAddress}`);
  console.log(`COMPENSATION_MANAGER_ADDRESS=${compensationManagerAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });