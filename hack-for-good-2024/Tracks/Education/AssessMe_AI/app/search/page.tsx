"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,  
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AssessmentDisplay, { NoteProps } from "@/components/AssessmentDisplay";
export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("requirements");
  const [returnedArray, setReturnedArray] =useState<any>([]);

  const performSearch = useAction(api.assess.similarRequirements);
  const data = useQuery(api.assess.questionSearch, {
    bodyQuery: searchTerm,
  });

  async function handleSearch() {
    if (searchType === "requirements") {
      const searchResults = await performSearch({
        descriptionQuery: searchTerm,
      });
      console.log(searchResults);
      setReturnedArray(searchResults)
    }
    else{
      console.log(data)
      setReturnedArray(data)
    }

  }

  const handleValueChange = (value: string) => {
    setSearchType(value);
  };

  function resetFields() {
    setSearchTerm("");
  }

  return (
    <main className="  flex flex-col justify-center gap-12 mt-4">
      <div className="flex w-full justify-center">
        <Select
          value={searchType}
          onValueChange={(event) => {
            handleValueChange(event);
            resetFields();
          }}
          
        >
          <SelectTrigger className="w-[150px] rounded-r-none focus:outline-none focus:ring-0   bg-gray-950 ring-0 outline-none  border-none">
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-2 ring-0 outline-none border-none">
            <SelectItem value="requirements">Requirements</SelectItem>
            <SelectItem value="jobtype">Job Type</SelectItem>
          </SelectContent>
        </Select>
        <input
          className="text-white w-96  bg-gray-800 pl-2"
          onChange={(event) => setSearchTerm(event.target.value)}
          value={searchTerm}
        />
        <button
          className="bg-purple-500 p-2 rounded-r-md"
          onClick={handleSearch}
        >
          search
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-32 gap-y-4 justify-center items-center p-12 " >
      {returnedArray?.map((assessment:any) => (
        <AssessmentDisplay assessment={assessment} key={assessment._id} />
      ))}
      </div>
    </main>
  );
}
