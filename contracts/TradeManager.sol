// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EnergyToken.sol";

/**
 * @title TradeManager
 * @dev Manages energy token trading between users
 */
contract TradeManager is ReentrancyGuard, Ownable {
    EnergyToken public energyToken;
    
    struct TradeOffer {
        address seller;
        uint256 amount;
        uint256 pricePerToken; // in wei
        string location;
        bool isActive;
        uint256 timestamp;
    }
    
    struct Trade {
        address buyer;
        address seller;
        uint256 amount;
        uint256 totalPrice;
        uint256 timestamp;
        bool completed;
    }
    
    // State variables
    TradeOffer[] public tradeOffers;
    Trade[] public trades;
    
    mapping(address => uint256[]) public userOffers;
    mapping(address => uint256[]) public userTrades;
    
    uint256 public totalTrades;
    uint256 public totalVolume;
    
    // Events
    event TradeOfferCreated(uint256 indexed offerId, address indexed seller, uint256 amount, uint256 price);
    event TradeExecuted(uint256 indexed tradeId, address indexed buyer, address indexed seller, uint256 amount, uint256 price);
    event TradeOfferCancelled(uint256 indexed offerId, address indexed seller);
    
    constructor(address _energyToken) Ownable(msg.sender) {
        energyToken = EnergyToken(_energyToken);
    }
    
    /**
     * @dev Create a new trade offer
     */
    function createTradeOffer(
        uint256 _amount,
        uint256 _pricePerToken,
        string memory _location
    ) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_pricePerToken > 0, "Price must be greater than 0");
        require(energyToken.balanceOf(msg.sender) >= _amount, "Insufficient token balance");
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(bytes(_location).length <= 100, "Location too long");
        
        // Transfer tokens to contract as escrow
        require(energyToken.transferFrom(msg.sender, address(this), _amount), "Token transfer to escrow failed");
        
        uint256 offerId = tradeOffers.length;
        tradeOffers.push(TradeOffer({
            seller: msg.sender,
            amount: _amount,
            pricePerToken: _pricePerToken,
            location: _location,
            isActive: true,
            timestamp: block.timestamp
        }));
        
        userOffers[msg.sender].push(offerId);
        
        emit TradeOfferCreated(offerId, msg.sender, _amount, _pricePerToken);
    }
    
    /**
     * @dev Execute a trade by buying from an offer
     */
    function executeTrade(uint256 _offerId) external payable nonReentrant {
        require(_offerId < tradeOffers.length, "Invalid offer ID");
        TradeOffer storage offer = tradeOffers[_offerId];
        
        require(offer.isActive, "Offer is not active");
        require(msg.sender != offer.seller, "Cannot buy from yourself");
        
        uint256 totalPrice = offer.amount * offer.pricePerToken;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Transfer tokens from contract escrow to buyer
        require(energyToken.transfer(msg.sender, offer.amount), "Token transfer failed");
        
        // Transfer payment to seller
        (bool success, ) = payable(offer.seller).call{value: totalPrice}("");
        require(success, "Payment transfer failed");
        
        // Refund excess payment
        if (msg.value > totalPrice) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - totalPrice}("");
            require(refundSuccess, "Refund transfer failed");
        }
        
        // Create trade record
        uint256 tradeId = trades.length;
        trades.push(Trade({
            buyer: msg.sender,
            seller: offer.seller,
            amount: offer.amount,
            totalPrice: totalPrice,
            timestamp: block.timestamp,
            completed: true
        }));
        
        userTrades[msg.sender].push(tradeId);
        userTrades[offer.seller].push(tradeId);
        
        // Deactivate offer
        offer.isActive = false;
        
        // Update stats
        totalTrades++;
        totalVolume += totalPrice;
        
        emit TradeExecuted(tradeId, msg.sender, offer.seller, offer.amount, totalPrice);
    }
    
    /**
     * @dev Cancel a trade offer
     */
    function cancelTradeOffer(uint256 _offerId) external {
        require(_offerId < tradeOffers.length, "Invalid offer ID");
        TradeOffer storage offer = tradeOffers[_offerId];
        
        require(offer.seller == msg.sender, "Only seller can cancel");
        require(offer.isActive, "Offer is already inactive");
        
        // Return tokens from escrow to seller
        require(energyToken.transfer(msg.sender, offer.amount), "Token return failed");
        
        offer.isActive = false;
        
        emit TradeOfferCancelled(_offerId, msg.sender);
    }
    
    /**
     * @dev Get all active trade offers
     */
    function getActiveOffers() external view returns (TradeOffer[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < tradeOffers.length; i++) {
            if (tradeOffers[i].isActive) {
                activeCount++;
            }
        }
        
        TradeOffer[] memory activeOffers = new TradeOffer[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < tradeOffers.length; i++) {
            if (tradeOffers[i].isActive) {
                activeOffers[index] = tradeOffers[i];
                index++;
            }
        }
        
        return activeOffers;
    }
    
    /**
     * @dev Get user's trade history
     */
    function getUserTrades(address user) external view returns (Trade[] memory) {
        uint256[] memory userTradeIds = userTrades[user];
        Trade[] memory userTradeList = new Trade[](userTradeIds.length);
        
        for (uint256 i = 0; i < userTradeIds.length; i++) {
            userTradeList[i] = trades[userTradeIds[i]];
        }
        
        return userTradeList;
    }
    
    /**
     * @dev Get marketplace statistics
     */
    function getMarketplaceStats() external view returns (uint256, uint256, uint256) {
        return (tradeOffers.length, totalTrades, totalVolume);
    }
}