'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { PlusCircle, Check, X } from 'lucide-react'
import { useWeb3 } from '../app/contexts/Web3Context';

export function ManageOrganization() {
  const { PharmaContract, accounts } = useWeb3();
  const [newMedicineName, setNewMedicineName] = useState('')
  const [newMedicineLocation, setNewMedicineLocation] = useState('')
  const [newMedicineLatitude, setNewMedicineLatitude] = useState('')
  const [newMedicineLongitude, setNewMedicineLongitude] = useState('')
  const [newMedicineExpiryDate, setNewMedicineExpiryDate] = useState('')
  const [newMemberAddress, setNewMemberAddress] = useState('')
  const [organizationName, setOrganizationName] = useState('')

  const handleCreateOrganization = async () => {
    try {
      console.log(accounts);
      
      const tx = await PharmaContract.createOrganization(organizationName);
      await tx.wait(); 
  
      console.log('Organization created successfully!');
    } catch (error) {
      console.error('Error creating Organization:', error);
    }
  };
  

  const handleLaunchMedicine = async (e) => {
    e.preventDefault();
    console.log('Launching new medicine:', {
      name: newMedicineName,
      location: newMedicineLocation,
      latitude: newMedicineLatitude,
      longitude: newMedicineLongitude,
      expiryDate: newMedicineExpiryDate,
    });
  
    try {
      const organizaitonId = await PharmaContract.getMyOrganizationId();
  
      const date = new Date(newMedicineExpiryDate + 'T00:00:00Z');
      const newDate = Math.floor(date.getTime() / 1000);
  
      const tx = await PharmaContract.manufactureMedicine(
        organizaitonId,
        newMedicineName,
        newDate,
        newMedicineLocation,
        newMedicineLatitude,
        newMedicineLongitude,
        {
          gasLimit: 500000, 
        }
      );
  
      const receipt = await tx.wait();
  
      // Check for the emitted event
      const event = receipt.events.find((event) => event.event === 'medicineLaunched');
      if (event) {
        const emittedMedicineId = event.args[0];
        alert(`Medicine Launched with ID: ${emittedMedicineId}`);
      }
  
    } catch (error) {
      console.error('Error creating Medicine:', error);
    }
  };

  
  const handleApproveMember = async () => {
    console.log('Approving member:', newMemberAddress);
    
    try {
      // Get the organization ID
      const organizaitonId = await PharmaContract.getMyOrganizationId();
  
      // Approve the new member
      const tx = await PharmaContract.approveMembers(organizaitonId, newMemberAddress, {
        gasLimit: 300000,
      });
  
      // Wait for the transaction to be confirmed
      await tx.wait();
    } catch (error) {
      console.error('Error approving new member:', error);
    }
  };
  
  const handleDisapproveMember = async () => {
    console.log('Disapproving member:', newMemberAddress);
  
    try {
      // Get the organization ID
      const organizaitonId = await PharmaContract.getMyOrganizationId();
  
      // Disapprove the member
      const tx = await PharmaContract.disApproveMembers(organizaitonId, newMemberAddress, {
        gasLimit: 300000,
      });
  
      // Wait for the transaction to be confirmed
      await tx.wait();
    } catch (error) {
      console.error('Error dis-approving new member:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* <header className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-100">Manage Organization</h1>
        </div>
      </header> */}

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="create-org" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create-org">Create Organization</TabsTrigger>
            <TabsTrigger value="launch-medicine">Launch Medicine</TabsTrigger>
            <TabsTrigger value="manage-members">Manage Members</TabsTrigger>
          </TabsList>

          <TabsContent value="create-org">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Create New Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  placeholder="Enter Organization Name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                />
                <p className="mb-4">Click the button below to create a new organization on the blockchain.</p>
                <Button onClick={handleCreateOrganization} className="bg-gray-600 hover:bg-gray-700 text-gray-100">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Organization
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="launch-medicine">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Launch New Medicine</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLaunchMedicine} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicine-name">Medicine Name</Label>
                    <Input
                      id="medicine-name"
                      value={newMedicineName}
                      onChange={(e) => setNewMedicineName(e.target.value)}
                      className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-location">Location Name</Label>
                    <Input
                      id="medicine-location"
                      value={newMedicineLocation}
                      onChange={(e) => setNewMedicineLocation(e.target.value)}
                      className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicine-latitude">Latitude</Label>
                      <Input
                        id="medicine-latitude"
                        value={newMedicineLatitude}
                        onChange={(e) => setNewMedicineLatitude(e.target.value)}
                        className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medicine-longitude">Longitude</Label>
                      <Input
                        id="medicine-longitude"
                        value={newMedicineLongitude}
                        onChange={(e) => setNewMedicineLongitude(e.target.value)}
                        className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-expiry">Expiry Date</Label>
                    <Input
                      id="medicine-expiry"
                      type="date"
                      value={newMedicineExpiryDate}
                      onChange={(e) => setNewMedicineExpiryDate(e.target.value)}
                      className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                    />
                  </div>
                  <Button type="submit" className="bg-gray-600 hover:bg-gray-700 text-gray-100">
                    Launch Medicine
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage-members">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Manage Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-address">Member Wallet Address</Label>
                    <Input
                      id="member-address"
                      value={newMemberAddress}
                      onChange={(e) => setNewMemberAddress(e.target.value)}
                      className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <Button onClick={handleApproveMember} className="bg-green-600 hover:bg-green-700 text-gray-100">
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button onClick={handleDisapproveMember} className="bg-red-600 hover:bg-red-700 text-gray-100">
                      <X className="mr-2 h-4 w-4" /> Disapprove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}