<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LabelController extends Controller
{
    public function create()
    {
        $products = Product::whereNotNull('sku')->orWhereNotNull('barcode')->get();
        // $products = Product::whereNull('barcode')->whereNotNull('sku')->get();

        return Inertia::render('labels/create', [
            'metaOptions' => ['title' => 'Cetak Label Barcode'],
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        $quantity = $request->quantity;

        $barcodeData = $product->sku ?: $product->barcode;

        $pdf = PDF::loadView('pdf.labels', compact('product', 'quantity', 'barcodeData'));
        $pdf->setPaper('a4', 'portrait');

        return $pdf->stream('labels-' . $product->name . '.pdf');
    }
}
