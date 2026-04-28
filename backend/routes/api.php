<?php

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
// use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuditLogController;

// Reports (admin only)
Route::prefix('reports')->group(function () {
    Route::get('/sales-summary', [ReportController::class, 'salesSummary']);
    Route::get('/transactions',  [ReportController::class, 'transactions']);
});

// Audit Logs (admin only)
Route::prefix('audit-logs')->group(function () {
    Route::get('/',   [AuditLogController::class, 'index']);
    Route::post('/',  [AuditLogController::class, 'store']);
});


// Route::get('/test', function () {
//     return response()->json(['message' => 'API working']);
// });


// // ===================== AUTH =====================
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/logout', [AuthController::class, 'logout']);


// ===================== PRODUCTS =====================
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);


// // ===================== TRANSACTIONS =====================
// Route::get('/transactions', [TransactionController::class, 'index']); // view
// Route::post('/transactions', [TransactionController::class, 'store']); // checkout


// ===================== USERS =====================
Route::get('/users', [UserController::class, 'index']);        // list users
Route::post('/users', [UserController::class, 'store']);       // create user
Route::get('/users/{id}', [UserController::class, 'show']);    // get single user
Route::put('/users/{id}', [UserController::class, 'update']);  // update user
Route::delete('/users/{id}', [UserController::class, 'destroy']); // delete user

