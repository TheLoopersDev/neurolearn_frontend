import { apiSlice } from "../api/apiSlice";

export interface Subcategory {
  _id: string;
  title: string;
}

export interface Category {
  _id: string;
  title: string;
  subCategories?: Subcategory[];
}

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => ({
                url: "category/all",
                method: "GET",
                credentials: "include" as const
            }),
            transformResponse: (response: { success: boolean; categories: Category[] }) => response.categories || []
        }),
    }),
});

export const { useGetCategoriesQuery } = categoryApi;
