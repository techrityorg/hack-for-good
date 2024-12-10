// EventPage.tsx
import { auth, clerkClient } from "@clerk/nextjs";
import { Metadata } from "next";
import React from 'react';
import AssessButton from "@/components/AssessButton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, PencilRuler, ScrollIcon, ScrollTextIcon, SearchCheck, StickyNote, Text, Trophy } from "lucide-react";
import { SelectSeparator } from "@/components/ui/select";
import AssessmentDisplay from "@/components/AssessmentDisplay";
import EveryAssessmentCard from "@/components/EveryAssessmentCard";
import InputImg from "@/components/InputImg";
import InputPdf from "@/components/InputPdf";


type Props = {
}

const Dashboard = async ({}: Props) => {


  const {userId} = auth();

  const userlist = await clerkClient.users.getUserList();
  const currentUser = userlist.find(user => user.id === userId);
  const userName = `${currentUser?.firstName} ${currentUser?.lastName}` || undefined;
  
  if (!userId) throw Error("userId undefined");

  return (
    <div className="flex flex-col max-w-6xl mx-auto mt-10 gap-8 p-4 mb-4">

      <div className="w-full flex flex-col sm:flex-row gap-4">
        <div className="bg-secondary p-6 rounded-lg shadow-md shadow-black flex flex-col gap-4">
          <h1 className="font-semibold">Join Your Interview</h1>
          <p>Seize your opportunity! Join your interview seamlessly by using the provided meeting ID as a candidate.</p>
        </div>
        <div className="bg-secondary p-6 rounded-lg shadow-md shadow-black gap-4 flex flex-col">
          <h1 className="font-semibold">Self Assessment</h1>
          <p>Improve your interviewee skills, build your personalized interview environment and receive your feedback with analytics.</p>
          <div><AssessButton/></div>
        </div>
      </div>

      <div>
        <h1 className="bg-secondary flex flex-row gap-2 w-fit mb-4 p-2 px-4 shadow-md shadow-black text-lg text-start rounded-lg text-gray-600 dark:text-gray-400 items-center"><Text className="w-5 h-5"/>Extract Context for Assessment</h1>
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <InputImg/>
          <InputPdf/>
        </div>
      </div>

      <div>
        <h1 className="bg-secondary flex flex-row gap-2 w-fit mb-4 p-2 px-4 shadow-md shadow-black text-lg text-start rounded-lg text-gray-600 dark:text-gray-400 items-center"><ScrollTextIcon className="w-5 h-5"/> Self Assessment Cards</h1>
        <div className="grid gap-4 place-content-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <EveryAssessmentCard/>
        
        </div>
      </div>

    </div>
  )
}

export default Dashboard;
