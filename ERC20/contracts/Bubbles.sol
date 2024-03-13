// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bubbles is ERC20, Ownable {

    mapping(address => uint256) private _stakes;
    mapping(address => uint256) private _lastStakeTimestamp;
    uint256 private _rewardRate = 1;
    uint256 private lockInPeriod = 60;

    constructor(address initialOwner) 
        ERC20("Bubbles", "BUB") 
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 input) public {
        uint256 convertedA = input * 1e18;
        _mint(to, convertedA);
    }

    function stake(uint256 input) public {
        uint256 convertedA = input * 1e18;
        _stakes[msg.sender] += convertedA;
        _lastStakeTimestamp[msg.sender] = block.timestamp;
        _transfer(msg.sender, address(this), convertedA);
        require(convertedA > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= convertedA, "Insufficient balance");        
  }

    function getStake(address account) public view returns (uint256) {
        uint256 stakedInWei = _stakes[account];
        uint256 stakedInEth = stakedInWei / 1e18;
        return stakedInEth;
  }

    function withdraw() public {
        require(block.timestamp > (_lastStakeTimestamp[msg.sender] + lockInPeriod), "You cannot withdraw funds, you are still in the lock in period");
        require(_stakes[msg.sender] > 0, "No staked tokens");
        uint256 stakedinput = _stakes[msg.sender];
        uint256 reward = ((block.timestamp - _lastStakeTimestamp[msg.sender]) * _rewardRate) * 1e18;
        _stakes[msg.sender] = 0;
        _transfer(address(this), msg.sender, stakedinput);
        _mint(msg.sender, reward);
  }

    function getWithdraw(address account) public view returns (uint256) {
        uint256 stakedinput = _stakes[msg.sender] / 1e18;
        uint256 reward = ((block.timestamp - _lastStakeTimestamp[account]) * _rewardRate);
        uint256 total = reward + stakedinput; 
        return total;
  }

     function getElapsedStakeTime(address account) public view returns (uint256) {
        uint256 time = (block.timestamp - _lastStakeTimestamp[account]);
        return time;
  } 

    function getLastStakeTimestamp(address account) public view returns (uint256) {
        return _lastStakeTimestamp[account];
  }


    
}