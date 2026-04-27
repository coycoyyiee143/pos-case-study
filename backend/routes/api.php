<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| User Management Routes
|--------------------------------------------------------------------------
|
| All routes below are protected by Sanctum auth middleware to ensure
| only authenticated users can manage POS system accounts.
| Role-scoped restrictions (Administrator only) should be applied at the
| middleware or policy layer.
|
*/

Route::middleware(['auth:sanctum'])->prefix('users')->name('users.')->group(function () {

    // GET    /api/users          — list all users (paginated)
    Route::get('/',      [UserController::class, 'index'])->name('index');

    // POST   /api/users          — create a new user
    Route::post('/',     [UserController::class, 'store'])->name('store');

    // GET    /api/users/{id}     — get a single user
    Route::get('/{id}',  [UserController::class, 'show'])->name('show');

    // PUT    /api/users/{id}     — update a user's username / password / role
    Route::put('/{id}',  [UserController::class, 'update'])->name('update');

    // DELETE /api/users/{id}     — delete a user
    Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');
});
