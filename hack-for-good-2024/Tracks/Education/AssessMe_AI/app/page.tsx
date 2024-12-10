import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowUpRight, BarChart, BarChart2, BarChartBig, BookText, Bot, BotIcon, GitGraph, Github, Key, Linkedin, Lock, Mail, Map, Medal, Monitor, ScrollText, Text } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs';


export default async function Home() {
  const get_user = await currentUser();
  console.log(get_user);
  return (
    <div className='flex relative overflow-hidden antialiased flex-col items-center justify-between pt-0'>
        <div className='flex flex-col gap-8 max-w-6xl sm:flex-row min-h-screen pt-10 sm:pt-28 px-4'>
          <div className='text-left font-semibold text-white flex flex-col gap-8'>
            <h1 className='text-2xl md:text-5xl'>Precise & Transparent in Evaluation<span className='text-violet-700'>.</span> <br/> <span className='text-violet-700'>Pioneers of AI-Driven <span className='text-white'>Automated</span> Assessment</span>.</h1>
            <h3 className='text-md'>AssessMe.AI revolutionizes hiring by eliminating biases, ensuring fair assessments, and delivering transparent feedback for both companies and candidates, forging a future of equitable and positive recruitment experiences.</h3>
            <div>
              <Button className='p-6 shadow-md shadow-black border-none bg-gradient-to-br from-violet-500 to-violet-300 text-white rounded-xl' size={'lg'} asChild>
                <Link href={'/dashboard'}>Let's Assess <ArrowRight className='ml-1 w-5 h-5'/></Link>
              </Button>
            </div>
          </div>
          <div className='text-center gap-8 flex flex-col'>
            <Button className='p-6 shadow-md gap-2 shadow-black border-none bg-gradient-to-r from-purple-500 to-violet-300 text-white rounded-xl'>
              <Link href={'/dashboard'} className='flex flex-row gap-2 items-center'>
                <Bot/>
                Ai Interview
              </Link>
            </Button>
            <Button className='p-6 gap-2 shadow-md shadow-black border-none bg-gradient-to-r from-purple-500 to-violet-300 text-white rounded-xl'>
              <Link className='flex flex-row gap-2 items-center' href={'/dashboard'}>
                <BarChartBig/>
                Feedback & Analytics
              </Link>        
            </Button>
            <Button className='p-6 gap-2 shadow-md shadow-black border-none bg-gradient-to-r from-purple-500 to-violet-300 text-white rounded-xl'>
              <Link className='flex flex-row gap-2 items-center' href={'/dashboard'}>
                <Medal/>
                Ranking 
              </Link>
            </Button>
          </div>
        </div>
        <div className='flex px-4 pt-1 bg-white/20 text-white justify-between gap-4 flex-row items-center text-primary h-14 absolute bottom-0 w-full'>
        <h2 className='text-white'>© 2023 AssessMe.AI</h2>
        <div className='flex flex-row gap-4 justify-center items-center'>
          <Link href={'https://github.com/sumionochi'}>
            <Github/>
          </Link>
          <Link href={'https://www.linkedin.com/in/aaditya-srivastava-b4564821b/'}>
            <Linkedin/>
          </Link>
          <Link href={'mailto:aaditya.srivastava.connect@gmail.com'}>
            <Mail/>
          </Link>
          <Link href={'https://sumionochi.github.io/Portfolio-landing-page/'}>
            <ArrowUpRight/>
          </Link>
        </div>
        </div>
    </div>
  )
}
