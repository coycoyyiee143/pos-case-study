<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * GET /api/reports/sales-summary?period=daily|monthly
     */
    public function salesSummary(Request $request)
    {
        $period = $request->query('period', 'daily');

        // SQLite uses strftime(); MySQL uses DATE_FORMAT()
        $labelExpr = $period === 'monthly'
            ? DB::raw("strftime('%Y-%m', created_at) as label")
            : DB::raw("strftime('%Y-%m-%d', created_at) as label");

        $results = Transaction::query()
            ->where('status', '!=', 'voided')
            ->select([
                $labelExpr,
                DB::raw('COUNT(*) as total_transactions'),
                DB::raw('SUM(total_amount) as total_sales'),
            ])
            ->groupBy('label')
            ->orderBy('label', 'desc')
            ->get();

        return response()->json([
            'period' => $period,
            'data'   => $results,
        ]);
    }

    /**
     * GET /api/reports/transactions?start=YYYY-MM-DD&end=YYYY-MM-DD&status=completed&per_page=20
     */
    public function transactions(Request $request)
    {
        $query = Transaction::with('items.product', 'user')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }
        if ($request->filled('start')) {
            $query->whereDate('created_at', '>=', $request->query('start'));
        }
        if ($request->filled('end')) {
            $query->whereDate('created_at', '<=', $request->query('end'));
        }

        return response()->json($query->paginate((int) $request->query('per_page', 20)));
    }

    /**
     * GET /api/reports/top-products?period=daily|monthly&limit=10
     */
    public function topProducts(Request $request)
    {
        $period = $request->query('period', 'monthly');
        $limit  = (int) $request->query('limit', 10);

        $query = TransactionItem::query()
            ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->join('products',     'transaction_items.product_id',     '=', 'products.id')
            ->where('transactions.status', '!=', 'voided');

        // SQLite-compatible date scoping
        if ($period === 'daily') {
            $query->where(
                DB::raw("strftime('%Y-%m-%d', transactions.created_at)"),
                today()->toDateString()
            );
        } else {
            $query->where(
                DB::raw("strftime('%Y-%m', transactions.created_at)"),
                now()->format('Y-m')
            );
        }

        $results = $query
            ->select([
                'products.id',
                'products.name',
                DB::raw('SUM(transaction_items.quantity) as total_quantity'),
                DB::raw('SUM(transaction_items.subtotal) as total_revenue'),
            ])
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_quantity', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'period' => $period,
            'data'   => $results,
        ]);
    }
}