"use client";
import { useState, useEffect, FC } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type jobType = {
  id: string;
  title: string;
  description: string;
  company: string;
  technologies: string[];
  main_technology: string;
  job_type: string;
  max_payment_usd: number;
  location_iso: string;
  applications: number;
  views: number;
  apply_url: string;
  logo_url: string;
};

const JobPortal: FC = () => {
  const [data, setData] = useState<jobType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const getJobListing = useAction(api.getJobListing.get);

  useEffect(() => {
    fetch("http://localhost:3000/api/getJobListing")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="grid gap-4 place-content-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {data && data.map((job: jobType) => (
          <Card key={job.id} className="cursor-pointer shadow-md shadow-black bg-secondary transition-shadow hover:shadow-lg">
          <CardHeader onClick={() => setShowEditDialog(true)}>
            <div className="flex items-center">
              {job.logo_url ? <img
                src={job.logo_url}
                alt={`${job.company} Logo`}
                className="w-12 h-12 rounded-full mr-4"
              /> : <></>}
              <div>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription onClick={() => setShowEditDialog(true)}>
                  
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent onClick={() => setShowEditDialog(true)} className="mb-0 pb-0">
            <div className="mb-4">
            { job.company ? <p className="font-bold text-gray-600 dark:text-gray-400">
                Company :{' '}
                <span className="text-primary font-normal">{job.company}</span>
              </p> : <></>}
              <p className="font-bold text-gray-600 dark:text-gray-400">
                Technologies :{' '}
                <span className="text-primary font-normal">
                  {job.technologies.join(', ')}
                </span>
              </p>
              <p className="font-bold text-gray-600 dark:text-gray-400">
                Main Technology :{' '}
                <span className="text-primary font-normal">{job.main_technology}</span>
              </p>
              <p className="font-bold text-gray-600 dark:text-gray-400">
                Job Type :{' '}
                <span className="text-primary font-normal">{job.job_type}</span>
              </p>
              {job.max_payment_usd ? <p className="font-bold text-gray-600 dark:text-gray-400">
                Max Payment (USD) :{' '}
                <span className="text-primary font-normal">
                  {job.max_payment_usd.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </p> : <></>}
              <p className="font-bold text-gray-600 dark:text-gray-400">
                Location :{' '}
                <span className="text-primary font-normal">
                  {job.location_iso || 'Remote'}
                </span>
              </p>
              <p className="font-bold text-gray-600 dark:text-gray-400">
                Applications :{' '}
                <span className="text-primary font-normal">{job.applications}</span>
              </p>
              <p className="font-bold text-gray-600 dark:text-gray-400">
                Views :{' '}
                <span className="text-primary font-normal">{job.views}</span>
              </p>
              <p className="font-bold text-gray-600 dark:text-gray-400">
                Applications :{' '}
                <span className="text-primary font-normal">{job.applications}</span>
              </p>
              <Link
                href={job.apply_url}
                className="text-blue-500 hover:underline"
                target="_blank"
              >
                Apply Here
              </Link>
            </div>
          </CardContent>
          <div className="w-full flex justify-end">
            <Button
              className="p-3 m-6 shadow-md shadow-black border-none bg-gradient-to-tl from-violet-500 to-violet-300 text-white rounded-xl"
              onClick={() => setShowEditDialog(false)}
            >
              <Link
                className="flex flex-row"
                href={{
                  pathname: '/dashboard',
                  query: {id: job.id, jobProfile: job.title, jobType: job.job_type, companyName: job.company, jobRequirements: job.description},
                }}
              >
                <Bot className="w-5 h-5 mr-2" /> Let's Interview
              </Link>
            </Button>
          </div>
        </Card>
        ))}
      </div>
    </>
    
  );
};
export default JobPortal;
