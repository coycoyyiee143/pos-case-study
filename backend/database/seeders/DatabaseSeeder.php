<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'username' => 'admin',
            'password' => Hash::make('1234'),
            'role'     => 'admin',
        ]);

        // Create cashier user
        User::create([
            'username' => 'cashier1',
            'password' => Hash::make('1234'),
            'role'     => 'cashier',
        ]);

        // Create sample products
        $products = [
            ['name' => 'Coke 1.5L',       'price' => 75,  'stock' => 50],
            ['name' => 'Coke 250ml',       'price' => 20,  'stock' => 100],
            ['name' => 'Royal 1.5L',       'price' => 70,  'stock' => 50],
            ['name' => 'Sprite 1.5L',      'price' => 70,  'stock' => 50],
            ['name' => 'Mineral Water',    'price' => 15,  'stock' => 100],
            ['name' => 'Pancit Canton',    'price' => 15,  'stock' => 80],
            ['name' => 'Lucky Me Noodles', 'price' => 12,  'stock' => 80],
            ['name' => 'Tasty Bread',      'price' => 55,  'stock' => 30],
            ['name' => 'Tang Orange',      'price' => 8,   'stock' => 100],
            ['name' => 'Chippy',           'price' => 25,  'stock' => 60],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}