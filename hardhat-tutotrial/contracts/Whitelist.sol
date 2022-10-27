//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Whitelist {
    uint8 public maxWhitelistedAddresses;

    mapping(address => bool) public whitelistedAddresses;

    uint8 public numWhitelistedAddresses;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        require(
            !whitelistedAddresses[msg.sender],
            "Sender has already been whitelisted"
        );

        require(
            numWhitelistedAddresses <= maxWhitelistedAddresses,
            "More addresses cant be added, limit reached"
        );

        whitelistedAddresses[msg.sender] = true;

        numWhitelistedAddresses += 1;
    }
}
