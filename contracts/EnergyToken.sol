// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EnergyToken
 * @dev ERC-20 token representing energy units in the Smart Energy Ecosystem
 * Each token represents 1 kWh of energy
 */
contract EnergyToken is ERC20, Ownable, Pausable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1M tokens
    uint256 public constant ENERGY_PER_TOKEN = 1; // 1 token = 1 kWh
    
    // Mapping to track energy generation per user
    mapping(address => uint256) public energyGenerated;
    mapping(address => uint256) public energyConsumed;
    
    // Events
    event EnergyGenerated(address indexed user, uint256 amount);
    event EnergyConsumed(address indexed user, uint256 amount);
    event EnergyBurned(address indexed user, uint256 amount);
    
    constructor() ERC20("Energy Token", "ET") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Mint tokens when energy is generated
     * @param to Address to receive tokens
     * @param energyAmount Amount of energy generated in kWh
     */
    function mintEnergyTokens(address to, uint256 energyAmount) external onlyOwner {
        uint256 tokenAmount = energyAmount * 10**18; // Convert kWh to tokens
        _mint(to, tokenAmount);
        energyGenerated[to] += energyAmount;
        
        emit EnergyGenerated(to, energyAmount);
    }
    
    /**
     * @dev Burn tokens when energy is consumed
     * @param from Address consuming energy
     * @param energyAmount Amount of energy consumed in kWh
     */
    function burnEnergyTokens(address from, uint256 energyAmount) external onlyOwner {
        uint256 tokenAmount = energyAmount * 10**18;
        _burn(from, tokenAmount);
        energyConsumed[from] += energyAmount;
        
        emit EnergyConsumed(from, energyAmount);
    }
    
    /**
     * @dev Pause token transfers in case of emergency
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to include pause functionality
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._update(from, to, amount);
    }
    
    /**
     * @dev Get energy generation stats for a user
     */
    function getEnergyStats(address user) external view returns (uint256 generated, uint256 consumed) {
        return (energyGenerated[user], energyConsumed[user]);
    }
}