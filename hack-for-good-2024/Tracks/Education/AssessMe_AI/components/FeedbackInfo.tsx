"use client"
import Interview from "@/components/Interview";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import FeedbackDisplay from "./FeedbackDisplay";

interface FeedbackInfoProps {
    _idObj: { id: Id<"feedback"> };
}

export default async function FeedbackInfo({ _idObj }: FeedbackInfoProps) {
const { id } = _idObj; 
const _id = id; 

const feedbackInfo = useQuery(api.feedback.getFeedbackById, { _id }); 
  console.log(feedbackInfo);

  if (!feedbackInfo) {
    return <div></div>;
  }

  return (
    <div>
      <FeedbackDisplay feedbackInfo={feedbackInfo[0]} />
    </div>
  );
}