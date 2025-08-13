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

    protected static function boot()
    {
        parent::boot();

        static::created(function ($product) {
            $prefix = 'PROD-';
            $paddedId = str_pad($product->id, 5, '0', STR_PAD_LEFT);

            $product->sku = $prefix . $paddedId;
            $product->save();
        });
    }
}
