"use client"
import React, { useRef, useState } from 'react'
import { Input } from './ui/input'
import { Image, ImagePlus, Loader2 } from 'lucide-react'
import convertor from '@/lib/convertor'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import TextCards from './TextCards'

type Props = {}

const InputImg = (props: Props) => {
  const imgInputRef: any = useRef(null);  
  const [processing, setProcessing] = useState<boolean>(false);
  const [texts, setTexts] = useState<Array<string>>([]);
  const openBrowse = () => {
    imgInputRef.current?.click();
  }

  const convert =async (url:string)=>{
    if(url) {
      setProcessing(true);
      await convertor(url).then((text)=>{
        if(text){
          const copyOfText = texts;
          copyOfText.push(text);
          console.log(text);
        }
      });
      setProcessing(false);
    }
  }

  return (
    <>
        <input 
        type="file" 
        ref={imgInputRef}
        hidden 
        required 
        onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
            if(e.target.files){
                const url: string = URL.createObjectURL(e.target?.files[0]!);
                console.log(url);
                convert(url);
            }    
        }}/>
        <div  className="bg-secondary p-6 rounded-lg shadow-md shadow-black flex flex-col gap-4">
            <h1 className="font-semibold">Image to Text Extraction</h1>
            <p>Extract test/assessment questions from your image to curate a personalized mock test using ai.</p>
            <div onClick={openBrowse} onDrop={(e:any)=>{
              e.preventDefault();
              const url: string = URL.createObjectURL(e.dataTransfer.files?.[0]!)
              console.log(url);
              convert(url);
            }} onDragOver={(e:any)=>{
              e.preventDefault();
            }} className="flex dark:bg-slate-500 flex-col bg-slate-300 rounded-lg justify-center items-center text-center cursor-pointer border p-4 gap-2">
            {processing ? 
              <div className='flex flex-col justify-center items-center gap-2'>
                <p>Processing</p>
                <Loader2 className="animate-spin w-6 h-6" />
              </div> : 
              <div className='flex flex-col justify-center items-center gap-2'>
                <p>Browse Or Drop Your Image Here</p>
                <ImagePlus className='w-6 h-6'/>
              </div>}
            </div>
            {texts?.map((txt,index)=>{
              return <TextCards key={index} index={index} txt={txt}/>
            })}
        </div>
    </>
  )
}

export default InputImg