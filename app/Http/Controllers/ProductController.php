<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {

        $search = $request->query('search');
        $sort = $request->query('sort', 'created_at');
        $order = $request->query('order', 'asc');
        $perPage = $request->query('per_page', 10);

        $query = Product::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('barcode', 'like', "%{$search}%");
        }
        $query->orderBy($sort, $order);
        $resource = $query->paginate($perPage);
        $products = ProductResource::collection($resource);

        return Inertia::render('products/index', [
            'metaOptions' => ['title' => 'Inventory'],
            'responseData' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render('products/form-builder', [
            'metaOptions' => ['title' => 'Tambah Produk Baru'],
            'old' => null,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        Product::create($request->validated());
        return to_route('canteens.inventory.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $resource = Product::findOrFail($id);
        ProductResource::withoutWrapping();
        $product = new ProductResource($resource);
        return Inertia::render('products/form-builder', [
            'metaOptions' => ['title' => 'Edit Produk: ' . $product->name],
            'old' => $product,
        ]);
    }

    public function update(UpdateProductRequest $request, string $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->validated());
        return to_route('canteens.inventory.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        // Pengecekan keamanan: Jangan hapus produk jika sudah pernah ada transaksi
        if ($product->orderDetails()->exists()) {
            return back()->with('error', 'Produk tidak bisa dihapus karena memiliki riwayat transaksi.');
        }

        $product->delete();
        return redirect()
            ->route('canteens.inventory.index', request()->query())
            ->with('success', 'Produk berhasil dihapus.');
    }
}
