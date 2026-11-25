<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Promo;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminPromoController extends Controller
{
    private const CATEGORIES = ['Lebaran', 'Natal', 'Corporate', 'Wedding'];

    /**
     * Display scheduled promos & automatic discounts management page.
     */
    public function index(): Response
    {
        $promos = Promo::query()
            ->with('product:id,name,category,price_from')
            ->orderByDesc('is_active')
            ->orderBy('starts_at')
            ->orderByDesc('id')
            ->get();

        $products = Product::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'category', 'price_from']);

        return Inertia::render('admin/promos', [
            'promos' => $promos,
            'products' => $products,
            'categories' => self::CATEGORIES,
        ]);
    }

    /**
     * Store a newly created scheduled promo.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePromo($request);

        Promo::query()->create([
            'name' => $validated['name'],
            'description' => ($validated['description'] ?? null) ?: null,
            'discount_percent' => (int) $validated['discount_percent'],
            'scope' => $validated['scope'],
            'target_category' => $validated['scope'] === Promo::SCOPE_CATEGORY
                ? ($validated['target_category'] ?? null)
                : null,
            'product_id' => $validated['scope'] === Promo::SCOPE_PRODUCT
                ? ($validated['product_id'] ?? null)
                : null,
            'starts_at' => CarbonImmutable::parse($validated['starts_at'])->setTimezone(config('app.timezone')),
            'ends_at' => CarbonImmutable::parse($validated['ends_at'])->setTimezone(config('app.timezone')),
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->back()->with('success', 'Promo diskon terjadwal berhasil dibuat.');
    }

    /**
     * Update an existing scheduled promo.
     */
    public function update(Request $request, Promo $promo): RedirectResponse
    {
        $validated = $this->validatePromo($request);

        $promo->update([
            'name' => $validated['name'],
            'description' => ($validated['description'] ?? null) ?: null,
            'discount_percent' => (int) $validated['discount_percent'],
            'scope' => $validated['scope'],
            'target_category' => $validated['scope'] === Promo::SCOPE_CATEGORY
                ? ($validated['target_category'] ?? null)
                : null,
            'product_id' => $validated['scope'] === Promo::SCOPE_PRODUCT
                ? ($validated['product_id'] ?? null)
                : null,
            'starts_at' => CarbonImmutable::parse($validated['starts_at'])->setTimezone(config('app.timezone')),
            'ends_at' => CarbonImmutable::parse($validated['ends_at'])->setTimezone(config('app.timezone')),
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->back()->with('success', "Promo \"{$promo->name}\" berhasil diperbarui.");
    }

    /**
     * Toggle promo active status quickly.
     */
    public function toggle(Promo $promo): RedirectResponse
    {
        $promo->update(['is_active' => ! $promo->is_active]);

        $statusLabel = $promo->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()->with('success', "Promo \"{$promo->name}\" berhasil {$statusLabel}.");
    }

    /**
     * Delete a promo record.
     */
    public function destroy(Promo $promo): RedirectResponse
    {
        $name = $promo->name;
        $promo->delete();

        return redirect()->back()->with('success', "Promo \"{$name}\" berhasil dihapus.");
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePromo(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:500'],
            'discount_percent' => ['required', 'integer', 'min:1', 'max:90'],
            'scope' => ['required', 'string', Rule::in(Promo::SCOPES)],
            'target_category' => [
                'nullable',
                'required_if:scope,' . Promo::SCOPE_CATEGORY,
                'string',
                Rule::in(self::CATEGORIES),
            ],
            'product_id' => [
                'nullable',
                'required_if:scope,' . Promo::SCOPE_PRODUCT,
                'integer',
                'exists:products,id',
            ],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'name.required' => 'Nama promo wajib diisi.',
            'discount_percent.min' => 'Minimal diskon adalah 1%.',
            'discount_percent.max' => 'Maksimal diskon adalah 90%.',
            'target_category.required_if' => 'Pilih kategori target untuk promo per kategori.',
            'product_id.required_if' => 'Pilih produk hampers untuk promo khusus produk.',
            'ends_at.after' => 'Tanggal berakhir harus lebih lambat dari tanggal mulai.',
        ]);
    }
}
