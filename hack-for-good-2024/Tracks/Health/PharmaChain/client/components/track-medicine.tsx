'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader, Search } from 'lucide-react'
// import // toast from 'react-hot-// toast'
import { TrackItemMapComponent } from './track-item-map'
import { useWeb3 } from '../app/contexts/Web3Context'


export function TrackMedicine() {
  const { PharmaContract, accounts } = useWeb3();
  const [medicineId, setMedicineId] = useState('')
  const [medicineData, setMedicineData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [MapRefreshData, SetMapRefreshData] = useState(0)
  const [newCheckpoint, setNewCheckpoint] = useState({
    location: '',
    latitude: '',
    longitude: '',
    status: 'intransit'
  })

  const handleTrackMedicine = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)
    // toast.loading("Fetching medicine data...")

    try {
      const medicineData = await PharmaContract.Medicines(medicineId);

      const organization = await PharmaContract.Organizations(medicineData.OrganizationId);
      const organizationName = organization.name;

      const expiryDateTimestamp = Number(medicineData.expiryDate); // Convert BigInt to number
      const manufacturingDateTimestamp = Number(medicineData.manufacturingDate); // Convert BigInt to number

      const expiryDate = new Date(expiryDateTimestamp * 1000);
      const manufacturingDate = new Date(manufacturingDateTimestamp * 1000);

      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedExpiryDate = formatDate(expiryDate);
      const formattedManufacturingDate = formatDate(manufacturingDate);

      const medId = Number(medicineData.id)

      const mockData = {
        name: medicineData.name,
        id: medId,
        organizationName: organizationName,
        manufacturingDate: formattedManufacturingDate,
        expiryDate: formattedExpiryDate
      };

      setMedicineData(mockData)
      SetMapRefreshData(MapRefreshData + 1)


    } catch (error) {
      console.error('Error creating Organization:', error);
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleAddCheckpoint = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (medicineData == null) {
        alert("Load a medicine first");
        return;
      }

      let transaction;

      if (newCheckpoint.status === 'intransit') {
        transaction = await PharmaContract.addInTransitCheckpoint(
          medicineId,
          newCheckpoint.location,
          newCheckpoint.latitude,
          newCheckpoint.longitude
        );
      } else if (newCheckpoint.status === 'shipped') {
        transaction = await PharmaContract.addShippedCheckpoint(
          medicineId,
          newCheckpoint.location,
          newCheckpoint.latitude,
          newCheckpoint.longitude
        );
      } else if (newCheckpoint.status === 'sold') {
        transaction = await PharmaContract.addSoldCheckpoint(
          medicineId,
          newCheckpoint.location,
          newCheckpoint.latitude,
          newCheckpoint.longitude
        );
      } else {
        throw new Error("Invalid status given");
      }

      // Wait for the transaction to be mined
      await transaction.wait();
    } catch (error) {
      console.error('Error adding Checkpoint: ', error);
    }
    finally {
      SetMapRefreshData(MapRefreshData + 1)
    }
    console.log("New Checkpoint:", newCheckpoint)

    setIsLoading(false)

    setNewCheckpoint({
      location: '',
      latitude: '',
      longitude: '',
      status: 'intransit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* <header className="top-0 left-0 right-0 z-10 py-4 bg-gray-800 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Track Medicine</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#about" className="text-white hover:text-cyan-400 transition-colors">About</a></li>
              <li><a href="#features" className="text-white hover:text-cyan-400 transition-colors">Manage Organization</a></li>
              <li><a href="#track" className="text-white hover:text-cyan-400 transition-colors">Track a Medicine</a></li>
              <li><a href="#team" className="text-white hover:text-cyan-400 transition-colors">Our Team</a></li>
            </ul>
          </nav>
        </div>
      </header> */}

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-100">Enter Medicine ID</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackMedicine} className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter medicine ID"
                value={medicineId}
                onChange={(e) => setMedicineId(e.target.value)}
                className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
              />
              <Button type="submit" className="bg-gray-600 hover:bg-gray-700 text-gray-100" disabled={isLoading}>
                {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {medicineData && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-gray-100">Medicine Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Medicine Name</Label>
                  <p className="text-gray-100">{medicineData.name}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Medicine ID</Label>
                  <p className="text-gray-100">{medicineData.id}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Organization Name</Label>
                  <p className="text-gray-100">{medicineData.organizationName}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Manufacturing Date</Label>
                  <p className="text-gray-100">{medicineData.manufacturingDate}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Expiry Date</Label>
                  <p className="text-gray-100">{medicineData.expiryDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

         {/* ////////////////////////// */}

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Add New Checkpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCheckpoint} className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-gray-100">Location Name</Label>
                <Input
                  id="location"
                  value={newCheckpoint.location}
                  onChange={(e) => setNewCheckpoint({ ...newCheckpoint, location: e.target.value })}
                  className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude" className="text-gray-100">Latitude</Label>
                  <Input
                    id="latitude"
                    value={newCheckpoint.latitude}
                    onChange={(e) => setNewCheckpoint({ ...newCheckpoint, latitude: e.target.value })}
                    className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-gray-100">Longitude</Label>
                  <Input
                    id="longitude"
                    value={newCheckpoint.longitude}
                    onChange={(e) => setNewCheckpoint({ ...newCheckpoint, longitude: e.target.value })}
                    className="bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-100">Status</Label>
                <RadioGroup
                  value={newCheckpoint.status}
                  onValueChange={(value) => setNewCheckpoint({ ...newCheckpoint, status: value })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intransit" id="intransit" />
                    <Label htmlFor="intransit" className="text-gray-100">In Transit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shipped" id="shipped" />
                    <Label htmlFor="shipped" className="text-gray-100">Shipped</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sold" id="sold" />
                    <Label htmlFor="sold" className="text-gray-100">Sold</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="bg-gray-600 hover:bg-gray-700 text-gray-100" disabled={isLoading}>
                {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Checkpoint
              </Button>
            </form>
          </CardContent>
        </Card>
        {medicineData && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-gray-100">Track Location</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackItemMapComponent id={Number(medicineId)} refreshData={MapRefreshData} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}