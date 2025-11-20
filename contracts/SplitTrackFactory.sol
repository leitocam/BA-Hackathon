// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SongNFT.sol";
import "./RevenueSplitter.sol";

contract SplitTrackFactory {
    event SongCreated(
        address nftAddress,
        address splitterAddress,
        string metadataURI
    );

    function createSong(
        string calldata name_,
        string calldata symbol_,
        string calldata metadataURI_,
        address[] calldata recipients_,
        uint256[] calldata percentages_
    ) external returns (address nft, address splitter) {

        splitter = address(new RevenueSplitter(recipients_, percentages_));

        nft = address(new SongNFT(name_, symbol_, metadataURI_, msg.sender));

        emit SongCreated(nft, splitter, metadataURI_);
    }

}
