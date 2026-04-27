<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the POS system with default users.
     */
    public function run(): void
    {
        $users = [
            [
                'username' => 'cashier1',
                'password' => Hash::make('1234'),
                'role'     => 'Cashier',
            ],
            [
                'username' => 'supervisor1',
                'password' => Hash::make('1234'),
                'role'     => 'Supervisor',
            ],
            [
                'username' => 'admin1',
                'password' => Hash::make('1234'),
                'role'     => 'Administrator',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['username' => $user['username']],
                $user
            );
        }
    }
}
