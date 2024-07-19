"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { FormEvent, useState } from "react";

interface TodoSchema {
  task: string;
}

const page = () => {
  const [task, setTask] = useState("");
  const queryClient = useQueryClient();

  //mutation
  const makeTodo = async (newTodo: TodoSchema): Promise<TodoSchema> => {
    const response = await axios.post<TodoSchema>("/api/Todos", newTodo, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };
  const mutation = useMutation({
    mutationFn: makeTodo,
    onMutate: async (newTodo: TodoSchema) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodo = queryClient.getQueryData<TodoSchema>(["todos"]);
      queryClient.setQueryData<TodoSchema[]>(["todos"], (old = []) => [
        ...old,
        { ...newTodo },
      ]);
      return { previousTodo };
    },
    onError: (error, newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodo);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  //-->end of mutation

  ///handle submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ task });
    setTask("");
  };
  //--->end handleSubmit

  //getDATA
  const getData = async (): Promise<TodoSchema[]> => {
    const response = await axios.get("/api/Todos");
    return response.data;
  };

  const { data: results } = useQuery<TodoSchema[], Error, TodoSchema[]>({
    queryKey: ["todos"],
    queryFn: getData,
  });
  //--->End of getting data
  return (
    <div className="w-[600px] p-10">
      <form
        className="w-[400px] p-4 space-x-4 flex flex-row"
        onSubmit={handleSubmit}
      >
        <label htmlFor="task" className="tracking-tight rexr-sm text-black">
          task
        </label>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="rounded-md border-[1px] border-slate-300 p-2"
        />
        <Button type="submit" variant={"outline"}>
          submit
        </Button>
      </form>
      <Card className="flex flex-row space-x-4 w-[400px]">
        <div>
          <ul>
            {results?.map((item, index) => (
              <li key={index}>{item.task}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default page;
