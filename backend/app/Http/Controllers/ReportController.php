<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    // GET /api/reports/sales-summary?period=daily OR monthly
    public function salesSummary(Request $request)
    {
        $period = $request->query('period', 'daily');

        if ($period === 'monthly') {
            $format = '%Y-%m';
            $label  = 'month';
        } else {
            $format = '%Y-%m-%d';
            $label  = 'date';
        }

        $summary = DB::table('transactions')
            ->selectRaw("DATE_FORMAT(created_at, '{$format}') as {$label}, COUNT(*) as total_transactions, SUM(total_amount) as total_sales")
            ->where('status', 'completed')
            ->groupByRaw("DATE_FORMAT(created_at, '{$format}')")
            ->orderByRaw("DATE_FORMAT(created_at, '{$format}') DESC")
            ->get();

        return response()->json($summary);
    }

    // GET /api/reports/transactions
    // Full transaction list for the admin
    public function transactions(Request $request)
    {
        $transactions = Transaction::with(['items', 'cashier'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($transactions);
    }
}