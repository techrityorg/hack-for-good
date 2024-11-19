'use client';

import { ManageOrganization } from "@/components/manage-organization";
import Topheader from "@/components/header";
import { Web3Provider } from '../contexts/Web3Context';

export default function ManageOrganizationPage() {
  return (
    <>
      <Topheader title="Manage Organization" />
      {/* <Web3Provider> */}
        <ManageOrganization />
      {/* </Web3Provider> */}
    </>
  );
}
