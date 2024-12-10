"use client"
import React, { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from './ui/card'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  ResponsiveContainer
} from 'recharts';
import { Button } from './ui/button';
import { Divide, Shield, Sword } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Id } from '@/convex/_generated/dataModel';

type FeedbackListProps = {
  title: string;
  feedbackList: { feedbackHeading: string; feedback: string }[];
};

const FeedbackList = ({ title, feedbackList }: FeedbackListProps) => (
  <Card>
    <CardContent className="flex items-center justify-center p-6">
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-semibold'>{title}</h1>
        <div className='w-full h-2 bg-gradient-to-br from-violet-500 to-pink-300 rounded-xl'></div>
        <ul className="text-start">
          {feedbackList.map((item, index) => (
            <li className='mb-2' key={index}>
              <strong>{item.feedbackHeading}</strong>: {item.feedback}
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);

type Props = {
  feedbackInfo: {
    _id: Id<"feedback">;
    _creationTime: number;
    analytics: {
      maxPoints: number;
      parameter: string;
      points: number;
    }[];
    companyName: string;
    jobProfile: string;
    jobRequirements: string;
    jobtype: string;
    level: string;
    name: string;
    overview: string;
    questions: {
      answer: string;
      improvements: {
        feedback: string;
        feedbackHeading: string;
      }[];
      isAI?: boolean;
      question: string;
      strengths: {
        feedback: string;
        feedbackHeading: string;
      }[];
    }[];
    userId: string;
  };
};

const FeedbackDisplay = ({feedbackInfo}: Props) => {
  const result = feedbackInfo;
  const simplifiedAnalytics = result.analytics.map(({ parameter, points, maxPoints }) => ({
    parameter,
    points,
    maxPoints,
  }));
  const parameterList = result.analytics.map(({ parameter, points, maxPoints }) => (
    <li className='font-semibold' key={parameter}>
      {parameter}: <span className='font-normal'>{points}/{maxPoints}</span>
    </li>
  ));
  const tooltipContentStyle = {
    color: 'black', 
    backgroundColor: 'white', 
    border: '1px solid #ccc', 
    borderRadius: '10px' 
  };

  const overviewList = result.overview.split('.');

  const overviewItems = overviewList.map((item, index) => (
    <li key={index} className={`text-start ml-6 mb-2 ${index === overviewList.length - 1 ? '' : 'list-disc'}`}>
      {item.trim()}{index === overviewList.length - 1 ? '' : '.'}
    </li>
  ));

  const [showStrengths, setShowStrengths] = useState(true);

  const toggleFeedback = () => {
    setShowStrengths((prev) => !prev);
  };

  const feedbackList = showStrengths
    ? feedbackInfo.questions.map((question) => question.strengths)
    : feedbackInfo.questions.map((question) => question.improvements);

  return (
    <div className='flex p-4 relative overflow-hidden antialiased min-h-screen flex-col items-center justify-center pt-28'>
      <div className='flex items-center min-h-screen max-w-7xl w-full flex-col gap-4 p-0'>
        <div className='w-full  flex justify-center'>
          <Carousel className="w-full  h-full max-w-6xl">
            <CarouselContent>
                <CarouselItem>
                  <div className="p-1">
                    <Card className=''>
                      <CardContent className="flex flex-col h-full gap-4 lg:aspect-video items-start justify-start p-6">
                        <h1 className="text-2xl sm:text-4xl font-semibold">
                          Overview Of Interview
                        </h1>
                        <div className='flex flex-col md:flex-row p-0'>
                          <div className='flex flex-col'>
                            <div className='flex-1 flex flex-col'>
                              <div className='flex p-4 rounded-lg justify-center shadow-md shadow-black mb-6 items-center gap-2 sm:gap-8 pb-6 pt-4 flex-col sm:flex-row sm:justify-start'>
                                <div>
                                  <ResponsiveContainer className={''} width={200} aspect={1}>
                                    <RadarChart outerRadius={90} data={simplifiedAnalytics}>
                                      <PolarGrid />
                                      <PolarAngleAxis dataKey="parameter" tick={false} />
                                      <PolarRadiusAxis angle={30} domain={[0, 150]} />
                                      <Radar name={result.name} dataKey="points" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                      <Tooltip contentStyle={tooltipContentStyle}/>
                                    </RadarChart>
                                  </ResponsiveContainer>
                                </div>
                                <div className='p-4 pt-0 rounded-lg shadow-md shadow-black'>
                                  <ul className='flex mt-4 gap-2 justify-between flex-row flex-wrap px-4'>
                                    {parameterList}
                                  </ul>
                                </div>
                              </div>
                              <div className={cn('p-4 mb-6 rounded-lg shadow-md shadow-black pt-8 pl-0 hidden lg:block')}>
                                <ResponsiveContainer width="100%" aspect={4}>
                                  <AreaChart width={1050} height={250} data={simplifiedAnalytics}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <XAxis dataKey="parameter" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip contentStyle={tooltipContentStyle} />
                                    <Area type="monotone" dataKey="points" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                    <Area type="monotone" dataKey="maxpoints" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            <div className='text-lg flex flex-col gap-4 flex-1 pt-4'>
                              <p className='text-2xl sm:text-4xl font-semibold text-start'>Remark by AI</p>
                              <ul className="text-start">
                                {overviewItems}
                              </ul>
                            </div>    
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                {result.questions.map((question, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex items-center justify-center p-6">
                        <div className='flex flex-col gap-4'>
                          <h1 className="text-2xl sm:text-4xl font-semibold">Feedback For Ques. {index + 1}</h1>
                          <div className='flex flex-col sm:flex-row gap-12'>
                            <div className='flex flex-col gap-4'>
                              <h1 className='text-xl sm:text-3xl font-semibold'>{question.question}</h1>
                              <div className='w-full h-2 bg-gradient-to-br from-violet-500 to-pink-300 rounded-xl'></div>
                              <p className='text-lg'><span className='font-bold'>{result.name}'s answer :</span> {question.answer}</p>
                            </div>
                            <div className='flex flex-col gap-4'>
                              <div className='text-center'>
                              <Button className='p-4 shadow-md shadow-black border-none bg-gradient-to-br from-violet-500 to-violet-300 text-white rounded-xl' onClick={toggleFeedback}>
                                {showStrengths ? 
                                <div className='flex m-2 flex-row items-center text-base gap-2'><Shield/> Show Improvements</div> : <div className='flex m-2 flex-row items-center text-base gap-2'><Sword/> Show Strengths</div>}
                              </Button>
                              </div>
                              {showStrengths ? (
                                <FeedbackList title="Strengths" feedbackList={question.strengths} />
                              ) : (
                                <FeedbackList title="Improvements" feedbackList={question.improvements} />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default FeedbackDisplay