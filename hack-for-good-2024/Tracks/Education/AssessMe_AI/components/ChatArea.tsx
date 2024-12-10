"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { SiChatbot, } from "react-icons/si";
import { MessageSquareIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function ChatArea() {
  const { isSignedIn, user, isLoaded } = useUser();
  const NAME = user?.firstName;
  const messagesEndRef = useRef(null);
  const messages = useQuery(api.messages.list);
  const likeMessage = useMutation(api.messages.like);
  const sendMessage = useMutation(api.messages.send);
  const [newMessageText, setNewMessageText] = useState("");
  const scrollToBottom = () => {
    //@ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    console.log(messages);
  }, [messages]);

  const Submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendTheMessage();
    }
  };

  const sendTheMessage = async () => {
    await sendMessage({ body: newMessageText, author: user?.firstName! });
    setNewMessageText("");
  };
  return (
    <div className="fixed bottom-0 right-12   mb-16 ">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="p-4">
            <MessageSquareIcon className=" text-2xl text-[#ffffff]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[23rem] overflow-x-hidden mr-12 px-0 py-0 rounded-2xl bg-[#221041] border-0">
          <div className="flex overflow-x-hidden h-[31rem] w-[23rem] flex-col items-center  bg-[#221041] rounded-xl">
            <div className=" h-full flex overflow-x-hidden flex-col gap-2 overflow-y-auto py-6 px-3 w-full">
              {messages?.map((message: any) => {
                return (
                  <div
                    key={message._id}
                    className={`w-max relative flex justify-start mb-2   max-w-[18rem] border-red-500 rounded-md px-4 py-3 h-min ${
                      message.author !== NAME
                        ? "self-start  bg-gray-300 text-gray-800"
                        : "self-end  bg-[#8357d0]  text-gray-50 "
                    } `}
                  >
                    {message.author === NAME && (
                      <div
                        className={`w-0 h-min relative top-4 -left-12 `}
                      >
                        <button
                          onClick={async () => {
                            await likeMessage({
                              liker: NAME!,
                              messageId: message._id,
                            });
                          }}
                        >
                          <div className="flex">
                          {message.likes ? <span className="text-white h-0">{message.likes}</span> : null} 
                          <span>👍</span>
                          </div>

                        </button>
                      </div>
                    )}

                    <div className="">
                      <div className="text-sm font-bold mb-1 text-left">
                        {message.author}
                      </div>
                      {message.body}
                    </div>
                    {message.author !== NAME && (
                      <div
                        className={` h-min relative top-4 left-5 w-0`}
                      >
                        <button
                          onClick={async () => {
                            await likeMessage({
                              liker: NAME!,
                              messageId: message._id,
                            });
                          }}
                        >
                          {" "}
                          <div className="flex">
                          <span>👍</span>
                          {message.likes ? <span className="text-white h-0">{message.likes}</span> : null} 
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef}></div>
            </div>
            <div className="relative  w-[80%] bottom-4 flex justify-center">
              <textarea
                value={newMessageText}
                onChange={(event) => setNewMessageText(event.target.value)}
                className="w-[85%] h-10 px-3 rounded-l-md py-2 resize-none overflow-y-auto text-black bg-gray-400 rouded"
                onKeyDown={Submit}
              />
              <button
                onClick={sendTheMessage}
                className=" bg-[#7a43da] rounded-r-md  text-white px-4 py-2  "
              >
                send
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
