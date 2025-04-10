
import { z } from "zod";

// Dimensions schema
const DimensionsSchema = z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number(),
})


// Review schema
const ReviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string(),
    date: z.string().datetime(),
    reviewerName: z.string(),
    reviewerEmail: z.string().email(),
})

// Meta schema
const MetaSchema = z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    barcode: z.string(),
    qrCode: z.string().url(),
})



const ProductSchema = z.object({
    id: z.number().int().positive(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    price: z.number().positive(),
    discountPercentage: z.number().positive(),
    rating: z.number().min(0).max(5),
    stock: z.number().int().nonnegative(),
    tags: z.array(z.string()),
    sku: z.string(),
    weight: z.number().positive(),
    dimensions: DimensionsSchema,
    warrantyInformation: z.string(),
    shippingInformation: z.string(),
    availabilityStatus: z.string(),
    reviews: z.array(ReviewSchema),
    returnPolicy: z.string(),
    minimumOrderQuantity: z.number().int().positive(),
    meta: MetaSchema,
    images: z.array(z.string().url()),
    thumbnail: z.string().url(),
})

// Products response schema
const ProductsResponseSchema = z.object({
    products: z.array(ProductSchema),
    total: z.number().int().nonnegative(),
    skip: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
})

ProductSchema.parse({
    id: 1,
    title: "Product 1",
    description: "This is a product",
})

// Types
type Product = z.infer<typeof ProductSchema>
type ProductsResponse = z.infer<typeof ProductsResponseSchema>


export { ProductsResponse, ProductSchema, DimensionsSchema, ReviewSchema, MetaSchema, Product }


