<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminTestimonialController extends Controller
{
    /**
     * Display testimonials management page.
     */
    public function index(): Response
    {
        return Inertia::render('admin/testimonials', [
            'testimonials' => Testimonial::query()
                ->orderBy('sort_order')
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    /**
     * Store a newly created testimonial.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateTestimonial($request);

        Testimonial::query()->create([
            'initials' => $this->resolveInitials($validated['initials'] ?? null, $validated['name']),
            'name' => $validated['name'],
            'role' => $validated['role'],
            'content' => $validated['content'],
            'product_tag' => $validated['product_tag'],
            'rating' => $validated['rating'],
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->back()->with('success', 'Testimoni baru berhasil ditambahkan.');
    }

    /**
     * Update an existing testimonial.
     */
    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $this->validateTestimonial($request);

        $testimonial->update([
            'initials' => $this->resolveInitials($validated['initials'] ?? null, $validated['name']),
            'name' => $validated['name'],
            'role' => $validated['role'],
            'content' => $validated['content'],
            'product_tag' => $validated['product_tag'],
            'rating' => $validated['rating'],
            'sort_order' => $validated['sort_order'] ?? $testimonial->sort_order,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->back()->with('success', "Testimoni dari \"{$testimonial->name}\" berhasil diperbarui.");
    }

    /**
     * Toggle testimonial visibility on the landing page.
     */
    public function toggle(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update(['is_active' => ! $testimonial->is_active]);

        $statusLabel = $testimonial->is_active ? 'ditampilkan di' : 'disembunyikan dari';

        return redirect()->back()->with('success', "Testimoni \"{$testimonial->name}\" berhasil {$statusLabel} website.");
    }

    /**
     * Delete a testimonial record.
     */
    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $name = $testimonial->name;
        $testimonial->delete();

        return redirect()->back()->with('success', "Testimoni \"{$name}\" berhasil dihapus.");
    }

    /**
     * @return array<string, mixed>
     */
    private function validateTestimonial(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'initials' => ['nullable', 'string', 'max:8'],
            'role' => ['required', 'string', 'max:160'],
            'content' => ['required', 'string', 'max:1500'],
            'product_tag' => ['required', 'string', 'max:160'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    private function resolveInitials(?string $initials, string $name): string
    {
        $trimmed = Str::upper(trim((string) $initials));
        if ($trimmed !== '') {
            return Str::substr($trimmed, 0, 4);
        }

        $words = preg_split('/\s+/', trim($name)) ?: [];
        $letters = '';
        foreach ($words as $word) {
            if ($word !== '' && preg_match('/[A-Za-z0-9]/', $word)) {
                $letters .= Str::upper(Str::substr($word, 0, 1));
            }
            if (strlen($letters) >= 2) {
                break;
            }
        }

        return $letters !== '' ? $letters : 'GC';
    }
}
