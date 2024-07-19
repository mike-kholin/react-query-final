"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tweet } from "./action";
import toast, { Toaster } from "react-hot-toast";

const tweetSchema = z.object({
  name: z.string().min(1, { message: "Field is required" }),
  handle: z.string().min(1, { message: "Field is required" }),
  message: z.string().optional(),
});

type tweetSchemaType = z.infer<typeof tweetSchema>;

const page = () => {
  const form = useForm<tweetSchemaType>({
    resolver: zodResolver(tweetSchema),
    defaultValues: {
      name: "",
      handle: "",
      message: "",
    },
  });

  const tweetSubmit = async (data: tweetSchemaType) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      toast.success("tweet sent");
      const results = await Tweet(undefined, formData);
      if (results.errors) {
        Object.entries(results.errors).forEach(([key, value]) => {
          form.setError(key as keyof tweetSchemaType, {
            type: "manual",
            message: value?.[0],
          });
          toast.error("tweet not sent");
        });
      } else {
        form.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="w-[400px] p-2 mt-40 ml-40">
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
                  <FormMessage>
                    {form.formState.errors.name?.message}
                  </FormMessage>
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
      <Toaster />
    </Card>
  );
};

export default page;
