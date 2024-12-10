import React from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

type Props = {
    index: number,
    txt: string
}

const TextCards = ({txt, index}: Props) => {
  const copyToClipBoard =  (text: string) => {
    navigator.clipboard.writeText(text);
  } 
  return (
    <div className='border p-4 bg-slate-300 dark:bg-slate-500 rounded-lg'>
        <div className='flex flex-row mb-4 justify-between items-center'>
        <div className='flex flex-row justify-center items-center'>
            <p className='bg-secondary rounded-lg p-2 px-4 mr-2'>{`${index+1}`}</p>     
            {new Date().toDateString()}
        </div>
        <Button onClick={()=>{
            copyToClipBoard(txt);
        }} className='p-4 shadow-md shadow-black border-none bg-gradient-to-br from-violet-500 to-violet-300 text-white rounded-xl'>Copy</Button>
        </div>
        <Textarea className='w-full h-30' defaultValue={txt}>
        </Textarea>
    </div>
  )
}

export default TextCards