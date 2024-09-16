"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { type Patient } from "@prisma/client";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";
import { headers } from "next/headers";
import toast, { Toaster } from "react-hot-toast";

type final = z.infer<typeof patient2>;
const patient2 = z.object({
  name: z.string(),
  disease: z.string(),
});

interface mutationContext {
  prevTodo: final | undefined;
}

const getPatients = async (): Promise<Patient[]> => {
  const results = (await axios.get<Patient[]>("/api/patients")).data;
  return results;
};

export function usePatients(): UseQueryResult<Patient[], Error> {
  return useQuery<Patient[], Error, Patient[], string[]>({
    queryKey: ["patient"],
    queryFn: getPatients,
  });
}

const page = () => {
  const queryClient = useQueryClient();
  const form = useForm<final>({
    resolver: zodResolver(patient2),
    defaultValues: {
      name: "",
      disease: "",
    },
  });

  const mutes = useMutation<final, Error, final, mutationContext>({
    mutationFn: async (data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await axios.post("/api/patients", formData, {
        headers: {
          "Content-Type": "multipart/formdata",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      toast.success("hurray from mutation function");
      form.reset();
    },
    onMutate: async (data): Promise<mutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["patient"] });
      const prevTodo = queryClient.getQueryData<final>(["patient"]);
      queryClient.setQueryData<final[]>(["patient"], (old = []) => [
        ...old,
        { ...data },
      ]);
      toast.success("hurray from cancelling outgoing query");
      return { prevTodo };
    },

    onError: (error, data, context) => {
      queryClient.setQueryData(["patient"], context?.prevTodo);
      toast.error("oops from on Error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      toast.success("hurray from onsettled");
    },
  });

  const { data: results, isLoading } = usePatients();

  const patientSubmit = async (data: final) => {
    mutes.mutate(data);
  };

  return (
    <div className="flex flex-col justify-center  items-center h-screen p-20">
      <div className="grid grid-cols-2 gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(patientSubmit)}
            className="space-y-2"
          >
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="disease"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
            <Button
              variant="outline"
              className="w-full space-x-2"
              type="submit"
            >
              <span>submit</span>
              <span /> <span>&rarr;</span>
            </Button>
          </form>
        </Form>
        <div className="flex flex-col justify-center items-center h-fit p-2 mb-2">
          {isLoading ? (
            <ImSpinner2
              className="animate-spin mt-1/2 ml-1/2"
              size={24}
              color="blue"
            />
          ) : (
            <Card className="p-4">
              {results?.map((item) => (
                <div className="flex flex-row  space-x-2  ml-2 mt-2 ">
                  <p className="text-sm tracking-tight bg-rose-400 p-1 rounded-sm">
                    {item.name}
                  </p>
                  <p className="text-sm tracking-tight bg-emerald-400  p-1 rounded-sm">
                    {" "}
                    {item.disease}
                  </p>
                </div>
              ))}
            </Card>
          )}
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default page;
