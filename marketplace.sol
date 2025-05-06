// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/access/Ownable.sol";

interface ILateMealNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract LateMealMarketplace is ReentrancyGuard, Ownable {
    ILateMealNFT public lateMealToken;
    uint256 public fixedPrice;
    string private baseTokenURI;

    struct Listing {
        address seller;
        bool isListed;
    }

    mapping(uint256 => Listing) public listings;
    uint256[] public listedTokenIds;

    event TokenListed(uint256 indexed tokenId, address indexed seller);
    event TokenPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event TokenDelisted(uint256 indexed tokenId, address indexed seller);
    event PriceUpdated(uint256 newPrice);

    constructor(address _nftContract, uint256 _initialPrice) {
        lateMealToken = ILateMealNFT(_nftContract);
        fixedPrice = _initialPrice;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function setFixedPrice(uint256 _price) external onlyOwner {
        require(_price > 0, "Price must be greater than zero");
        fixedPrice = _price;
        emit PriceUpdated(_price);
    }

    function listToken(uint256 tokenId) external {
        require(lateMealToken.ownerOf(tokenId) == msg.sender, "Not your token");
        require(!listings[tokenId].isListed, "Already listed");

        lateMealToken.transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing(msg.sender, true);
        listedTokenIds.push(tokenId);

        emit TokenListed(tokenId, msg.sender);
    }

    function buyToken(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isListed, "Token not listed");
        require(msg.value == fixedPrice, "Incorrect ETH amount");

        delete listings[tokenId];
        _removeTokenIdFromListed(tokenId);

        payable(listing.seller).transfer(msg.value);
        lateMealToken.safeTransferFrom(address(this), msg.sender, tokenId);

        emit TokenPurchased(tokenId, msg.sender, msg.value);
    }

    function delistToken(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not your listing");
        require(listing.isListed, "Not listed");

        delete listings[tokenId];
        _removeTokenIdFromListed(tokenId);

        lateMealToken.safeTransferFrom(address(this), msg.sender, tokenId);
        emit TokenDelisted(tokenId, msg.sender);
    }

    function getAllListings() external view returns (uint256[] memory) {
        return listedTokenIds;
    }

    function _removeTokenIdFromListed(uint256 tokenId) internal {
        uint256 len = listedTokenIds.length;
        for (uint256 i = 0; i < len; i++) {
            if (listedTokenIds[i] == tokenId) {
                listedTokenIds[i] = listedTokenIds[len - 1];
                listedTokenIds.pop();
                break;
            }
        }
    }
}