// src/api/products.ts
import api from "./client";
import { Product } from "../mock/inventory";

type ProductRow = {
  id: number;
  name: string;
  category: string;
  buying_price: number;
  selling_price: number;
  stock: number;
};

export async function fetchProductsFromBackend(): Promise<Product[]> {
  const response = await api.get<ProductRow[]>("/api/products");
  const rows = response.data;

  // Map DB rows -> frontend Product type (camelCase)
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    buyingPrice: Number(row.buying_price),
    sellingPrice: Number(row.selling_price),
    stock: row.stock,
  }));
}
