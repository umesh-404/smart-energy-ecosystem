import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    contracts: {
      EnergyToken: energyTokenAddress,
      TradeManager: tradeManagerAddress,
      CompensationManager: compensationManagerAddress,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", deploymentInfo.network);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("EnergyToken:", energyTokenAddress);
  console.log("TradeManager:", tradeManagerAddress);
  console.log("CompensationManager:", compensationManagerAddress);
  console.log("Timestamp:", deploymentInfo.timestamp);

  // Save to file for frontend use
  const deploymentPath = path.join(__dirname, "../deployments.json");
  
  let deployments = {};
  if (fs.existsSync(deploymentPath)) {
    deployments = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  }
  
  deployments[deploymentInfo.network] = deploymentInfo;
  fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
  
  console.log("\nDeployment info saved to deployments.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });