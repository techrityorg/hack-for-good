import React from 'react'
import { Id } from '@/convex/_generated/dataModel';
import FeedbackInfo from '@/components/FeedbackInfo';

type Props = {}

export default async function Feedback ({searchParams}:{
  searchParams:{
    id: Id<"feedback">;
  }
}){
    return (
    <div><FeedbackInfo _idObj={searchParams}/></div>
  )
}