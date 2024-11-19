// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

contract Pharma {

    struct Organization{
        string name;
        address owner;
        uint[] medicines;
        mapping(address => bool) approvedMembers;
    }

    struct Medicine{
        uint OrganizationId;
        uint id;
        string name;
        uint manufacturingDate;
        uint expiryDate;
        Checkpoint[] history;
    }

    struct Checkpoint{
        Status status;
        address handler;
        string locationName;
        int latitude;
        int longitude;
        uint date;
    }

        enum Status{
        Manufactured,
        InTransit,
        Shipped,
        Sold
    }



    mapping(uint => Organization) public  Organizations;
    uint public nextOrganizationId;
    mapping(uint=> Medicine) public Medicines;
    uint public nextMedicineId;

    mapping(address => uint) public OrganizationOwners;

    modifier onlyOrganizationOwner(uint organizationId){
        require(Organizations[organizationId].owner == msg.sender, "You are not Owner of Organization");
        _;
    }

    modifier onlyApprovedMembers(uint medicineId){
        uint organizationId = Medicines[medicineId].OrganizationId;
        require(Organizations[organizationId].approvedMembers[msg.sender] == true, "You are not an approved member of this Organization.");
        _;
    }

    modifier organizationExists(uint organizationId){
        require(nextOrganizationId > organizationId, "Invalid Organization Id");
        _;
    }

    modifier medicineExists(uint medicineId){
        require(nextMedicineId > medicineId, "Invalid medicine Id");
        _;
    }

    event medicineLaunched(uint medicineId);
    event organizationLaunched(uint organizationId);

    function createOrganization(string calldata name) external {
        Organizations[nextOrganizationId].name = name;
        Organizations[nextOrganizationId].owner = msg.sender;
        OrganizationOwners[msg.sender] = (nextOrganizationId);
        emit organizationLaunched(nextOrganizationId);
        nextOrganizationId += 1;
    }

    function manufactureMedicine(uint _organizationId, string calldata medicineName, uint expiryDate, string calldata location, int latitude, int longitude) external organizationExists(_organizationId) onlyOrganizationOwner(_organizationId) {

        Organizations[_organizationId].medicines.push(nextMedicineId);

        Medicines[nextMedicineId].OrganizationId = _organizationId;
        Medicines[nextMedicineId].id = nextMedicineId;
        Medicines[nextMedicineId].name = medicineName;
        Medicines[nextMedicineId].manufacturingDate = block.timestamp;
        Medicines[nextMedicineId].expiryDate = expiryDate;

        Medicines[nextMedicineId].history.push(Checkpoint({
            status: Status.Manufactured,
            handler: msg.sender,
            locationName: location,
            latitude: latitude,
            longitude: longitude,
            date: block.timestamp
        }));
        emit medicineLaunched(nextMedicineId);
        nextMedicineId += 1;
    }

    function getMedicineHistory(uint medicineId) view external returns(Checkpoint[] memory){
        return Medicines[medicineId].history;
    }

    function getMedicines(uint organizationId) view external returns(Medicine[] memory){
        uint nrMedicines = Organizations[organizationId].medicines.length;
        Medicine[] memory ReturnMedicines = new Medicine[](nrMedicines);

        for (uint i = 0; i < nrMedicines; i++) 
        {
            uint medIdx = Organizations[organizationId].medicines[i];
            ReturnMedicines[i] = (Medicines[medIdx]);
        }

        return ReturnMedicines;
    }

    function approveMembers(uint _organizaitonId, address newMember) external organizationExists(_organizaitonId) onlyOrganizationOwner(_organizaitonId)  {
        Organizations[_organizaitonId].approvedMembers[newMember] = true;
    }

    function disApproveMembers(uint _organizaitonId, address newMember) external organizationExists(_organizaitonId) onlyOrganizationOwner(_organizaitonId)  {
        Organizations[_organizaitonId].approvedMembers[newMember] = false;
    }

    function addInTransitCheckpoint(uint medicineId, string calldata locationName, int latitude, int longitude) external medicineExists(medicineId) onlyApprovedMembers(medicineId) {
        uint lastStatus = uint(getLatestStatus(medicineId));
        if (lastStatus != 0 && lastStatus != 1){
            revert("invalid Id, item not in transit or manufacured status");
        }
        addCheckpointData(medicineId, Status.InTransit, locationName, latitude, longitude);
    }

    function addShippedCheckpoint(uint medicineId, string calldata locationName, int latitude, int longitude) external medicineExists(medicineId) onlyApprovedMembers(medicineId) {
        uint lastStatus = uint(getLatestStatus(medicineId));
        if (lastStatus > 1){
            revert("invalid Id, item not in transit");
        }
        addCheckpointData(medicineId, Status.Shipped, locationName, latitude, longitude);
    }

    function addSoldCheckpoint(uint medicineId, string calldata locationName, int latitude, int longitude) external medicineExists(medicineId) onlyApprovedMembers(medicineId) {
        uint lastStatus = uint(getLatestStatus(medicineId));
        if (lastStatus != 2){
            revert("invalid status Id, item not shipped yet");
        }
        addCheckpointData(medicineId, Status.Sold, locationName, latitude, longitude);
    }
    function addCheckpointData(uint medicineId, Status newStatus, string calldata locationName, int latitude, int longitude) internal{
        Medicines[medicineId].history.push(Checkpoint({
            status: newStatus,
            handler: msg.sender,
            locationName: locationName,
            latitude: latitude,
            longitude: longitude,
            date: block.timestamp
        }));
    }

    function getLatestStatus(uint medicineId) public view returns(Status){
        Status lastStatus;
        if (Medicines[medicineId].history.length > 0){
            lastStatus = Medicines[medicineId].history[Medicines[medicineId].history.length - 1].status;
        }
        return lastStatus;
    }

    function isMemberOfOrganization(uint organizationId, address member) public view organizationExists(organizationId) returns(bool){
        return Organizations[organizationId].approvedMembers[member];
    }

    function getMyOrganizationId() external view returns(int){
        return int(OrganizationOwners[msg.sender]);
    }

}