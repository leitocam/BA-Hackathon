// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SongNFT is ERC721, Ownable {
    string public metadataURI;
    uint256 public tokenIdCounter;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _metadataURI,
        address _initialOwner
    ) 
        ERC721(_name, _symbol) 
        Ownable(_initialOwner) 
    {
        metadataURI = _metadataURI;
    }

    function mint(address to) public onlyOwner returns (uint256) {
        uint256 id = tokenIdCounter;
        _safeMint(to, id); 
        tokenIdCounter += 1;
        return id;
    }

    function tokenURI(uint256) public view override returns (string memory) {
        return metadataURI;
    }

}
