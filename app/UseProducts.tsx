import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductsResponse } from "./ProductsSchema";
import { useEffect } from "react";

export async function fetchProducts({ skip, limit }: { skip: number; limit: number }) {
    console.log("fetching products", skip, limit)
    const response = await fetch("https://dummyjson.com/products"
        + `?skip=${encodeURIComponent(skip)}&limit=${encodeURIComponent(limit)}`, {
        })
    if (!response.ok) {
        throw new Error("Network response was not ok " + response.status + response.statusText);
    }
    return await response.json() as ProductsResponse
}

export function useProducts({ skip, limit }: { skip: number; limit: number }) {
    return useQuery<ProductsResponse>({
        queryKey: ["products", skip, limit],
        queryFn: async () => fetchProducts({ skip, limit }),
        staleTime: 1000 * 60 * 60, // 1 hour
        placeholderData: d => d
    })
}

export async function prefetchWorker(queryClient: QueryClient) {
    for (let i = 0; i < 5; i++) {
        const skip = i * 20
        const limit = 20
        queryClient.prefetchQuery({
            queryKey: ["products", skip, limit],
            queryFn: () => fetchProducts({ skip, limit })
        })
        await delay(400)
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function usePrefetchProducts() {
    const queryClient = useQueryClient()
    useEffect(() => {
        prefetchWorker(queryClient)
    }, [queryClient])
}