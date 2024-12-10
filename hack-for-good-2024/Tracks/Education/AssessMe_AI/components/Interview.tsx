"use client"
import React from 'react'
import { useEffect, useContext, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCompletion } from 'ai/react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { Player } from '@lottiefiles/react-lottie-player';
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

import { Focus, Info, Loader2, ScanEye, Sparkle, Sparkles, Video } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { beep } from '@/utils/audio';

import * as cocossd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import { DetectedObject, ObjectDetection } from '@tensorflow-models/coco-ssd';
import {drawOnCanvas} from '@/utils/draw'

import Webcam from 'react-webcam';
import { Camera, FlipHorizontal, Volume2 } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

type Props = {
  interviewInfo : {
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
  }
}

const Interview = ({interviewInfo}: Props) => {

  const generated_Question = useAction(api.assess.assess_action_GenerateResponse);
  const feedbackStore = useMutation(api.feedback.feedbackStore);

  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [redo, setRedo] = useState(false);
  const [interviewerTalking, setInterviewerTalking] = useState(false);
  const [questionDisplay, setQuestionDisplay] = useState('');
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  const router = useRouter();
  const speech = useRef<HTMLAudioElement | null>(null);
  const interviewerPlayer = useRef<any | null>(null);
  const ready = useRef(false);

  const [loading, setLoading] = useState(false);


  const [questions, setQuestions] = useState(
    interviewInfo.questions.map(question => ({
      question,
      answer: "",
      isAI: true,
      strengths: [], 
      improvements: [],
    }))
  );

  const parseAudio = async (blob : Blob) => {
    const res = await fetch('/api/speechToText', {
      method: 'POST',
      body: blob,
    });

    const result = await res.json();

    console.log(result, questions)
    
    const newQuestions = questions.slice();

    console.log(questions.slice())
    console.log(":}")
    console.log(newQuestions)

    newQuestions[questionsAnswered]['answer'] = result.answer;

    setQuestions(newQuestions);
    setQuestionsAnswered(questionsAnswered + 1);

    console.log(result.answer);
  };

  const askQuestion = () => {
    let requestBody: any = {};
    if (questionsAnswered == 0) {
      requestBody = {
        queryType: 'firstMessage',
        jobProfile: interviewInfo.jobProfile,
        companyName: interviewInfo.companyName,
        name: interviewInfo.name,
        question: questions[0].question,
      };
    } else if (questionsAnswered < interviewInfo.questions.length) {
      requestBody = {
        queryType: 'subsequentMessage',
        jobProfile: interviewInfo.jobProfile,
        companyName: interviewInfo.companyName,
        name: interviewInfo.name,
        question: questions[questionsAnswered].question,
        prevQuestion: questions[questionsAnswered - 1].question,
        prevAnswer: questions[questionsAnswered - 1].answer,
      };
    } else {
      requestBody = {
        queryType: 'lastMessage',
        jobProfile: interviewInfo.jobProfile,
        companyName: interviewInfo.companyName,
        name: interviewInfo.name,
        prevQuestion: questions[questionsAnswered - 1].question,
        prevAnswer: questions[questionsAnswered - 1].answer,
      };
    }
    generated_Question({ prompt: requestBody }).then((completion) => {
      textToSpeech(completion);
    });
  };

  const textToSpeech = async (input: string) => {
    const res = await fetch('/api/textToSpeech', {
      method: 'POST',
      body: JSON.stringify({
        text: input,
      }),
    });

    const result = await res.arrayBuffer();

    const blob = new Blob([result], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);

    audio.addEventListener('ended', function () {
      setInterviewerTalking(false);
      interviewerPlayer.current.setSeeker(239, false);
      if (questionsAnswered < questions.length) {
        startRecording();
        setQuestionDisplay(questions[questionsAnswered].question);
      } else {
        setInterviewComplete(true);
      }
    });

    if (ready.current) {
      audio.play();
      interviewerPlayer.current.play();
      setInterviewerTalking(true);
    } else {
      speech.current = audio;
    }
  };

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder({
    noiseSuppression: true,
    echoCancellation: true,
  });

  const redoQuestion = () => {
    setRedo(true);
    stopRecording();
  };

  useEffect(() => {
    setQuestionDisplay(
      'Welcome to your Interview, ' + interviewInfo.name.replace(/ .*/, '')
    );
  }, []);

  useEffect(() => {
    if (!recordingBlob) {
      return;
    }

    if (redo) {
      setRedo(false);
      startRecording();
      return;
    }

    parseAudio(recordingBlob);
  }, [recordingBlob]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      askQuestion();
    }, 1000); 
  
    return () => clearTimeout(timeoutId); 
  }, [questionsAnswered]);
  
  
  function delay(time : number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const onSubmit = async () => {
    try {
        setLoading(true);
        console.log("reached the submission area")
        console.log(questions)

        const response1 = await generated_Question({
          prompt: {
            queryType: "overall",
            jobProfile: interviewInfo.jobProfile,
            companyName: interviewInfo.companyName,
            jobtype: interviewInfo.jobtype,
            jobRequirements: interviewInfo.jobRequirements,
            questionsAfterInterview: questions,
          },
        });

        const response2 = questions.map((q) => {
          console.log(q.question, q.answer, ":)");
          return generated_Question({
            prompt: {
              queryType: "feedback",
              jobProfile: interviewInfo.jobProfile,
              companyName: interviewInfo.companyName,
              jobtype: interviewInfo.jobtype,
              jobRequirements: interviewInfo.jobRequirements,
              question: q.question,
              answer: q.answer,
            },
          });
        });
        // Promise.all to wait for all fetch requests to complete
        const response2Promise = await Promise.all(response2);

        const response3 = await generated_Question({
          prompt: {
            queryType: "generateAnalytics",
            jobProfile: interviewInfo.jobProfile,
            companyName: interviewInfo.companyName,
            jobtype: interviewInfo.jobtype,
            jobRequirements: interviewInfo.jobRequirements,
            questions: questions.map((q) => ({
              question: q.question,
              answer: q.answer,
            })),
          },
        });

        const feedbackData = await Promise.all(
          response2Promise.map(async (res, index) => {
            const response = await JSON.parse(res);
            console.log(`Response for question ${index + 1}:`, response);
            return response;
          })
        );
        
        console.log("final submission reached");
        
        const overallData = JSON.parse(response1);
        const analyticsData = JSON.parse(response3);
        
        console.log(overallData);
        console.log(feedbackData);
        console.log(analyticsData);
        
        const combinedQuestions = questions.map((question, index) => ({
          ...question,
          ...feedbackData[index],
        }));


        const response = await feedbackStore({
          name: interviewInfo.name,
          jobProfile: interviewInfo.jobProfile,
          companyName: interviewInfo.companyName,
          jobtype: interviewInfo.jobtype,
          jobRequirements: interviewInfo.jobRequirements,
          questions: combinedQuestions,
          level: interviewInfo.level,
          overview: overallData.feedback,
          analytics: analyticsData.interviewFeedbackAnalyticsRadar,
        });        
        if (response) {
          console.log("Request was successful!");
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(response)
          console.log("id ready");

          if (response) {
            console.log("Extracted id:", response);
            router.push(`/feedback?id=${response}`);
          } else {
            console.error("Error: Unable to extract id from the response.");
          }
        } 
      } catch (error) {
      console.error('Error submitting interview data:', error);
      console.error(error);
      alert("Error submitting interview data.");
    } finally {
      setLoading(false); // Set loading to false when the submission completes (either success or failure)
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    ready.current = true;
  
    if (speech.current !== null) {
      delay(1000).then(() => {
        speech.current?.play();
        if (interviewerPlayer.current !== null) {
          interviewerPlayer.current?.play();
          setInterviewerTalking(true);
        }
      });
    }
  };

  // webcam functionalities

  let interval : any = null;
  let stopTimeOut : any = null;

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mirriored, setMirrored] = useState<boolean>(true)
  const [isRec, setIsRec] = useState<boolean>(false)
  const [autoRec, setAutoRec] = useState<boolean>(true)
  const [volume, setVolume] = useState(0.8);
  const [model, setModel] = useState<ObjectDetection>();
  const [loadin, setLoadin] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(()=>{
    if(webcamRef && webcamRef.current){
      const stream = (webcamRef.current.video as any).captureStream();
      if(stream){
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          if(event.data.size > 0){
            const recordedBlob = new Blob([event.data], {type:'video'});
            const videoUrl = URL.createObjectURL(recordedBlob);
            const action = document.createElement('a');
            action.href = videoUrl;
            action.download =  `${formatData(new Date())}.webm`;
            action.click();
          }
        };
        mediaRecorderRef.current.onstart = (event) => {
          setIsRec(true);
        }
        mediaRecorderRef.current.onstop = (event) => {
          setIsRec(false);
        }
      }
    }
  },[])

  useEffect(()=>{
    setLoadin(true);
    initModel();
  },[])

  async function initModel(){
    const loadedModel: ObjectDetection = await cocossd.load({
      base: 'mobilenet_v2'
    });
    setModel(loadedModel)
  }

  useEffect(()=>{
    if(model){
      setLoadin(false);
    }
  },[model])

  // 0 : have nothing, 1 : have metadata, 2 : have current data, 3 : have future data, 4 : have enough data
  async function runPrediction(){
    if(model && webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const predictions: DetectedObject[] = await model.detect(webcamRef.current.video)
      // console.log(predictions)
      resizeCanvas(canvasRef, webcamRef);
      drawOnCanvas(mirriored, predictions, canvasRef.current?.getContext('2d'));

      let isPerson: boolean = false;

      if(predictions.length > 0){
        predictions.forEach((prediction)=>{
          isPerson = (prediction.class === 'person');
        })
        if(isPerson && autoRec){
          startRecordin(true);
        }
      }
    }
  }

  useEffect(()=>{
    interval = setInterval(()=>{
      runPrediction()
    },100)
    return ()=> clearInterval(interval)
  },[webcamRef.current, model, mirriored, autoRec])

  return (
      <>
        {loadin && 
        <div className='z-50 shadow-md shadow-black absolute bottom-5 right-5 p-4 rounded-lg flex items-center justify-center bg-gradient-to-tl from-violet-400 to-violet-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-600'>
          Proctoring Model is Loading <Loader2 className="animate-spin ml-2 w-5 h-5 text-white" />
        </div>
       }
        <div className='p-8 flex flex-col max-w-6xl mx-auto'>
        {loading ? (
          <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-tl from-violet-400 to-violet-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-violet-600 bg-opacity-75 flex items-center justify-center">
            <p className="text-white text-5xl">Submitting...</p>
          </div>
        ):(
          <div className='flex flex-col'>
            <div className="flex bg-secondary mx-6 mt-6 items-center rounded-3xl p-4">
            <div className="max-w-full max-h-120px flex flex-col-reverse">
              <div className="w-20vw border-b-0.5rem border-tl-gradient"></div>
              <h5 className="font-bold text-3xl">
                <span className="transition text-primary">{questionDisplay}</span>
              </h5>
            </div>
            <div className="ml-auto bg-gradient-tr-bl rounded-l-md flex items-center justify-center h-3rem w-10.45rem">
              <p className='p-3 whitespace-nowrap px-4 mr-3 font-semibold shadow-sm shadow-black border-none bg-gradient-to-tl from-pink-400 via-purple-400 to-indigo-500 text-white rounded-xl'>{interviewInfo.questions.length - questionsAnswered} {interviewInfo.questions.length - questionsAnswered === 1 ? 'question' : 'questions'} left</p>
              <Dialog open={modalOpen}>
            <DialogTrigger asChild className='p-3 px-4 font-semibold shadow-md shadow-black border-none bg-gradient-to-tl from-pink-400 via-purple-400 to-indigo-500 text-white rounded-xl h-12'>
              <Button className=''><Info className=''/></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className='text-2xl'>Welcome To Your Virtual Interview Style Assessment</DialogTitle>
              <DialogHeader>
                <div className='flex flex-col gap-2'>
                  <p>Once the interview starts, the interviewer will begin by welcoming
                  you and asking you the first question. Here are some tips for the
                  best interview experience:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Ensure you are in an environment with minimal background noise.</li>
                    <li>Talk clearly at a regular pace in the direction of your microphone.</li>
                    <li>Answer the questions appropriately and stay on topic.</li>
                  </ul>
                  <p>Best of luck! We'll see you afterwards with your feedback.</p>
                </div>
              </DialogHeader> 
              <DialogFooter>
                <DialogClose>
                  <Button className={'p-5 shadow-md shadow-black border-none bg-gradient-to-br from-violet-300 to-violet-500 text-white rounded-xl'} onClick={closeModal}>
                      Let's Begin
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
              </Dialog>
            </div>
              </div>
              <div className='rounded-lg flex justify-center flex-row p-6 px-0 gap-6'>
                <div className='bg-secondary relative rounded-3xl p-6 flex flex-col justify-center items-center'>
                  <Player loop src='/Speech.json' className='w-80' ref={interviewerPlayer} speed={1.25}></Player>
                  <Button className='absolute bottom-6 left-6 p-3 px-4 font-semibold shadow-sm shadow-black border-none bg-gradient-to-tl from-pink-400 via-purple-400 to-indigo-500 text-white rounded-xl'>AI Interviewer</Button>
                </div>
                <div className='relative'>
                  <div>
                    <Webcam
                      ref={webcamRef}
                      mirrored={mirriored}
                      style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
                      audio={false}
                    />
                    <canvas ref={canvasRef} className='absolute top-0 left-0 h-full w-full object-contain'></canvas>
                  </div>
                  <Button className={cn('absolute top-6 right-6 p-3 px-4 font-semibold shadow-sm shadow-black border-none bg-gradient-to-tl from-pink-400 via-purple-400 to-indigo-500 text-white rounded-xl', { hidden: interviewerPlayer ? '' : 'hidden' })}>
                    {interviewerTalking ? 'Please wait for the Interviewer to finish speaking' : 'You may answer the question now'}
                  </Button>
                  <Button className='absolute bottom-6 left-6 p-3 px-4 font-semibold shadow-sm shadow-black border-none bg-gradient-to-tl from-pink-400 via-purple-400 to-indigo-500 text-white rounded-xl'>
                    {interviewInfo.name}
                  </Button>
                </div>
              </div>
              <div className="flex flex-row justify-between w-full">
                <div className="mt-4 ml-6 gap-4 flex flex-row">
                  <Button className='p-5 shadow-md shadow-black border-none bg-gradient-to-r text-white rounded-xl from-rose-700 to-pink-600'  onClick={redoQuestion}>
                    Redo
                  </Button>
                  <Button type='submit' className='p-5 shadow-md shadow-black border-none bg-gradient-to-r text-white rounded-xl from-teal-700 to-teal-600'  onClick={interviewComplete ? () => onSubmit : stopRecording}>
                    {questionsAnswered == interviewInfo.questions.length ? 'Next Question' : 'Submit Answer'}
                  </Button>
                  <Button className='p-5 shadow-md shadow-black border-none bg-gradient-to-r text-white rounded-xl from-purple-700 to-pink-400' onClick={onSubmit} type='submit'>
                    {questionsAnswered == interviewInfo.questions.length ? 'End Interview' : 'End Interview'}
                  </Button>
                  <div className='flex flex-row gap-4'>
                    <Button className='p-5 shadow-md shadow-black border-none bg-gradient-to-r from-violet-500 to-violet-300 text-white rounded-xl' onClick={() => {setMirrored((prev) => !prev)}}><FlipHorizontal className='w-5 h-5'/></Button>
                    <Button className='p-5 shadow-md shadow-black border-none bg-gradient-to-r from-violet-500 to-violet-300 text-white rounded-xl' onClick={userPromptScreenshot}><Camera className='w-5 h-5'/></Button>
                    <Button className={cn('p-5 shadow-md shadow-black border-none bg-gradient-to-br from-rose-700 to-pink-600 text-white rounded-xl')} onClick={userPromptRecorder}>
                      {!isRec ? <Video /> : <Focus/>}
                    </Button>
                    <Button className={cn('p-5 shadow-md shadow-black border-none bg-gradient-to-br from-rose-700 to-pink-600 text-white rounded-xl')} onClick={toggleAutoRecord}>
                      {!autoRec ? <Sparkle /> : <Sparkles/>}
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className='p-5 shadow-md shadow-black border-none bg-gradient-to-r from-violet-500 to-violet-300 text-white rounded-xl' >
                          <Volume2 className='w-5 h-5' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='p-6 shadow-md shadow-black border-none bg-gradient-to-r from-violet-500 to-violet-300 text-white rounded-xl'>
                        <Slider
                          max={1}
                          min={0}
                          step={0.2}
                          defaultValue={[volume]}
                          onValueCommit={(val) => {
                            setVolume(val[0]);
                            beep(val[0])
                          }}
                          className='cursor-pointer'
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
          </div>
        )}
        </div>
      </>
      
  );
  
  function userPromptScreenshot(){
    if(!webcamRef.current){
      toast('Camera is not found. Please Refresh')
    }
    else{
      const imgSrc = webcamRef.current.getScreenshot();
      console.log(imgSrc);
      const blob = base64toBlob(imgSrc);
      const url = URL.createObjectURL(blob);
      const action = document.createElement('a');
      action.href = url;
      action.download = `${formatData(new Date())}.png`
      action.click();
    }
  }

  function userPromptRecorder(){
    if(!webcamRef.current){
      toast('Camera is not found. Please Refresh')
    }
    if(mediaRecorderRef.current?.state == 'recording'){
      mediaRecorderRef.current.requestData();
      clearTimeout(stopTimeOut);
      mediaRecorderRef.current.stop();
      toast('Recording saved to downloads');
    } else {
      startRecordin(false);
    }
  }

  function startRecordin(dobeep: boolean){
    if(webcamRef.current && mediaRecorderRef.current?.state !== 'recording'){
      mediaRecorderRef.current?.start();
      dobeep && beep(volume);
      stopTimeOut = setTimeout(()=>{
        if(mediaRecorderRef.current?.state === 'recording'){
          mediaRecorderRef.current.requestData();
          mediaRecorderRef.current.stop();
        }
      }, 30000)
    }
  }

  function toggleAutoRecord(){
    if(autoRec){
      setAutoRec(false)
      toast('Autorecord Disabled')
    } else {
      setAutoRec(true)
      toast('Autorecord Enabled')
    }
  }

}

// types already defined
function resizeCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, webcamRef: React.RefObject<Webcam>) {
  const canvas = canvasRef.current;
  const video = webcamRef.current?.video;

  if((canvas && video)){
    const {videoWidth, videoHeight} = video
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  }
}

function formatData(date: Date){
  const formattedDate =
  [
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
    date.getFullYear(),
  ]
    .join("-") +
  " " +
  [
    date.getHours().toString().padStart(2, "0"),
    date.getMinutes().toString().padStart(2, "0"),
    date.getSeconds().toString().padStart(2, "0"),
  ].join("-");
  return formattedDate;
}

function base64toBlob(base64Data: any) {
  const byteCharacters = atob(base64Data.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteCharacters.length);
  const byteArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: "image/png" }); // Specify the image type here
}

export default Interview