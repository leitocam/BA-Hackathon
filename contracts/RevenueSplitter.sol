// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RevenueSplitter {
    address[] public recipients;
    uint256[] public percentages; // base 10000 (100% = 10000)

    constructor(address[] memory _recipients, uint256[] memory _percentages) {
        require(_recipients.length == _percentages.length, "len mismatch");

        uint256 total;
        for (uint256 i = 0; i < _percentages.length; i++) {
            total += _percentages[i];
        }
        require(total == 10000, "must sum 100%");

        recipients = _recipients;
        percentages = _percentages;
    }

    receive() external payable {
        // Mimic puede mirar este evento (aunque no es necesario emitir uno)
    }

    function distribute() external {
        uint256 bal = address(this).balance;
        require(bal > 0, "empty");

        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 amount = (bal * percentages[i]) / 10000;
            // Se usa call en lugar de transfer, ya que transfer está obsoleto y limitado a 2300 gas
            (bool success, ) = recipients[i].call{value: amount}("");
            require(success, "ETH transfer failed");
        }
    }
}