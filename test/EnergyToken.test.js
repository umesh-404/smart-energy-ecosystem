const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EnergyToken", function () {
  let energyToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const EnergyToken = await ethers.getContractFactory("EnergyToken");
    energyToken = await EnergyToken.deploy();
    await energyToken.waitForDeployment();
  });

  it("Should deploy with correct initial supply", async function () {
    const totalSupply = await energyToken.totalSupply();
    expect(totalSupply).to.equal(ethers.parseEther("1000000")); // 1M tokens
  });

  it("Should mint energy tokens", async function () {
    const energyAmount = 100; // 100 kWh
    await energyToken.mintEnergyTokens(addr1.address, energyAmount);
    
    const balance = await energyToken.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.parseEther("100"));
  });

  it("Should burn energy tokens", async function () {
    const energyAmount = 50; // 50 kWh
    await energyToken.mintEnergyTokens(addr1.address, energyAmount);
    
    await energyToken.burnEnergyTokens(addr1.address, energyAmount);
    const balance = await energyToken.balanceOf(addr1.address);
    expect(balance).to.equal(0);
  });

  it("Should get energy stats", async function () {
    const energyAmount = 75; // 75 kWh
    await energyToken.mintEnergyTokens(addr1.address, energyAmount);
    await energyToken.burnEnergyTokens(addr1.address, 25);
    
    const [generated, consumed] = await energyToken.getEnergyStats(addr1.address);
    expect(generated).to.equal(75);
    expect(consumed).to.equal(25);
  });
});