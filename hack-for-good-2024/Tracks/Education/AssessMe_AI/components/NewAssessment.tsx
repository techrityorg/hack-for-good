"use client"
import {createAssessSchema, CreateAssessSchema } from '@/lib/validation/dashboard'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { Dialog,DialogTitle, DialogContent, DialogFooter, DialogHeader } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { ArrowLeft, ArrowRight, Loader2, MinusCircle, Plus, PlusCircle, Star, Trash } from 'lucide-react'
import LoadingButton from './ui/loading-btn'
import { Droppable, Draggable, DragDropContext } from '@hello-pangea/dnd';
import { DropResult } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import styled from '@emotion/styled';
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { Id } from '@/convex/_generated/dataModel'
import { assess_action_GenerateResponse } from '@/convex/assess'
import { useSearchParams } from 'next/navigation';


type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
    toEdit?: {
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
    }, 
    searchParams?: {
        id: string,
        jobProfile: string,
        jobType: string,
        companyName: string,
        jobRequirements: string,
    } 
}

interface StyledDraggableProps {
    isDragging: boolean;
  }

const NewAssessment = ({open, setOpen, toEdit}: Props) => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const jobProfile = searchParams.get('jobProfile');
    const jobType = searchParams.get('jobType');
    const companyName = searchParams.get('companyName');
    const jobRequirements = searchParams.get('jobRequirements');

    const create = useAction(api.assess.assess_create);
    const remove = useMutation(api.assess.assess_delete);
    const update = useMutation(api.assess.assess_update);
    const generated_Question = useAction(api.assess.assess_action_GenerateResponse);
    
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [formStep, setFormStep] = React.useState(0);
    const [curateWithAILoading, setCurateWithAILoading] = useState(false);
    const router = useRouter();

    const StyledDraggable = styled.div<StyledDraggableProps>`
    top: auto !important;
    left: auto !important;
    background-color: ${props => (props.isDragging ? 'lightpurple' : 'initial')};
  `;
    const form = useForm<CreateAssessSchema>({
        resolver: zodResolver(createAssessSchema),
        defaultValues: {
            name: toEdit?.name || "",
            jobProfile: toEdit?.jobProfile || jobProfile || "",
            jobtype: toEdit?.jobtype || jobType || "",
            companyName: toEdit?.companyName || companyName || "",
            jobRequirements: toEdit?.jobRequirements || jobRequirements || "",
            level: toEdit?.level || "",
            questions: toEdit?.questions || [],
        },
    });    

    async function onSubmit(input:CreateAssessSchema) {
        console.log("reached the submission area")
        try{
            if (toEdit) {
              const promise = update({id: toEdit._id, name: input.name, jobProfile: input.jobProfile, jobRequirements: input.jobRequirements, companyName: input.companyName, level: input.level, questions: input.questions, jobtype: input.jobtype})
              toast.promise(promise, {
                loading: "Updating Assessment Card",
                success: "Assessment Card Updated",
                error: "Failed to update your Assessment Card"
            })
            } else {
                const promise = create({name: input.name, jobProfile: input.jobProfile, jobRequirements: input.jobRequirements, companyName: input.companyName, level: input.level, questions: input.questions, jobtype: input.jobtype})
                toast.promise(promise, {
                    loading: "Creating Assessment Card",
                    success: "Assessment Card Created",
                    error: "Failed to create your Assessment Card"
                })
                form.reset();
              }
            router.refresh();
            setOpen(false);
            setFormStep(0); 
        } catch (error){
            console.error(error);
            alert("Something went wrong, Please try again.");
        }
    }

    async function deleteEvent() {
        if (!toEdit) return;
        setDeleteInProgress(true);
        try {
          const promise = remove({id: toEdit?._id});
          toast.promise(promise,{
            loading: "Deleting Assessment Card",
            success: "Assessment Card Deleted",
            error: "Failed to delete the Assessment Card",
          })
          router.refresh();
          setOpen(false);
        } catch (error) {
          console.error(error);
          alert("Something went wrong. Please try again.");
        } finally {
          setDeleteInProgress(false);
        }
    }

    const generateQuestion = async (index: number) => {
        setCurateWithAILoading(true);
        const { jobProfile, companyName, jobtype, jobRequirements, questions, level } = form.getValues();
        console.log(jobProfile, companyName, jobtype, jobRequirements, level);
        try {
          console.log("reached convex");
          const response = await generated_Question({
            prompt: {
              queryType: 'generateQuestion',
              jobProfile: jobProfile,
              companyName: companyName,
              jobtype: jobtype,
              jobRequirements: jobRequirements,
              questions: questions.map((q) => ({ question: q, answer: '' })),
              level: level,
            },
          });
      
          console.log('Response:', response);
      
          const received = JSON.parse(response);
          const generatedQuestion = received.question;
          console.log(`result : ${generatedQuestion}`);
      
          // Update the questions
          const newQuestions = [...form.getValues('questions')];
          newQuestions[index] = generatedQuestion;
          form.setValue('questions', newQuestions);
        } catch (error) {
          console.error('Error generating AI question:', error);
          toast.error(`Failed to generate AI question: ${error}`);
        } finally {
          setCurateWithAILoading(false);
        }
    };
      
    async function onDragEnd(result: DropResult) {
        if (!result.destination) {return;}
      
        const newQuestions = [...form.getValues('questions')];
        const [movedQuestion] = newQuestions.splice(result.source.index, 1);
        newQuestions.splice(result.destination.index, 0, movedQuestion);
      
        form.setValue('questions', newQuestions);
      }

    const addQuestion = () => {
        const newQuestions = [...form.getValues('questions'), ''];
        form.setValue('questions', newQuestions);
    };

    const removeQuestion = (index: number) => {
        const newQuestions = [...form.getValues('questions')];
        newQuestions.splice(index, 1);
        form.setValue('questions', newQuestions);
    };    
    
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>{toEdit ? "Edit Assessment" : "Add Assessment"}</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form className='space-y-3' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className={cn('space-y-3',{hidden: formStep == 1})}>
                                    <FormField control={form.control} name='name' render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Your Name</FormLabel>
                                        <FormControl><Input placeholder='Interviewee Name'{...field}/></FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                    )}/>
                                    <FormField control={form.control} name='jobProfile' render={({field})=>(
                                        <FormItem className='flex flex-col gap-0'>
                                            <FormLabel>Career Profile</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Assistant Engineer' {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="jobtype" render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Employment Title</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Your Employment Title" />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {['Internship', 'Part-Time', 'Full-Time', 'Contract', jobType ? jobType : "Trial"].map((title) => {
                                                    return (
                                                    <SelectItem value={title!.toString()} key={title}>
                                                        {title}
                                                    </SelectItem>
                                                    );
                                                })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                    )}/>
                                    <FormField control={form.control} name='companyName' render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Company Details</FormLabel>
                                        <FormControl>
                                        <Input placeholder='Apple.Inc' {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                    )}/>
                                    <FormField control={form.control} name='jobRequirements' render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Profile Requirement</FormLabel>
                                            <FormControl>
                                            <Textarea className='h-48' placeholder="Strong MERN development experience for 5+ years and experience in leading a team.
                                            • Expertise in JavaScript
                                            • HTML 5, CSS 3 & JSON
                                            • Superior ability to write good tests for 100% coverage in Jest or Mocha or Chai or Karma or Jasmine or Enzyme or Cypress
                                            • Excellent understanding of database, schema designing and hands-on complex SQL queries
                                            • Excellent understanding of REST services using NodeJS or Java Spring Boot" {...field}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name='level' render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Difficulty Level Of Interview <span className='text-green-800 dark:text-green-300'>({diflevel(field.value)})</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            className='cursor-pointer'
                                            placeholder='Difficulty Level'
                                            min={1}
                                            max={3}
                                            type="range"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                    )}/>

                        </div>
                        <div className={cn('space-y-3',{hidden: formStep == 0})}>
                            <FormField control={form.control} name='questions' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Questions</FormLabel>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="quesId">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {form.getValues('questions').map((question, index) => (
                                            <Draggable key={index} draggableId={`question-${index}`} index={index}>
                                            {(provided, snapshot, rubric) => (
                                                <StyledDraggable
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                isDragging={snapshot.isDragging}
                                                ref={provided.innerRef}
                                                >
                                                <FormItem>
                                                    <FormLabel>Question {index + 1}</FormLabel>
                                                    <div className='flex flex-col gap-2'>
                                                        <FormControl>
                                                            <Textarea
                                                                className='mb-2'
                                                                placeholder={`Enter question ${index + 1}`}
                                                                value={question}
                                                                onChange={(e) => {
                                                                const newQuestions = [...form.getValues('questions')];
                                                                newQuestions[index] = e.target.value;
                                                                form.setValue('questions', newQuestions);
                                                                }}
                                                            />
                                                        </FormControl>
                                                           <div className='flex flex-col gap-2 mb-4 sm:flex-row'>
                                                           <Button
                                                                    className={cn(
                                                                    'p-5 shadow-md shadow-black border-none bg-gradient-to-br from-violet-500 to-orange-300 text-white rounded-xl',
                                                                    { hidden: formStep === 0 },
                                                                    { 'opacity-60 cursor-not-allowed': curateWithAILoading }
                                                                    )}
                                                                    type="button"
                                                                    onClick={() => {
                                                                    if (!curateWithAILoading) {
                                                                        generateQuestion(index);
                                                                    }
                                                                    }}
                                                                >
                                                                    {curateWithAILoading && (
                                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                                    )}
                                                                    <Star className="w-5 h-5 mr-2"/>
                                                                    Curate with AI
                                                                </Button>
                                                            <Button className='p-5 shadow-md shadow-black border-none bg-gradient-to-r text-white rounded-xl from-rose-700 to-pink-600' type="button" onClick={() => removeQuestion(index)}>
                                                                <Trash className="w-5 h-5 mr-2"/>
                                                                Remove Question
                                                            </Button>
                                                           </div>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                                </StyledDraggable>
                                            )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        </div>
                                    )}
                                    </Droppable>
                                </DragDropContext>

                                {/* Add and remove question buttons */}
                                <div className="flex justify-between items-center pt-2">
                                    <Button className='p-5 shadow-md shadow-black border-none bg-gradient-to-tl from-violet-500 to-violet-300 text-white rounded-xl' type="button" onClick={addQuestion}>
                                        <PlusCircle className="w-5 h-5 mr-2" />
                                        Add Question
                                    </Button>
                                </div>
                            </FormItem>
                            )} />
                        </div>
                        <DialogFooter className='w-full gap-1 sm:gap-0 pt-2'>
                            {toEdit && (
                                <LoadingButton
                                    className={cn('p-5 shadow-md shadow-black border-none bg-gradient-to-br from-rose-700 to-pink-600 text-white rounded-xl')}
                                    loading={deleteInProgress}
                                    disabled={form.formState.isSubmitting}
                                    onClick={deleteEvent}
                                    type="button"
                                >
                                    Delete Event
                                </LoadingButton>
                            )}
                            <Button className={cn('p-5 shadow-md shadow-black border-none bg-gradient-to-br from-violet-500 to-orange-300 text-white rounded-xl', {hidden: formStep == 0})} type='submit'>
                                {form.formState.isSubmitting && <Loader2 className='w-4 h-4 animate-spin mr-2'/>}
                                Submit
                            </Button>
                            <Button type='button' onClick={()=>{
                                form.trigger(['name'])                              
                                const name = form.getFieldState('name')
                                
                                if(!toEdit && (!name.isDirty || name.invalid)) return;

                                setFormStep(1)
                                }} className={cn('p-5 shadow-md shadow-black border-none bg-gradient-to-tl from-violet-500 to-violet-300 text-white rounded-xl', {hidden: formStep == 1})}>
                                Questions
                                <ArrowRight className='w-5 h-5 ml-1'/>
                            </Button>
                            <Button type='button' onClick={()=>{
                                form.trigger(['name'])
                                
                                const name = form.getFieldState('name')
                                
                                if(!toEdit && (!name.isDirty || name.invalid)) return;

                                setFormStep(0)
                                }} className={cn('p-5 shadow-md shadow-black border-none bg-gradient-to-tl from-violet-500 to-violet-300 text-white rounded-xl ', {hidden: formStep == 0})}>
                                <ArrowLeft className='w-5 h-5 mr-1'/>
                                Profile Info.
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default NewAssessment