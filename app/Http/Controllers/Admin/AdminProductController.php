<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\MediaStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminProductController extends Controller
{
    private const CATEGORIES = ['Lebaran', 'Natal', 'Corporate', 'Wedding'];

    /**
     * Display the catalog management page.
     */
    public function index(): Response
    {
        $products = Product::query()
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('admin/products', [
            'products' => $products,
            'categories' => self::CATEGORIES,
        ]);
    }

    /**
     * Store a newly created catalog product.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateProduct($request, requireImage: true);

        $imagePath = $this->resolveProductImage($request, $validated['image_url'] ?? null);

        Product::query()->create([
            'name' => $validated['name'],
            'slug' => $this->generateUniqueSlug($validated['name']),
            'category' => $validated['category'],
            'short_description' => $validated['short_description'],
            'contents' => $this->normalizeContents($validated['contents']),
            'price_from' => $validated['price_from'],
            'image' => $imagePath,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->back()->with('success', 'Produk hampers baru berhasil ditambahkan ke katalog.');
    }

    /**
     * Update an existing catalog product and optionally replace its photo.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $this->validateProduct($request, requireImage: false);

        $imagePath = $this->resolveProductImage(
            $request,
            $validated['image_url'] ?? $product->image,
            $product->image
        );

        $slug = $product->name !== $validated['name']
            ? $this->generateUniqueSlug($validated['name'], $product->id)
            : $product->slug;

        $product->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'category' => $validated['category'],
            'short_description' => $validated['short_description'],
            'contents' => $this->normalizeContents($validated['contents']),
            'price_from' => $validated['price_from'],
            'image' => $imagePath,
            'sort_order' => $validated['sort_order'] ?? $product->sort_order,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->back()->with('success', "Produk \"{$product->name}\" berhasil diperbarui.");
    }

    /**
     * Toggle product visibility on the public catalog.
     */
    public function toggle(Product $product): RedirectResponse
    {
        $product->update(['is_active' => ! $product->is_active]);

        $statusLabel = $product->is_active ? 'ditampilkan di' : 'disembunyikan dari';

        return redirect()->back()->with('success', "Produk \"{$product->name}\" berhasil {$statusLabel} katalog.");
    }

    /**
     * Remove a product and its uploaded image if local.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $name = $product->name;
        MediaStorage::deleteIfLocalUpload($product->image);
        $product->delete();

        return redirect()->back()->with('success', "Produk \"{$name}\" berhasil dihapus.");
    }

    /**
     * @return array<string, mixed>
     */
    private function validateProduct(Request $request, bool $requireImage): array
    {
        $imageUrlRules = ['nullable', 'string', 'max:1000'];
        if ($requireImage) {
            $imageUrlRules[] = 'required_without:image_file';
        }

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', Rule::in(self::CATEGORIES)],
            'short_description' => ['required', 'string', 'max:1000'],
            'contents' => ['required', 'array', 'min:1'],
            'contents.*' => ['required', 'string', 'max:255'],
            'price_from' => ['required', 'integer', 'min:0'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'image_url' => $imageUrlRules,
        ], [
            'image_url.required_without' => 'Harap unggah file foto atau masukkan URL gambar produk.',
            'image_file.image' => 'File yang dipilih harus berupa gambar.',
            'image_file.max' => 'Ukuran foto maksimal 4 MB.',
            'contents.required' => 'Daftar isi paket minimal harus memiliki 1 item.',
        ]);
    }

    private function resolveProductImage(Request $request, ?string $fallbackUrl, ?string $previousUrl = null): string
    {
        if ($request->hasFile('image_file')) {
            return MediaStorage::replacePublicImage($request->file('image_file'), 'products', $previousUrl);
        }

        $trimmed = trim((string) $fallbackUrl);
        if ($previousUrl !== null && $trimmed !== '' && $trimmed !== $previousUrl) {
            MediaStorage::deleteIfLocalUpload($previousUrl);
        }

        return $trimmed !== '' ? $trimmed : (string) $previousUrl;
    }

    /**
     * @param  array<int, string>  $contents
     * @return array<int, string>
     */
    private function normalizeContents(array $contents): array
    {
        return array_values(array_filter(
            array_map(fn (string $item) => trim($item), $contents),
            fn (string $item) => $item !== ''
        ));
    }

    private function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name) ?: 'hamper';
        $slug = $baseSlug;
        $counter = 2;

        while (
            Product::query()
                ->when($ignoreId !== null, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
