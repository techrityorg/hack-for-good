"use client"
import Interview from "@/components/Interview";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";

interface InterviewInfoProps {
    _idObj: { id: Id<"assess"> };
}

export default async function InterviewInfo({ _idObj }: InterviewInfoProps) {
const { id } = _idObj; 
const _id = id; 

const getInterviewInfo = useQuery(api.assess.getAssessmentCardById, { _id }); 
  const interviewInfo = getInterviewInfo
  console.log(interviewInfo);

  if (!interviewInfo) {
    return <div></div>;
  }

  return (
    <div>
      <Interview interviewInfo={interviewInfo[0]} />
    </div>
  );
}