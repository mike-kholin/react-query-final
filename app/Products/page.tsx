"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface Product {
  title: string;
  description: String;
  price: number;
}

type ProductSchema = Partial<Product>;

const fetchProducts = async (): Promise<ProductSchema[]> => {
  const response = await axios.get<ProductSchema[]>("/api/products");
  return response.data;
};

export function useProducts(): UseQueryResult<ProductSchema[], Error> {
  return useQuery<ProductSchema[], Error, ProductSchema[], [string]>({
    queryKey: ["product"],
    queryFn: fetchProducts,
  });
}

const page = () => {
  const { data, error, isLoading } = useProducts();
  return (
    <div>
      <div className="text-black">{isLoading && <p>loading</p>}</div>
      <ul>
        {data?.map((item, index) => (
          <>
            <li key={index} className="text-black">
              {item.title}
            </li>
            <li key={index} className="text-black">
              {item.description}
            </li>
            <li key={index} className="text-black">
              {item.price}
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default page;
