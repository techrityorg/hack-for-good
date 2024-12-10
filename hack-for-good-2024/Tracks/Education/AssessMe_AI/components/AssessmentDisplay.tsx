"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import NewAssessment from "./NewAssessment";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

export interface NoteProps {
  assessment: {
    _id: Id<"assess">;
    name: string;
    jobProfile: string;
    jobtype: string;
    companyName: string;
    jobRequirements: string;
    level: string;
    questions: string[];
    userId: string;
    _creationTime: number; 
  };
}

export default function AssessmentDisplay({ assessment }: NoteProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const router = useRouter();
  const createdAt = new Date(assessment._creationTime);

  const wasUpdated = createdAt;

  const createdUpdatedAtTimestamp = (
    createdAt
  ).toDateString();

  const diflevel = (value : string) => {
    const intValue = parseInt(value, 10);
    switch (intValue) {
        case 1:
            return 'Beginner';
        case 2:
            return 'Intermediate';
        case 3:
            return 'Expert/Hard';
        default:
            return 'Intermediate';
    }
  };

  return (
    <>
      <Card className="cursor-pointer shadow-md shadow-black bg-secondary transition-shadow hover:shadow-lg">
        <CardHeader onClick={() => setShowEditDialog(true)}>
          <CardTitle>{assessment.name}</CardTitle>
          <CardDescription onClick={() => setShowEditDialog(true)}>
            {createdUpdatedAtTimestamp}
          </CardDescription>
        </CardHeader>
        <CardContent onClick={() => setShowEditDialog(true)} className="mb-0 pb-0">
          <div className="mb-4">
            <p className="font-bold text-gray-600 dark:text-gray-400">Company : <span className="text-primary font-normal">{assessment.companyName}</span></p>
          </div>
          <div className="mb-4">
          <p className="font-bold text-gray-600 dark:text-gray-400">Title : <span className="text-primary font-normal">{assessment.jobtype}</span></p>
          </div>
          <div className="mb-4">
            <p className="font-bold text-gray-600 dark:text-gray-400">Difficulty Level : <span className="text-primary font-normal">{diflevel(assessment.level)}</span></p>
          </div>
          <div className="mb-4">
            <p className="font-bold text-gray-600 dark:text-gray-400">Example Question:</p>
            <ul className="list-disc pl-6">
              <li>{assessment.questions[0]}</li>
            </ul>
          </div>
        </CardContent>
        <div className="w-full flex justify-end">
          <Button className='p-3 m-6 shadow-md shadow-black border-none bg-gradient-to-tl from-violet-500 to-violet-300 text-white rounded-xl' onClick={() => setShowEditDialog(false)}>
            <Link className="flex flex-row" href={{
              pathname: '/interview',
              query: {
                id: assessment._id,
              },
            }}>
              <Bot className="w-5 h-5 mr-2"/>
              Let's Interview
            </Link>
          </Button>
        </div>
      </Card>
      <NewAssessment open={showEditDialog} setOpen={setShowEditDialog} toEdit={assessment}/>
    </>
  );
}