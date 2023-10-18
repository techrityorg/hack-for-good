// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import necessary Solidity libraries and contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Define the main contract, inheriting from ERC721URIStorage and Ownable
contract RealEstateToken is ERC721URIStorage, Ownable {
    // Define a struct to represent a real estate property
    struct Property {
        string propertyAddress;
        string description;
        uint256 price;
        uint256 totalUnits;
        uint256 rentalPrice;
    }

    // Array to store all the properties
    Property[] public properties;

    // Define a struct to represent a property listing
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 salePrice;
        bool isActive;
    }

    // Array to store property listings
    Listing[] public listings;

    // Mapping to track the owner of each property unit
    mapping(uint256 => address) public propertyToOwner;

    // Define events to log important contract actions
    event PropertyTokenized(
        uint256 propertyId,
        address indexed owner,
        string propertyAddress,
        string description,
        uint256 price,
        uint256 totalUnits
    );

    event UnitsPurchased(
        uint256 propertyId,
        address buyer,
        uint256 unitsPurchased,
        uint256 totalPrice
    );

    event UnitPurchased(
        uint256 listingId,
        address buyer,
        address seller,
        uint256 salePrice
    );

    event UnitListedForSale(
        uint256 listingId,
        address indexed seller,
        uint256 tokenId,
        uint256 salePrice
    );

    // Define a variable to represent the total rental income
    uint256 public rentalIncome;

    // Mapping to track the total units owned by each user
    mapping(address => uint256) public userOwnedUnits;

    // Mapping to store metadata URIs associated with token IDs for each real estate company
    mapping(address => mapping(uint256 => string)) private _tokenURIsByCompany;

    // Event to notify when rental income is collected and distributed
    event RentalIncomeDistributed(uint256 propertyId, uint256 totalIncome);

    // Constructor function to initialize the contract
    constructor() ERC721("RealEstateToken", "RET") {}

    // Function to tokenize a new property
    function tokenizeProperty(
        string memory _propertyAddress,
        string memory _description,
        uint256 _price,
        uint256 _totalUnits,
        uint256 _rentalPrice
    ) external {
        // Ensure that the total units are greater than 0
        require(_totalUnits > 0, "Total units must be greater than 0");

        // Create a new Property struct with the provided information
        Property memory newProperty = Property({
            propertyAddress: _propertyAddress,
            description: _description,
            price: _price,
            totalUnits: _totalUnits,
            rentalPrice: _rentalPrice
        });

        // Generate a unique property ID and add the property to the array
        uint256 propertyId = properties.length;
        properties.push(newProperty);

        // Mint NFTs for each unit and assign ownership to the caller
        for (uint256 i = 0; i < _totalUnits; i++) {
            uint256 tokenId = propertyId * _totalUnits + i;
            _mint(msg.sender, tokenId);
            propertyToOwner[tokenId] = msg.sender;
        }

        // Emit an event to notify the property tokenization
        emit PropertyTokenized(
            propertyId,
            owner(),
            _propertyAddress,
            _description,
            _price,
            _totalUnits
        );
    }

    // Function to buy property units
    function buyUnits(
        uint256 _propertyId,
        uint256 _unitsToBuy
    ) external payable {
        // Ensure that the number of units to buy is greater than 0
        require(
            _unitsToBuy > 0,
            "Number of units to buy must be greater than 0"
        );

        // Validate that the property exists
        require(_propertyId < properties.length, "Invalid property ID");

        // Calculate the total price for the units to buy
        uint256 totalPrice = properties[_propertyId].price * _unitsToBuy;

        // Ensure that the buyer has sent enough Ether
        require(msg.value >= totalPrice, "Insufficient Ether sent");

        // Calculate the token IDs to transfer
        uint256 startTokenId = _propertyId * properties[_propertyId].totalUnits;
        uint256 endTokenId = startTokenId + _unitsToBuy;

        // Transfer ownership of the selected NFTs from the seller to the buyer
        for (uint256 tokenId = startTokenId; tokenId < endTokenId; tokenId++) {
            require(
                ownerOf(tokenId) == owner(),
                "Seller does not own all units"
            );
            _transfer(owner(), msg.sender, tokenId);
        }

        // Refund any excess Ether sent
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        // Emit an event to notify the purchase
        emit UnitsPurchased(_propertyId, msg.sender, _unitsToBuy, totalPrice);
    }

    // Function to set or update the rental price for a property
    function setRentalPrice(
        uint256 _propertyId,
        uint256 _newRentalPrice
    ) external onlyOwner {
        // Ensure that the property exists
        require(_propertyId < properties.length, "Invalid property ID");

        // Update the rental price for the property
        properties[_propertyId].rentalPrice = _newRentalPrice;
    }

    // Function to collect and distribute rental income
    function collectAndDistributeRentalIncome(
        uint256 _propertyId,
        uint256 _income
    ) external onlyOwner {
        // Ensure that the property exists
        require(_propertyId < properties.length, "Invalid property ID");

        // Ensure that the income amount is greater than 0
        require(_income > 0, "Income amount must be greater than 0");

        // Update the rental income
        rentalIncome += _income;

        // Get the current rental price for the property
        uint256 currentRentalPrice = properties[_propertyId].rentalPrice;

        // Calculate the share of income for each unit owner based on the current rental price
        uint256 totalUnits = properties[_propertyId].totalUnits;
        uint256 sharePerUnit = (_income * currentRentalPrice) /
            (totalUnits * 1e18); // Assuming rentalPrice is in wei

        // Distribute income to unit owners
        for (uint256 i = 0; i < totalUnits; i++) {
            uint256 tokenId = _propertyId * totalUnits + i;
            address unitOwner = ownerOf(tokenId);
            userOwnedUnits[unitOwner] += 1; // Increment the units owned by the user
            payable(unitOwner).transfer(sharePerUnit); // Transfer income to the unit owner
        }

        // Emit an event to notify the distribution of rental income
        emit RentalIncomeDistributed(_propertyId, _income);
    }

    // Function to list an individual unit for sale
    function listUnitForSale(uint256 _tokenId, uint256 _salePrice) external {
        // Ensure that the caller owns the unit they are trying to list
        require(
            ownerOf(_tokenId) == msg.sender,
            "You can only list units you own"
        );

        // Ensure that the sale price is greater than 0
        require(_salePrice > 0, "Sale price must be greater than 0");

        // Create a new listing and add it to the array
        Listing memory newListing = Listing({
            tokenId: _tokenId,
            seller: msg.sender,
            salePrice: _salePrice,
            isActive: true
        });

        listings.push(newListing);

        // Emit an event to notify the listing
        emit UnitListedForSale(
            listings.length - 1,
            msg.sender,
            _tokenId,
            _salePrice
        );
    }

    // Function to buy a listed unit
    function buyUnit(uint256 _listingId) external payable {
        // Ensure that the listing ID is valid
        require(_listingId < listings.length, "Invalid listing ID");
        Listing storage listing = listings[_listingId];

        // Ensure that the listing is active
        require(listing.isActive, "Listing is not active");

        // Ensure that the buyer has sent enough Ether
        require(msg.value >= listing.salePrice, "Insufficient funds sent");

        // Transfer ownership of the NFT to the buyer
        _transfer(listing.seller, msg.sender, listing.tokenId);

        // Transfer the sale price to the seller
        payable(listing.seller).transfer(listing.salePrice);

        // Deactivate the listing
        listing.isActive = false;

        // Emit an event to notify the successful purchase
        emit UnitPurchased(
            _listingId,
            msg.sender,
            listing.seller,
            listing.salePrice
        );

        // Refund any excess funds sent
        if (msg.value > listing.salePrice) {
            payable(msg.sender).transfer(msg.value - listing.salePrice);
        }
    }

    // Function to set the metadata URI for a specific token ID by the real estate company
    function setTokenURI(uint256 tokenId, string memory tokenURI) external {
        // Check that the sender is the owner of the token
        require(
            ownerOf(tokenId) == msg.sender,
            "You can only set metadata for your own tokens"
        );

        // Set the metadata URI for the token
        _setTokenURI(tokenId, tokenURI);

        // Store the metadata URI for the real estate company
        _tokenURIsByCompany[msg.sender][tokenId] = tokenURI;
    }
}
