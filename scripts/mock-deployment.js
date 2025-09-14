// Mock deployment script for SIH demonstration
// This creates the contract addresses and configuration needed for the demo

import fs from "fs";

async function main() {
  console.log("🚀 Creating mock blockchain deployment for SIH demonstration...");
  
  // Mock contract addresses for demonstration
  const mockContracts = {
    EnergyToken: "0x1234567890123456789012345678901234567890",
    TradeManager: "0x2345678901234567890123456789012345678901", 
    CompensationManager: "0x3456789012345678901234567890123456789012"
  };
  
  // Create deployment configuration
  const deploymentConfig = {
    network: "mumbai",
    chainId: 80001,
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    contracts: mockContracts,
    deployedAt: new Date().toISOString(),
    deployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    status: "mock_deployment_for_demo"
  };
  
  // Save to multiple formats for different uses
  fs.writeFileSync('./deployed-contracts.json', JSON.stringify(deploymentConfig, null, 2));
  
  // Create config directory if it doesn't exist
  const configDir = './frontend/src/config';
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  fs.writeFileSync('./frontend/src/config/contracts.js', 
    `// Auto-generated contract addresses for SIH demo
export const CONTRACT_ADDRESSES = {
  ENERGY_TOKEN: "${mockContracts.EnergyToken}",
  TRADE_MANAGER: "${mockContracts.TradeManager}",
  COMPENSATION_MANAGER: "${mockContracts.CompensationManager}",
  NETWORK: {
    name: "Mumbai Testnet",
    chainId: 80001,
    rpcUrl: "https://rpc-mumbai.maticvigil.com"
  }
};

export const DEPLOYMENT_INFO = {
  deployedAt: "${deploymentConfig.deployedAt}",
  deployer: "${deploymentConfig.deployer}",
  status: "${deploymentConfig.status}"
};
`);
  
  console.log("✅ Mock contracts created for SIH demo:");
  console.log("   EnergyToken:", mockContracts.EnergyToken);
  console.log("   TradeManager:", mockContracts.TradeManager);
  console.log("   CompensationManager:", mockContracts.CompensationManager);
  
  console.log("📄 Files created:");
  console.log("   - deployed-contracts.json");
  console.log("   - frontend/src/config/contracts.js");
  
  console.log("🎉 Mock deployment complete! Ready for SIH demonstration.");
  console.log("💡 This simulates a real blockchain deployment for demo purposes.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Mock deployment failed:", error);
    process.exit(1);
  });