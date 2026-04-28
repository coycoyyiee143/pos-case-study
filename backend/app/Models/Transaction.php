<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'reference_no',
        'user_id',
        'total_amount',
        'cash_received',
        'change_amount',
        'discount_amount',
        'discount_type',
        'payment_method',
        'status',           // ← must be here
    ];

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}