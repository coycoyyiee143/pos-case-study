<?php

 use Illuminate\Http\Request;
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\AuthController;
// use App\Http\Controllers\ProductController;
// use App\Http\Controllers\TransactionController;
// use App\Http\Controllers\UserController;
// use App\Http\Controllers\ReportController;


// Route::get('/test', function () {
//     return response()->json(['message' => 'API working']);
// });


// // ===================== AUTH =====================
 Route::post('/login', [AuthController::class, 'login']);
 Route::post('/logout', [AuthController::class, 'logout']);


// // ===================== PRODUCTS =====================
// Route::get('/products', [ProductController::class, 'index']);      // view all
// Route::post('/products', [ProductController::class, 'store']);     // add
// Route::put('/products/{id}', [ProductController::class, 'update']); // edit
// Route::delete('/products/{id}', [ProductController::class, 'destroy']); // delete


// // ===================== TRANSACTIONS =====================
// Route::get('/transactions', [TransactionController::class, 'index']); // view
// Route::post('/transactions', [TransactionController::class, 'store']); // checkout


// // ===================== USERS =====================
// Route::get('/users', [UserController::class, 'index']);      // list users
// Route::post('/users', [UserController::class, 'store']);     // add user
// Route::put('/users/{id}', [UserController::class, 'update']); // edit user
// Route::delete('/users/{id}', [UserController::class, 'destroy']); // delete user


// // ===================== REPORTS =====================
// Route::get('/reports/sales', [ReportController::class, 'sales']);
// Route::get('/reports/transactions', [ReportController::class, 'transactions']);