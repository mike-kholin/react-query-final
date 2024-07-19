"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TweetAction } from "../action";
import { tweetSchema, tweetSchemaType } from "../validators/tweetSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Tweet } from "@prisma/client";

type queryModifiedTweet = Omit<tweetSchemaType, "id">;

const FormPage = () => {
  const form = useForm<tweetSchemaType>({
    resolver: zodResolver(tweetSchema),
    defaultValues: {
      name: "",
      handle: "",
      message: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation<
    tweetSchemaType,
    AxiosError,
    queryModifiedTweet,
    unknown
  >({
    mutationFn: async (data: queryModifiedTweet) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await axios.post<queryModifiedTweet>(
        "/api/Tweets",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweet"] });
      toast.success("tweet sent");
      form.reset();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const tweetSubmit = async (data: tweetSchemaType) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(tweetSubmit)}>
        <>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>handle:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.handle?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>message:</FormLabel>
                <FormControl>
                  <Input {...field} className="h-[50px] " />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.message?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </>
        <Button type="submit">tweet</Button>
      </form>
    </Form>
  );
};

export default FormPage;

// {using Form action }
// try {
//   const formData = new FormData();
//   Object.entries(data).forEach(([key, value]) => {
//     formData.append(key, value);
//   });
//   mutation.mutate(data);
//   const results = await TweetAction(undefined, formData);
//   if (results.errors) {
//     Object.entries(results.errors).forEach(([key, value]) => {
//       form.setError(key as keyof tweetSchemaType, {
//         type: "manual",
//         message: value?.[0],
//       });
//       toast.error("tweet not sent");
//     });
//   }
// } catch (error) {
//   console.log(error);
// }

// const mutation = useMutation<
//   tweetSchemaType,
//   AxiosError,
//   queryModifiedTweet,
//   unknown
// >({
//   mutationFn: (newData: tweetSchemaType) =>
//     axios
//       .post<tweetSchemaType>("/api/Tweets", newData)
//       .then((response) => response.data),
//   onSuccess: () => {
//     queryClient.invalidateQueries({ queryKey: ["tweet"] });
//     toast.success("tweet sent");
//     form.reset();
//   },
//   onError: (error) => {
//     toast.error("Failed to send tweet");
//     console.error(error);
//   },
// });
