// app/page.tsx
import Interview from "@/components/Interview";
import InterviewInfo from "@/components/InterviewInfo";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { v } from "convex/values";
import React from "react";

export default async function InterviewPage({ searchParams }: { searchParams: { id: Id<"assess"> } }) {
  return (
    <InterviewInfo _idObj={searchParams}/>
  );
}