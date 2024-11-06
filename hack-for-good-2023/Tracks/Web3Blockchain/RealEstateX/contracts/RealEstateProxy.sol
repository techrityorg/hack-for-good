// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstateTokenProxy {
    address public implementation;
    address public admin;

    constructor(address _implementation) {
        implementation = _implementation;
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    fallback() external payable {
        address _impl = implementation;
        require(_impl != address(0), "Implementation contract not set");
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), _impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
                case 0 {
                    revert(0, returndatasize())
                }
                default {
                    return(0, returndatasize())
                }
        }
    }

    // Admin can upgrade the contract logic
    function upgradeImplementation(address _newImplementation) external onlyAdmin {
        require(_newImplementation != address(0), "New implementation address cannot be zero");
        implementation = _newImplementation;
    }

    // Receive function to allow the contract to receive Ether
    receive() external payable {}
}
