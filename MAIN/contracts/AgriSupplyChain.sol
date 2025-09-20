// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriSupplyChain {
    address public owner;
    uint public itemCounter = 0;

    enum State { Harvested, ForSaleByFarmer, PurchasedByDistributor, ShippedByDistributor, ReceivedByRetailer, ForSaleByRetailer, PurchasedByConsumer }

    struct Item {
        uint id;
        string name;
        string origin;
        uint price;  // In wei
        string quality;
        State state;
        address farmer;
        address distributor;
        address retailer;
        address consumer;
    }

    mapping(uint => Item) public items;

    mapping(address => bool) public isFarmer;
    mapping(address => bool) public isDistributor;
    mapping(address => bool) public isRetailer;

    event Harvested(uint id);
    event PurchasedByDistributor(uint id);

    constructor() {
        owner = msg.sender;
    }

    function addFarmer(address _farmer) public { isFarmer[_farmer] = true; }
    function addDistributor(address _dist) public { isDistributor[_dist] = true; }
    function addRetailer(address _retailer) public { isRetailer[_retailer] = true; }

    function harvestItem(string memory _name, string memory _origin, uint _price, string memory _quality) public {
        require(isFarmer[msg.sender], "Only farmers can harvest");
        itemCounter++;
        items[itemCounter] = Item(itemCounter, _name, _origin, _price, _quality, State.Harvested, msg.sender, address(0), address(0), address(0));
        emit Harvested(itemCounter);
    }

    function purchaseByDistributor(uint _id) public payable {
        Item storage item = items[_id];
        require(item.state == State.Harvested, "Not ready for purchase");
        require(isDistributor[msg.sender], "Only distributors");
        require(msg.value >= item.price, "Insufficient payment");
        item.distributor = msg.sender;
        item.state = State.PurchasedByDistributor;
        payable(item.farmer).transfer(msg.value);
        emit PurchasedByDistributor(_id);
    }

    function getItem(uint _id) public view returns (Item memory) {
        return items[_id];
    }
}