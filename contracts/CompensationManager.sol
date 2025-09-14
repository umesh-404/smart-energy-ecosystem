// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EnergyToken.sol";

/**
 * @title CompensationManager
 * @dev Manages automatic compensation for power outages
 */
contract CompensationManager is ReentrancyGuard, Ownable {
    EnergyToken public energyToken;
    
    struct OutageEvent {
        uint256 outageId;
        string location;
        uint256 startTime;
        uint256 endTime;
        uint256 affectedUsers;
        uint256 compensationPerUser;
        bool isResolved;
        address[] affectedAddresses;
    }
    
    struct Compensation {
        address user;
        uint256 outageId;
        uint256 amount;
        bool claimed;
        uint256 timestamp;
    }
    
    // State variables
    OutageEvent[] public outageEvents;
    mapping(address => Compensation[]) public userCompensations;
    mapping(uint256 => mapping(address => bool)) public compensationClaimed;
    
    uint256 public totalOutages;
    uint256 public totalCompensations;
    uint256 public constant COMPENSATION_RATE = 2; // 2 tokens per hour of outage
    
    // Events
    event OutageReported(uint256 indexed outageId, string location, uint256 affectedUsers);
    event OutageResolved(uint256 indexed outageId, uint256 duration, uint256 totalCompensation);
    event CompensationClaimed(address indexed user, uint256 indexed outageId, uint256 amount);
    
    constructor(address _energyToken) Ownable(msg.sender) {
        energyToken = EnergyToken(_energyToken);
    }
    
    /**
     * @dev Report a power outage
     */
    function reportOutage(
        string memory _location,
        address[] memory _affectedAddresses
    ) external onlyOwner {
        uint256 outageId = outageEvents.length;
        
        outageEvents.push(OutageEvent({
            outageId: outageId,
            location: _location,
            startTime: block.timestamp,
            endTime: 0,
            affectedUsers: _affectedAddresses.length,
            compensationPerUser: 0,
            isResolved: false,
            affectedAddresses: _affectedAddresses
        }));
        
        totalOutages++;
        
        emit OutageReported(outageId, _location, _affectedAddresses.length);
    }
    
    /**
     * @dev Resolve an outage and calculate compensations
     */
    function resolveOutage(uint256 _outageId) external onlyOwner {
        require(_outageId < outageEvents.length, "Invalid outage ID");
        OutageEvent storage outage = outageEvents[_outageId];
        
        require(!outage.isResolved, "Outage already resolved");
        
        outage.endTime = block.timestamp;
        uint256 duration = outage.endTime - outage.startTime;
        uint256 durationHours = duration / 3600; // Convert to hours
        
        outage.compensationPerUser = durationHours * COMPENSATION_RATE * 10**18; // Convert to tokens
        outage.isResolved = true;
        
        // Create compensation records for all affected users
        for (uint256 i = 0; i < outage.affectedAddresses.length; i++) {
            address user = outage.affectedAddresses[i];
            
            userCompensations[user].push(Compensation({
                user: user,
                outageId: _outageId,
                amount: outage.compensationPerUser,
                claimed: false,
                timestamp: block.timestamp
            }));
            
            totalCompensations++;
        }
        
        emit OutageResolved(_outageId, duration, outage.compensationPerUser * outage.affectedUsers);
    }
    
    /**
     * @dev Claim compensation for a specific outage
     */
    function claimCompensation(uint256 _outageId) external nonReentrant {
        require(_outageId < outageEvents.length, "Invalid outage ID");
        OutageEvent storage outage = outageEvents[_outageId];
        
        require(outage.isResolved, "Outage not resolved yet");
        require(!compensationClaimed[_outageId][msg.sender], "Compensation already claimed");
        
        // Check if user was affected by this outage
        bool isAffected = false;
        for (uint256 i = 0; i < outage.affectedAddresses.length; i++) {
            if (outage.affectedAddresses[i] == msg.sender) {
                isAffected = true;
                break;
            }
        }
        
        require(isAffected, "User not affected by this outage");
        
        // Mint compensation tokens
        energyToken.mintEnergyTokens(msg.sender, outage.compensationPerUser / 10**18);
        
        // Mark as claimed
        compensationClaimed[_outageId][msg.sender] = true;
        
        // Update user's compensation record
        for (uint256 i = 0; i < userCompensations[msg.sender].length; i++) {
            if (userCompensations[msg.sender][i].outageId == _outageId) {
                userCompensations[msg.sender][i].claimed = true;
                break;
            }
        }
        
        emit CompensationClaimed(msg.sender, _outageId, outage.compensationPerUser);
    }
    
    /**
     * @dev Get user's pending compensations
     */
    function getPendingCompensations(address user) external view returns (Compensation[] memory) {
        Compensation[] memory compensations = userCompensations[user];
        uint256 pendingCount = 0;
        
        // Count pending compensations
        for (uint256 i = 0; i < compensations.length; i++) {
            if (!compensations[i].claimed) {
                pendingCount++;
            }
        }
        
        // Create array of pending compensations
        Compensation[] memory pending = new Compensation[](pendingCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < compensations.length; i++) {
            if (!compensations[i].claimed) {
                pending[index] = compensations[i];
                index++;
            }
        }
        
        return pending;
    }
    
    /**
     * @dev Get all outage events
     */
    function getAllOutages() external view returns (OutageEvent[] memory) {
        return outageEvents;
    }
    
    /**
     * @dev Get outage statistics
     */
    function getOutageStats() external view returns (uint256, uint256, uint256) {
        return (totalOutages, totalCompensations, COMPENSATION_RATE);
    }
}