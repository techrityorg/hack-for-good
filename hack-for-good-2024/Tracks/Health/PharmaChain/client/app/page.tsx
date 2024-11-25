'use client';

import Image from "next/image";
import { HomePageComponent } from "@/components/home-page";
import { ManageOrganization } from "@/components/manage-organization";
import { TrackMedicine } from "@/components/track-medicine";
import Topheader from "@/components/header";

export default function Home() {
  return (
    <>
        <HomePageComponent />
    </>
  );
}
