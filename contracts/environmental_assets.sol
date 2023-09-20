// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/*********************************************************************************************************** */

/*
NOTES : 
This is a general smart contract template for managing environmental assets, such as renewable energy certificates, 
carbon credits, water rights, biodiversity offsets, conservation easements, and sustainable agriculture certificates.
This is a simplified and generalized template that can be customized for specific use cases. 
Please consult with legal experts to ensure regulatory compliance and tailor the contract to your needs.
*/

/*********************************************************************************************************** */



// Define the environmental asset contract
contract EnvironmentalAsset is Ownable {
    string public assetName;
    string public assetType;
    uint256 public totalSupply;
    uint256 public availableSupply;
    uint256 public assetPrice;
    uint256 public expirationDate;
    address public issuer;

    mapping(address => uint256) public balances;

    event AssetMinted(address indexed holder, uint256 amount);
    event AssetTransferred(address indexed from, address indexed to, uint256 amount);
    event CheckBalance(string text, uint amount);

    constructor(
        string memory _name,
        string memory _type,
        uint256 _initialSupply,
        uint256 _price,
        uint256 _expirationDate
    ) {
        assetName = _name;
        assetType = _type;
        totalSupply = _initialSupply;
        availableSupply = _initialSupply;
        assetPrice = _price;
        expirationDate = _expirationDate;
        issuer = msg.sender;
    }

    function mintAsset(address recipient, uint256 amount) external onlyOwner {
        require(availableSupply >= amount, "Insufficient available supply");
        balances[recipient] += amount;
        availableSupply -= amount;
        emit AssetMinted(recipient, amount);
    }

    function transferAsset(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit AssetTransferred(msg.sender, to, amount);
    }

    function revokeAsset() external onlyOwner {
        require(block.timestamp >= expirationDate, "Asset cannot be revoked before expiration");
        selfdestruct(payable(owner()));
    }

    function getBalance(address user_account) external returns (uint){
    
       string memory data = "User Balance is : ";
       uint user_bal = user_account.balance;
       emit CheckBalance(data, user_bal );
       return (user_bal);

    }
}
