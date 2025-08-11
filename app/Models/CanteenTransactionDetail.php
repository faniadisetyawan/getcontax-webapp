<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CanteenTransactionDetail extends Model
{
    protected $fillable = [
        'canteen_transaction_id',
        'product_id',
        'quantity',
        'price_per_item',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(CanteenTransaction::class, 'canteen_transaction_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
