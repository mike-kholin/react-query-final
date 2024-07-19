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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { SchemaType, StudentSchema } from "./validators/studentSchema";

type valuesType = Omit<SchemaType, "id">;

const page = () => {
  const form = useForm<SchemaType>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      name: "",
      subject: "",
    },
  });

  const queryClient = useQueryClient();

  const getStudents = async (): Promise<SchemaType[]> => {
    const getData = await axios.get<SchemaType[]>("/api/Student");
    return getData.data;
  };

  const { data: results } = useQuery<
    SchemaType[],
    Error,
    SchemaType[],
    [string]
  >({
    queryKey: ["student"],
    queryFn: getStudents,
  });

  const mutation = useMutation<SchemaType, AxiosError, SchemaType>({
    mutationFn: async (data: valuesType) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axios.post<SchemaType>("/api/Student", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
      form.reset();
      toast.success("student added");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const createStudent = (data: SchemaType) => {
    mutation.mutate(data);
  };

  return (
    <Card className="p-10 flex flex-row gap-4">
      <Form {...form}>
        <form
          className="space-y-2 p-2 w-[400px]"
          onSubmit={form.handleSubmit(createStudent)}
        >
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name: </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description: </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
          <Button type="submit" variant={"ghost"}>
            {mutation.isPending ? (
              <p>loading</p>
            ) : (
              <p>register student &rarr;</p>
            )}
          </Button>
        </form>
      </Form>
      <div>
        <ul>
          {results?.map((item, index) => (
            <div key={index} className="text-black w-full">
              <li className="text-black">{item.name}</li>
              <li className="text-black">{item.subject}</li>
            </div>
          ))}
        </ul>
      </div>
      <Toaster />
    </Card>
  );
};

export default page;
