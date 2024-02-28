//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Whitelist.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    // _price is the price of the NFT
    uint256 constant public _price = 0.01 ether;

    //Max number of CryptoDevs that can exist
    uint256 constant public maxTokenIds = 20;
    
    // Whitelist contract instance
    Whitelist whitelist;
    // Number of tokens reserver for whitelisted members
    uint256 public reservedTokens;
    uint256 public reservedTokensClaimed = 0;

    /**
      * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
      * name in our case is `Crypto Devs` and symbol is `CD`.
      * Constructor for Crypto Devs takes in the baseURI to set _baseTokenURI for the collection.
      * It also initializes an instance of whitelist interface.
      */

     constructor(address whitelistContract) Ownable (msg.sender) ERC721("Crypto Devs", "CD") {
        whitelist = Whitelist(whitelistContract);
        reservedTokens = whitelist.maxWhitelistedAddresses();
     }

     function mint() public payable {
        // make sure we leave enough room for whitelist reservations
        require(totalSupply() + reservedTokens - reservedTokensClaimed <
        maxTokenIds, "EXCEEDED_MAX_SUPPLY"); 
        //if user is part of the whitelist, make sure there is still reserver tokens left
        if(whitelist.whitelistedAddresses(msg.sender) && msg.value < _price) {
            //Make sure user doesn't already own an NFT
            require(balanceOf(msg.sender) == 0, "ALREADY_OWNED");
            reservedTokensClaimed += 1;
        } else {
            //if user is not part of the whitelist, make sure they have enough ETH
            require(msg.value >= _price, "NOT_ENOUGH_ETHER");
        }
        uint256 tokenId = totalSupply();
        _safeMint(msg.sender, tokenId);
     }

/**
    * @dev withdraw sends all the ether in the contract
    * to the owner of the contract
      */
     function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent,) = _owner.call{value: amount} ("");
        require(sent, "Failed to send Ether");
     }
}
