"use client";
import { api } from "@/convex/_generated/api";
import { useQuery, usePaginatedQuery } from "convex/react";
import React, { useEffect, useRef } from "react";
import AssessmentDisplay from "./AssessmentDisplay";
import { Button } from "./ui/button";

type Props = {};
let count = 0;

const EveryAssessmentCard = (props: Props) => {
  const pageEndRef = useRef(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.assess.get,
    {},
    { initialNumItems: 3 }
  );

  // const handlePageEnd = () => {
  //   loadMore(5);
  // };

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         handlePageEnd(); // Call your function when the page end is reached
  //       }
  //     });
  //   });

  //   if (pageEndRef.current) {
  //     observer.observe(pageEndRef.current);
  //   }

  //   // Clean up the observer
  //   return () => {
  //     if (pageEndRef.current) {
  //       observer.unobserve(pageEndRef.current);
  //     }
  //   };
  // }, [status]);

  return (
    <>
      {results?.map((assessment) => (
        <AssessmentDisplay assessment={assessment} key={assessment._id} />
      ))}

      <div className=" flex justify-center self-center snap-center">
        <Button
          className="p-3 m-6 shadow-md disabled:cursor-not-allowed self-center  shadow-black border-none bg-gradient-to-tl from-violet-500 to-violet-300 text-white rounded-xl"
          onClick={() => loadMore(5)}
          disabled={status !== "CanLoadMore"}
        >
          Load More
        </Button>
      </div>
    </>
  );
};

export default EveryAssessmentCard;
