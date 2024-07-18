"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { z } from "zod";

interface Product {
  title: string;
  description: String;
  price: number;
}

export type ProductSchema = Partial<Product>;

const fetchProducts =async () = >{

}

const page = () => {
  return <div>page</div>;
};

export default page;
