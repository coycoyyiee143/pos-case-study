<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * GET /api/users
     * Return a paginated list of all POS users.
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::select('id', 'username', 'role', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 15));

        return response()->json($users);
    }

    /**
     * POST /api/users
     * Create a new POS user.
     *
     * @throws ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'unique:users,username',
            ],
            'password' => [
                'required',
                'string',
                'min:4',
            ],
            'role' => [
                'required',
                Rule::in(User::ROLES),
            ],
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        return response()->json([
            'message' => 'User created successfully.',
            'user'    => $user->only('id', 'username', 'role', 'created_at'),
        ], 201);
    }

    /**
     * GET /api/users/{id}
     * Return a single user by ID.
     */
    public function show(string $id): JsonResponse
    {
        $user = User::select('id', 'username', 'role', 'created_at', 'updated_at')
            ->findOrFail($id);

        return response()->json($user);
    }

    /**
     * PUT /api/users/{id}
     * Update an existing user's details.
     *
     * @throws ValidationException
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'username' => [
                'sometimes',
                'required',
                'string',
                'min:3',
                'max:50',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
            'password' => [
                'sometimes',
                'required',
                'string',
                'min:4',
            ],
            'role' => [
                'sometimes',
                'required',
                Rule::in(User::ROLES),
            ],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully.',
            'user'    => $user->fresh()->only('id', 'username', 'role', 'updated_at'),
        ]);
    }

    /**
     * DELETE /api/users/{id}
     * Soft-delete (or permanently delete) a user.
     */
    public function destroy(string $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }
}
