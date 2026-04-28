<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $transaction = Transaction::create([
                'reference_no' => 'TRX-' . strtoupper(uniqid()),
                'user_id' => $request->user_id ?? 1,
                'total_amount' => $request->total_amount,
                'cash_received' => $request->cash_received,
                'change_amount' => $request->cash_received - $request->total_amount,
            ]);

            foreach ($request->items as $item) {
                $transaction->items()->create([
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['quantity'] * $item['price'],
                ]);

                $product = Product::find($item['id']);
                if ($product) { $product->decrement('stock', $item['quantity']); }
            }

            return response()->json(['status' => 'success', 'data' => $transaction], 201);
        });
    }

    public function index()
    {
        return Transaction::with('items.product')->latest()->get();
    }
}