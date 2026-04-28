<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // GET /api/products
    public function index()
    {
        return response()->json(Product::all());
    }

    // POST /api/products
    public function store(Request $request)
    {
        $product = Product::create($request->all());

        return response()->json($product, 201);
    }

    // GET /api/products/{id}
    public function show($id)
    {
        return response()->json(Product::findOrFail($id));
    }

    // PUT /api/products/{id}
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());

        return response()->json($product);
    }

    // DELETE /api/products/{id}
    public function destroy($id)
    {
        Product::destroy($id);

        return response()->json(['message' => 'Product deleted']);
    }
}