<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuditLogController;

// Test route to verify the file is loading
Route::get('/test-api', function () {
    return response()->json(['message' => 'API routes are active!']);
});

// ===================== AUTH =====================
Route::post('/login', [AuthController::class, 'login']);

// ===================== PRODUCTS =====================
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// ===================== TRANSACTIONS =====================
Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);

// ===================== USERS =====================
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// ===================== REPORTS (admin only) =====================
Route::prefix('reports')->group(function () {
    Route::get('/sales-summary', [ReportController::class, 'salesSummary']);
    Route::get('/transactions', [ReportController::class, 'transactions']);
    Route::get('/top-products', [ReportController::class, 'topProducts']);
});

// ===================== AUDIT LOGS (admin only) =====================
Route::prefix('audit-logs')->group(function () {
    Route::get('/', [AuditLogController::class, 'index']);
    Route::post('/', [AuditLogController::class, 'store']);
});