const Pharma = artifacts.require("Pharma");

contract("Pharma", accounts => {
    let pharmaInstance;
    const [owner, member1, member2] = accounts;

    before(async () => {
        pharmaInstance = await Pharma.deployed();
    });

    it("should create an organization", async () => {
        await pharmaInstance.createOrganization("Org1", { from: owner });
        const org = await pharmaInstance.Organizations(0);
        assert.equal(org.name, "Org1", "Organization name should be 'Org1'");
        assert.equal(org.owner, owner, "Organization owner should be the sender");
    });

    it("should not access organizaiton which donot exist", async () => {
        try {
            await pharmaInstance.approveMembers(1, member1, { from: owner });
            assert.fail("Expected error was not thrown");
        } catch (error) {
            assert(
                error.message.includes("Invalid Organization Id"), 
                "Expected error message should contain 'Invalid Organization Id'"
            );
        }
    });

    it("should manufacture a medicine", async () => {
        await pharmaInstance.createOrganization("Org1", { from: owner });
        await pharmaInstance.approveMembers(0, member1, { from: owner });
        await pharmaInstance.manufactureMedicine(0, "Medicine1", Date.now() + 10000, "Location1", 10, 20, { from: owner });

        const medicines = await pharmaInstance.getMedicines(0);
        assert.equal(medicines.length, 1, "There should be 1 medicine");
        assert.equal(medicines[0].name, "Medicine1", "Medicine name should be 'Medicine1'");
    });

    it("should get medicine history", async () => {
        const medicineId = 0;
        const history = await pharmaInstance.getMedicineHistory(medicineId);
        assert.equal(history.length, 1, "There should be 1 checkpoint");
        assert.equal(history[0].status.toString(), "0", "First status should be 'Manufactured'");
    });

    it("should approve and disapprove members", async () => {
        await pharmaInstance.approveMembers(0, member1, { from: owner });
        let isApproved = await pharmaInstance.isMemberOfOrganization(0, member1);
        assert.isTrue(isApproved, "Member1 should be approved");

        await pharmaInstance.disApproveMembers(0, member1, { from: owner });
        isApproved = await pharmaInstance.isMemberOfOrganization(0, member1);
        assert.isFalse(isApproved, "Member1 should be disapproved");
    });

    it("should add checkpoints correctly", async () => {
        await pharmaInstance.createOrganization("Org1", { from: owner });

        await pharmaInstance.approveMembers(0, member1, { from: owner });
        await pharmaInstance.addInTransitCheckpoint(0, "Location2", 15, 25, { from: member1 });
        await pharmaInstance.addShippedCheckpoint(0, "Location3", 20, 30, { from: member1 });
        await pharmaInstance.addSoldCheckpoint(0, "Location4", 25, 35, { from: member1 });
        const history = await pharmaInstance.getMedicineHistory(0);
        assert.equal(history.length, 4, "There should be 4 checkpoints");
        assert.equal(history[1].status.toString(), "1", "Second status should be 'InTransit'");
        assert.equal(history[2].status.toString(), "2", "Third status should be 'Shipped'");
        assert.equal(history[3].status.toString(), "3", "Fourth status should be 'Sold'");
    });

    it("should revert if adding checkpoint with invalid status", async () => {
        try {
            await pharmaInstance.addInTransitCheckpoint(0, "InvalidLocation", 30, 40, { from: member1 });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.message.includes("invalid Id, item not in transit or manufacured status"), "Revert error should be due to invalid status");
        }
    });

    it("should revert if member is not approved", async () => {
        try {
            await pharmaInstance.addShippedCheckpoint(0, "InvalidLocation", 35, 45, { from: member2 });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.message.includes("You are not an approved member of this Organization."), "Revert error should be due to not approved member");
        }
    });

    it("should revert if organization does not exist", async () => {
        try {
            await pharmaInstance.manufactureMedicine(999, "Medicine3", Date.now() + 10000, "Location5", 40, 50, { from: owner });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.message.includes("Invalid Organization Id"), "Revert error should be due to non-existent organization");
        }
    });

    it("should revert if medicine does not exist", async () => {
        try {
            await pharmaInstance.addShippedCheckpoint(999, "InvalidLocation", 45, 55, { from: member1 });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.message.includes("Invalid medicine Id"), "Revert error should be due to non-existent medicine");
        }
    });
});
