"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Themetoggle } from "./ui/Themetoggle";
import Logo from "./Logo";
import { UserButton, auth } from "@clerk/nextjs";
import { MonitorCheck, Pencil, Search } from "lucide-react";
import Link from "next/link";

type Props = {
  userId: string | null;
};

const NavHeader = ({ userId }: Props) => {
  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-sm mx-auto">
        <nav className="flex max-w-6xl gap-2 flex-col sm:flex-row items-center p-5 pl-2 bg-none mx-auto">
          <Logo />
          <div className="flex-1 flex items-center justify-end space-x-4">
            <div className="flex gap-0 bg-secondary p-4 mr-0 rounded-lg">
              {userId && (
                <div className="flex mr-4 flex-row gap-4 items-center justify-center">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: { width: "2.5rem", height: "2.5rem" },
                      },
                    }}
                  />
                  <Button className="p-3 border-none bg-gradient-to-br from-violet-500 to-violet-300 text-white rounded-md shadow-sm shadow-black">
                    <Link href={`/search`}>
                      <Search className="w-5 h-5" />
                    </Link>
                  </Button>

                  <Button className="p-3 border-none bg-gradient-to-br from-violet-500 to-violet-300 text-white rounded-md shadow-sm shadow-black">
                    <Link href={`/dashboard`}>
                      <MonitorCheck className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button className="p-3 border-none bg-gradient-to-br from-violet-500 to-violet-300 text-white rounded-md shadow-sm shadow-black">
                    <Link href={`/joinYourInterview`}>
                      <Pencil className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              )}
              <Themetoggle />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default NavHeader;
