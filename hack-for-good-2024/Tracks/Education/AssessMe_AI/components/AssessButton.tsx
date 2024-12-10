"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import NewAssessment from './NewAssessment';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AutomatedButton() {
  const [addDialog, setAddDialog] = useState(false);
  return (
    <>
        <Button className='p-3 shadow-md shadow-black border-none bg-gradient-to-br from-violet-500 to-violet-300 text-white rounded-xl' onClick={()=>setAddDialog(true)}>New Assessment</Button>
        <NewAssessment open={addDialog} setOpen={setAddDialog}/>
    </>    
  )
}