'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import { useWeb3 } from '../app/contexts/Web3Context'

const statusMapping: { [key: number]: string } = {
  0: 'Manufactured',
  1: 'In Transit',
  2: 'Shipped',
  3: 'Sold'
};

interface TrackingItem {
  id: number;
  location: string;
  date: string;
  status: string;
  coordinates: [number, number];
}

// const trackingData = [
//   { id: 1, location: "New York City, NY", date: "2023-06-01", status: "Shipped", coordinates: [40.7128, -74.0060] },
//   { id: 2, location: "Columbus, OH", date: "2023-06-03", status: "In Transit", coordinates: [39.9612, -82.9988] },
//   { id: 3, location: "Chicago, IL", date: "2023-06-05", status: "In Transit", coordinates: [41.8781, -87.6298] },
//   { id: 4, location: "Denver, CO", date: "2023-06-07", status: "In Transit", coordinates: [39.7392, -104.9903] },
//   { id: 5, location: "Las Vegas, NV", date: "2023-06-09", status: "Out for Delivery", coordinates: [36.1699, -115.1398] },
// ]



interface TrackItemMapProps {
  id: number;
  refreshData: number;
}

export function TrackItemMapComponent({ id, refreshData }: TrackItemMapProps) {
  const { PharmaContract, accounts } = useWeb3();
  const [trackingData, setTrackingData] = useState<TrackingItem[]>([]);


  // useEffect(() => {
  //   if(typeof window !== 'undefined'){
  //     delete L.Icon.Default.prototype._getIconUrl
  //     L.Icon.Default.mergeOptions({
  //       iconRetinaUrl: '/marker-icon-2x.png',
  //       iconUrl: '/marker-icon.png',
  //       shadowUrl: '/marker-shadow.png',
  //     })
  //   }
  // }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const data = await PharmaContract.getMedicineHistory(id);

        // Transform the data
        const formattedData: TrackingItem[] = data.map((item: any, index: number) => ({
          id: index + 1, // Mark id as index + 1
          location: item.locationName, // Map locationName from the contract
          date: new Date(Number(item.date) * 1000).toISOString().split('T')[0], // Convert epoch to YYYY-MM-DD
          status: statusMapping[item.status], // Map status code to string
          coordinates: [Number(item.latitude), Number(item.longitude)] // Map latitude and longitude
        }));
        setTrackingData(formattedData);
        console.log(formattedData)
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      }
    };

    init();
  }, [refreshData]);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Track Your Item</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {trackingData.map((item, index) => (
              <div key={item.id} className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-grow ml-4 font-medium">
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                  <p className="text-base">{item.location}</p>
                  <Badge variant={index === 0 ? "default" : "secondary"} className="mt-1">
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 h-[600px] rounded-lg overflow-hidden">
            {typeof window !== 'undefined' && trackingData && trackingData.length > 0 && trackingData[0].coordinates != null &&
              <MapContainer
                // @ts-ignore
                center={trackingData[0].coordinates} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  // @ts-ignore
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {trackingData.map((item) => (
                  <Marker key={item.id} position={item.coordinates as [number, number]}>
                    <Popup>{item.location}<br />{item.date}</Popup>
                  </Marker>
                ))}
                <Polyline positions={trackingData.map(item => item.coordinates as [number, number])}
                  // @ts-ignore
                  color="blue" />
              </MapContainer>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}