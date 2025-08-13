<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CanteenPOSController extends Controller
{
    public function index()
    {
        $products = Product::where('is_available', true)->get();

        return Inertia::render('canteen/pos', [
            'metaOptions' => [
                'title' => 'POS Kantin',
            ],
            'products' => $products,
        ]);
    }
}
