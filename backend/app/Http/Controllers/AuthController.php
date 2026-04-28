<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuthToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // delete old tokens
        AuthToken::where('user_id', $user->id)->delete();

        // create new token
        $token = Str::random(64);
        AuthToken::create([
            'user_id' => $user->id,
            'token' => $token,
        ]);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'role' => $user->role,
            ],
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        AuthToken::where('token', $token)->delete();

        return response()->json(['message' => 'Logged out']);
    }
}