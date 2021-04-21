//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

enum DepositStatus {None, Pending, InProgress, Executed, Rejected}

struct Deposit {
    address tokenAddress;
    uint256 amount;
    address depositor;
    bytes recipient;
    DepositStatus status;
}