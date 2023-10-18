// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract StealthAddressRegistry {
  using SafeERC20 for IERC20;

  struct EphemeralKey {
    bytes32 x;
    bytes32 y;
    bytes1 sharedsecret;
    address token;
  }

  address constant Stealth = address(0x0);

  uint8 public constant VERSION = 1;

  address private owner;
  EphemeralKey[] keys;

  constructor() {
    owner = msg.sender;
  }

  function send(bytes32 x, bytes32 y, bytes1 sharedsecret, address token) private {
    keys.push(EphemeralKey(x, y, sharedsecret, token));
  }

  function totalKeys() view external returns (uint256 count) {
    count = keys.length;
  }

  function publishAndSend(bytes32 x, bytes32 y, bytes1 sharedsecret, address payable receiver) public payable {
    require(msg.value > 0, "Sending amount should be more than 0");
    require(receiver != address(0x0), "Target address required");

    send(x, y, sharedsecret, Stealth);

    // Calculate 0.1% of the sent amount
    uint256 feeAmount = (msg.value * 10) / 10000;

    // Transfer fee amount to the owner of the contract
    payable(owner).transfer(feeAmount);

    // Transfer the remaining amount to the receiver
    receiver.transfer(msg.value - feeAmount);
  }

  function publishAndSendToken(bytes32 x, bytes32 y, bytes1 sharedsecret, address token, address receiver, uint256 amount) external {
    require(amount > 0, "Sending amount should be greater than 0");
    require(token != address(0x0), "Token contract address cannot be Zero");
    require(receiver != address(0x0), "Receiver address cannot be Zero");

    send(x, y, sharedsecret, token);

     // Calculate 0.1% of the total amount
    uint256 feeAmount = (amount * 10) / 10000;

    // Transfer fee to the owner of the contract
    IERC20(token).safeTransfer(owner, feeAmount);

    // Transfer the rest of the amount to the receiver
    IERC20(token).safeTransferFrom(msg.sender, receiver, amount - feeAmount);

  }

  function getNextKeys(uint256 start) external view returns (EphemeralKey[10] memory) {
    EphemeralKey[10] memory gotKeys;

    uint256 end = start + 10;
    uint256 limit = (keys.length < end) ? keys.length : end;

    for (uint256 i=start; i < limit; i++) {
      gotKeys[i - start] = keys[i];
    }

    return gotKeys;
  }
}