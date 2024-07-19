// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Advertoken is ERC20, Ownable {
   
    uint256 public adPrice;
    uint public shareRate;
    uint constant _initial_supply = 10000 * (10**18);

    constructor(uint256 _adPrice, uint _shareRate) ERC20("Advertoken", "AT") Ownable(msg.sender){
        _mint(msg.sender, _initial_supply);
        adPrice = _adPrice;
        shareRate = _shareRate;
    }

    function changePrice(uint256 _adPrice) external onlyOwner{
        adPrice = _adPrice;
    }

    function changeShareRate(uint _shareRate) external onlyOwner{
        shareRate = _shareRate;
    }

    function withdraw() public onlyOwner  {
        uint256 balance = balanceOf(address(this));
        if(balance > 0){
            transfer(msg.sender, balance);    
        }                  
    }
	
	struct Ad{
		uint id;
        address advertiser;
        uint256 amount;
        string text;
        bool isActive;
	}

    Ad[] adlist;

    mapping(uint => mapping(address => bool)) adAllowance;

	function add(uint256 amount, string calldata text) external {
        require(!getAdvertiserHasAd(msg.sender), "There is an existing advert for this account");
        require(allowance(msg.sender, address(this)) >= amount, "Approval failed");
		adlist.push(Ad(adlist.length, msg.sender, amount, text, true));
	}

	function showAd(uint adId) public{
        if(!adAllowance[adId][msg.sender]){
            require(adlist[adId].amount >= adPrice, "Insufficient balance");
            require(adlist[adId].isActive, "Advert is not active");
            share(adId, msg.sender);
            adAllowance[adId][msg.sender] = true;
        }
	}

    function getAdText(uint adId) public view returns(string memory){
        require(adAllowance[adId][msg.sender], "Advert is not allowed");
        return adlist[adId].text;
    }

    function getAll() public view returns(uint[] memory){
        uint counter;
       for(uint i=0; i< adlist.length; i++){
            if(adlist[i].isActive){
                counter++;
            }
       }
        uint[] memory activeAdList = new uint[](counter);
        counter = 0;
        for(uint i=0; i< adlist.length; i++){
            if(adlist[i].isActive){
                activeAdList[counter] = adlist[i].id;
                counter++;
            }
       }
       return activeAdList;
	}

    event Share(address advertiser, address viewer, uint256 price, uint shareRate);

    function share(uint adId, address viewer) private{
        uint256 viewerAmount = adPrice * shareRate / 100;
        uint256 contractAmount = adPrice - viewerAmount;

        this.transferFrom(adlist[adId].advertiser, viewer, viewerAmount);
        this.transferFrom(adlist[adId].advertiser, address(this), contractAmount);

        adlist[adId].amount -= adPrice;
        if(adlist[adId].amount < adPrice){
            adlist[adId].isActive = false;
        }
        
        emit Share(adlist[adId].advertiser, viewer, adPrice, shareRate);
    }

    event LoadBalance(uint adId, uint256 amount);

    function loadBalance(uint adId, uint256 amount) external{
        require(allowance(msg.sender, address(this)) >= amount, "Approval failed");
        adlist[adId].amount += amount;
        if(!adlist[adId].isActive && adlist[adId].amount >= adPrice){
            adlist[adId].isActive = true;
        }
        emit LoadBalance(adId, amount);
    }

    function getAdvertiserHasAd(address advertiser) private view returns(bool){
        for(uint i=0; i<adlist.length; i++){
            if(adlist[i].advertiser == advertiser){
                return true;
            }
        }
        return false;
    }
}
