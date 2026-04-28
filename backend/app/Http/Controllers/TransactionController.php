<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index()
    {
        return response()->json(
            Transaction::with('items.product')->latest()->paginate(20)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'total_amount'  => 'required|numeric|min:0',
            'cash_received' => 'required|numeric|min:0',
            'items'         => 'required|array|min:1',
            'items.*.id'       => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price'    => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $transaction = Transaction::create([
                'reference_no'  => 'TRX-' . strtoupper(uniqid()),
                'user_id'       => auth()->id() ?? 1,
                'total_amount'  => $validated['total_amount'],
                'cash_received' => $validated['cash_received'],
                'change_amount' => $validated['cash_received'] - $validated['total_amount'],
            ]);

            foreach ($validated['items'] as $item) {
                $transaction->items()->create([
                    'product_id' => $item['id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                    'subtotal'   => $item['quantity'] * $item['price'],
                ]);

                $product = Product::find($item['id']);
                if ($product) {
                    $product->decrement('stock', $item['quantity']);
                }
            }

            AuditLog::create([
                'user_id'     => auth()->id() ?? 1,
                'action'      => 'transaction',
                'entity_type' => 'Transaction',
                'entity_id'   => $transaction->id,
                'description' => "Transaction {$transaction->reference_no} completed — ₱{$transaction->total_amount}",
                'ip_address'  => $request->ip(),
            ]);

            return response()->json([
                'status' => 'success',
                'data'   => $transaction->load('items.product'),
            ], 201);
        });
    }

    public function show($id)
    {
        $transaction = Transaction::with('items.product')->findOrFail($id);
        return response()->json($transaction);
    }

    public function void(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        if ($transaction->status === 'voided') {
            return response()->json(['message' => 'Transaction already voided.'], 422);
        }

        DB::transaction(function () use ($request, $transaction) {
            // Restore stock for each item
            foreach ($transaction->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->increment('stock', $item->quantity);
                }
            }

            $transaction->update(['status' => 'voided']);

            AuditLog::create([
                'user_id'     => auth()->id() ?? 1,
                'action'      => 'void',
                'entity_type' => 'Transaction',
                'entity_id'   => $transaction->id,
                'description' => "Transaction {$transaction->reference_no} voided.",
                'ip_address'  => $request->ip(),
            ]);
        });

        return response()->json(['status' => 'voided', 'data' => $transaction->fresh()]);
    }
}