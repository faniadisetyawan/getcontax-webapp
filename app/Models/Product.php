<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'sku',
        'barcode',
        'name',
        'description',
        'price',
        'discount_nominal',
        'stock',
        'is_available',
        'is_consignment',
    ];
    
    public function orderDetails()
    {
        return $this->hasMany(ProductOrderDetail::class);
    }
}
