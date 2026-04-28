<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    // GET /api/audit-logs
    // Returns all logs, newest first, with the user who performed the action
    public function index()
    {
        $logs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }

    // POST /api/audit-logs
    // Create a new log entry (called internally by other controllers)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'action'      => 'required|string',
            'entity_type' => 'nullable|string',
            'entity_id'   => 'nullable|integer',
            'description' => 'nullable|string',
        ]);

        $log = AuditLog::create([
            ...$validated,
            'user_id'    => auth()->id(),
            'ip_address' => $request->ip(),
        ]);

        return response()->json($log, 201);
    }
}