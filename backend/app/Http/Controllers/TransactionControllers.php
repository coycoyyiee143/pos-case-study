<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product; // Siguraduhin na may Product model na ang teammate mo
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller {
    public function store(Request $request) {
        return DB::transaction(function () use ($request) {
            // 1. Gawa ng main Transaction
            $transaction = Transaction::create([
                'reference_no' => 'REC-' . strtoupper(uniqid()),
                'user_id' => auth()->id() ?? 1, // Gamit ang naka-login o fallback sa user ID 1
                'total_amount' => $request->total_amount,
                'cash_received' => $request->cash_received,
                'change_amount' => $request->cash_received - $request->total_amount,
            ]);

            // 2. Loop sa bawat item na binili
            foreach ($request->items as $item) {
                $transaction->items()->create([
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['quantity'] * $item['price'],
                ]);

                // 3. Update ng Stock (Auto-decrement)
                $product = Product::find($item['id']);
                if ($product) {
                    $product->decrement('stock', $item['quantity']);
                }
            }

            return response()->json([
                'message' => 'Sale successful!',
                'transaction' => $transaction->load('items')
            ], 201);
        });
    }

    public function index() {
        return Transaction::with('items.product')->latest()->get();
    }
}