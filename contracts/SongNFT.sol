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
        address _initialOwner // Cambié el nombre de la variable para ser más claro
    ) 
        // Llama al constructor de ERC721 con nombre y símbolo
        ERC721(_name, _symbol) 
        // Llama al constructor de Ownable con el propietario inicial
        Ownable(_initialOwner) 
    {
        metadataURI = _metadataURI;
        // Se eliminó transferOwnership(_owner) ya que Ownable(_initialOwner) lo configura
    }

    // Nota: Es mejor usar external/public y no onlyOwner aquí, 
    // ya que el Factory debería ser el propietario y la función mint es llamada por el Factory
    function mint(address to) public onlyOwner returns (uint256) {
        uint256 id = tokenIdCounter;
        // Solo mintear si el token no existe, aunque el contador garantiza que es único
        _safeMint(to, id); 
        tokenIdCounter += 1;
        return id;
    }

    function tokenURI(uint256) public view override returns (string memory) {
        return metadataURI;
    }
}