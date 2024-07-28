"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  InfiniteQueryObserver,
  InfiniteQueryObserverResult,
  MutationObserverResult,
  QueryObserverResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { response } from "express";
import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { string, z } from "zod";

interface pageProps {
  page: MealSchemaUNZod[];
  nextPage: number | null;
}

const MealSchema = z.object({
  name: z.string(),
  description: z.string(),
});

interface MealSchemaUNZod {
  name: String;
  description: string;
}

type mutationContext = {
  previousMeal: MealSchemaUNZod | undefined;
};

type MealTypeSchema = z.infer<typeof MealSchema>;
type infiniteDataResult = InfiniteData<pageProps>;

const page = () => {
  const form = useForm<MealTypeSchema>({ resolver: zodResolver(MealSchema) });

  // ---->

  const queryClient = useQueryClient();

  const makeTodo = async (data: MealSchemaUNZod): Promise<MealSchemaUNZod> => {
    const response = await axios.post<MealSchemaUNZod>("/api/Meals", data, {
      params: {
        "content-type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const mutation = useMutation<
    MealSchemaUNZod,
    Error,
    MealSchemaUNZod,
    mutationContext
  >({
    mutationFn: makeTodo,
    onMutate: async (data: MealSchemaUNZod): Promise<mutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["meals"] });
      const previousMeal = queryClient.getQueryData<MealSchemaUNZod>(["meals"]);
      queryClient.setQueryData<MealSchemaUNZod[]>(["meals"], (old = []) => [
        ...old,
        { ...data },
      ]);
      toast.success("i am mutated");

      return { previousMeal };
    },

    onError(error, variables, context) {
      toast.error("i am errored");
      return queryClient.setQueryData(["meals"], context?.previousMeal);
    },
    onSettled(data, error, variables, context) {
      toast.success("i am settled");
      return queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });

  const saveMeal = (data: MealSchemaUNZod) => {
    mutation.mutate(data);
  };

  //---->

  function useMyQuery(): QueryObserverResult<MealSchemaUNZod[], Error> {
    return useQuery({
      queryKey: ["meals"],
      queryFn: async () => {
        const results = await axios.get("/api/Meals");
        return results.data;
      },
    });
  }

  const { data: results } = useMyQuery();

  const GetInfiniteMeals = async ({ pageParam = 0 }: { pageParam: number }) => {
    const limit = 10;
    const response = await axios.get<MealSchemaUNZod[]>("/api/Meals", {
      params: {
        page: pageParam,
        limit,
      },
    });
    const hasMore = response.data.length === limit;
    return {
      page: response.data,
      nextPage: hasMore ? pageParam + 1 : null,
    };
  };

  const { data: mike } = useInfiniteQuery({
    queryKey: ["meals"],
    queryFn: GetInfiniteMeals,
    initialPageParam: 0,
    getNextPageParam: (lastpage) => lastpage.nextPage,
  });

  return (
    <Card className="w-[600px] p-10 h-screen flex flex-row">
      <div className="w-[400px]">
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(saveMeal)}>
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name: </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>description: </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
            <Button type="submit">submit</Button>
          </form>
        </Form>
      </div>
      {/* {use query} */}
      <div className="w-[200px]">
        <ul>
          {results?.map((item) => (
            <>
              <li className="text-black font-medium tracking-tight">
                {item.name}
              </li>
              <li className="text-black font-medium tracking-tight">
                {item.description}
              </li>
            </>
          ))}
        </ul>
      </div>
      {/* {use inifiniteQuery} */}
      <div>
        {mike?.pages.map((page) => (
          <ul>
            {page.page.map((item) => (
              <>
                <li>{item.name}</li>
                <li>{item.description}</li>
              </>
            ))}
          </ul>
        ))}
      </div>
      <Toaster />
    </Card>
  );
};

export default page;

// "use client";
// import {
//   InfiniteQueryObserverResult,
//   useInfiniteQuery,
// } from "@tanstack/react-query";
// import axios from "axios";
// import React from "react";

// interface MealSchema {
//   name: string;
//   description: string;
// }

// interface PageProps {
//   data: MealSchema[];
//   nextPage: number | null;
// }

// const getInfiniteUser = async ({
//   pageParam = 0,
// }: {
//   pageParam?: number;
// }): Promise<PageProps> => {
//   const limit = 10;
//   const response = await axios.get<MealSchema[]>("/api/Meals", {
//     params: {
//       limit,
//       page: pageParam,
//     },
//   });
//   const hasMore = response.data.length === limit;
//   return {
//     data: response.data,
//     nextPage: hasMore ? pageParam + 1 : null,
//   };
// };

// function useInfineQueryMeals(): InfiniteQueryObserverResult<PageProps, Error> {
//   return useInfiniteQuery({
//     queryKey: ["meals"],
//     queryFn: getInfiniteUser,
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//   });
// }

// const page = () => {
//   return <div>page</div>;
// };

// export default page;
