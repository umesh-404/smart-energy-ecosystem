import hre from "hardhat";

async function main() {
  console.log("🔍 Debugging Hardhat environment...");
  console.log("hre object:", Object.keys(hre));
  console.log("hre.ethers:", hre.ethers);
  console.log("hre.network:", hre.network);
  
  // Try to access ethers through different paths
  console.log("hre.ethers available:", !!hre.ethers);
  if (hre.ethers) {
    console.log("hre.ethers methods:", Object.keys(hre.ethers));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Debug failed:", error);
    process.exit(1);
  });