"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImSpinner9 } from "react-icons/im";

import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreatePost } from "./action";

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
});

type postSchemaType = z.infer<typeof postSchema>;

const page = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const form = useForm<postSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const formSubmitted = async (data: postSchemaType) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const results = await CreatePost(undefined, formData);
      if (results.errors) {
        Object.entries(results.errors).forEach(([key, value]) => {
          form.setError(key as keyof postSchemaType, {
            type: "manual",
            message: value?.[0],
          });
        });
      } else {
        form.reset();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px] mt-20 ml-20 p-4 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmitted)} className="space-y-4">
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>title</FormLabel>
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
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
          <Button type="submit">
            {isLoading ? (
              <p className="flex flex-row space-x-4 ">
                <ImSpinner9 className="animate-spin" /> submitting
              </p>
            ) : (
              <p>submit</p>
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default page;
