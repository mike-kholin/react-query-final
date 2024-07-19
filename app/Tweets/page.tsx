"use client";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { Tweet } from "@prisma/client";
import FormPage from "./_components/Form";

const page = () => {
  const getTweets = async (): Promise<Tweet[]> => {
    const response = await axios.get<Tweet[]>("/api/Tweets");
    return response.data;
  };

  const useTweets = () => {
    return useQuery<Tweet[], Error, Tweet[], [string]>({
      queryKey: ["tweet"],
      queryFn: getTweets,
    });
  };

  const { data: results } = useTweets();

  return (
    <>
      <div>
        <ul>
          {results?.map((item) => (
            <li>{item.message}</li>
          ))}
        </ul>
      </div>
      <Card className="w-[400px] p-2 mt-40 ml-40">
        <FormPage />
        <Toaster />
      </Card>
    </>
  );
};

export default page;
