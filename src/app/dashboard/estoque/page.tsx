"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { stockMovementLabels } from "@/lib/utils";
import { Plus, ArrowDownUp } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  price: string;
  active: boolean;
  movements: {
    id: string;
    type: string;
    quantity: number;
    reason: string | null;
    createdAt: string;
    user: { name: string };
  }[];
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [movingProduct, setMovingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        sku: form.get("sku"),
        description: form.get("description") || undefined,
        quantity: Number(form.get("quantity")),
        minQuantity: Number(form.get("minQuantity")),
        unit: form.get("unit") || "un",
        price: Number(form.get("price")),
      }),
    });

    setLoading(false);
    setShowForm(false);
    fetchProducts();
  }

  async function handleMovement(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!movingProduct) return;
    setLoading(true);

    const form = new FormData(e.currentTarget);
    await fetch(`/api/products/${movingProduct.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.get("type"),
        quantity: Number(form.get("quantity")),
        reason: form.get("reason") || undefined,
      }),
    });

    setLoading(false);
    setMovingProduct(null);
    fetchProducts();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-600">Controle de produtos e movimentações</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader title="Novo produto" />
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <Input id="name" name="name" label="Nome" required />
            <Input id="sku" name="sku" label="SKU" required />
            <Input id="quantity" name="quantity" type="number" label="Quantidade inicial" min={0} defaultValue={0} />
            <Input id="minQuantity" name="minQuantity" type="number" label="Estoque mínimo" min={0} defaultValue={5} />
            <Input id="unit" name="unit" label="Unidade" defaultValue="un" />
            <Input id="price" name="price" type="number" label="Preço (R$)" min={0} step={0.01} defaultValue={0} />
            <Input id="description" name="description" label="Descrição" className="sm:col-span-2" />
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={loading}>Salvar</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      {movingProduct && (
        <Card>
          <CardHeader title={`Movimentação — ${movingProduct.name}`} />
          <form onSubmit={handleMovement} className="grid gap-4 sm:grid-cols-3">
            <Select
              id="type"
              name="type"
              label="Tipo"
              options={[
                { value: "IN", label: "Entrada" },
                { value: "OUT", label: "Saída" },
                { value: "ADJUSTMENT", label: "Ajuste" },
              ]}
            />
            <Input id="quantity" name="quantity" type="number" label="Quantidade" required min={1} />
            <Input id="reason" name="reason" label="Motivo" />
            <div className="flex gap-2 sm:col-span-3">
              <Button type="submit" disabled={loading}>Registrar</Button>
              <Button type="button" variant="secondary" onClick={() => setMovingProduct(null)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <span className="text-xs text-gray-400">SKU: {product.sku}</span>
                  {product.quantity <= product.minQuantity && (
                    <Badge variant="PENDING">Estoque baixo</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {product.quantity} {product.unit} • Mín: {product.minQuantity}
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setMovingProduct(product)}>
                <ArrowDownUp className="h-4 w-4" />
                Movimentar
              </Button>
            </div>
            {product.movements.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="mb-2 text-xs font-medium text-gray-500">Últimas movimentações</p>
                {product.movements.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 text-xs text-gray-500">
                    <Badge variant={m.type}>{stockMovementLabels[m.type]}</Badge>
                    <span>{m.quantity} {product.unit}</span>
                    {m.reason && <span>— {m.reason}</span>}
                    <span>por {m.user.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
