<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\MediaStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminContentController extends Controller
{
    private const IMAGE_UPLOAD_FIELDS = [
        'hero_bg_image_file' => 'hero_bg_image',
        'hero_left_image_file' => 'hero_left_image',
        'hero_right_image_file' => 'hero_right_image',
    ];

    /**
     * Display the landing page content & hero editor.
     */
    public function index(): Response
    {
        return Inertia::render('admin/content', [
            'settings' => SiteSetting::resolved(),
            'defaults' => SiteSetting::defaults(),
        ]);
    }

    /**
     * Persist updated landing page texts, hero images, and contact settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_headline' => ['required', 'string', 'max:255'],
            'hero_subheadline' => ['required', 'string', 'max:1000'],
            'hero_primary_cta_label' => ['required', 'string', 'max:80'],
            'hero_secondary_cta_label' => ['required', 'string', 'max:80'],
            'hero_bg_image' => ['required', 'string', 'max:1000'],
            'hero_left_image' => ['required', 'string', 'max:1000'],
            'hero_right_image' => ['required', 'string', 'max:1000'],
            'hero_stat_1_value' => ['required', 'string', 'max:40'],
            'hero_stat_1_label' => ['required', 'string', 'max:80'],
            'hero_stat_2_value' => ['required', 'string', 'max:40'],
            'hero_stat_2_label' => ['required', 'string', 'max:80'],
            'hero_stat_3_value' => ['required', 'string', 'max:40'],
            'hero_stat_3_label' => ['required', 'string', 'max:80'],
            'about_eyebrow' => ['required', 'string', 'max:80'],
            'about_title' => ['required', 'string', 'max:255'],
            'about_description' => ['required', 'string', 'max:1000'],
            'collection_eyebrow' => ['required', 'string', 'max:80'],
            'collection_title' => ['required', 'string', 'max:255'],
            'collection_description' => ['required', 'string', 'max:1000'],
            'testimonials_eyebrow' => ['required', 'string', 'max:80'],
            'testimonials_title' => ['required', 'string', 'max:255'],
            'testimonials_description' => ['required', 'string', 'max:1000'],
            'whatsapp_number' => ['required', 'string', 'max:30'],
            'hero_bg_image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'hero_left_image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'hero_right_image_file' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $current = SiteSetting::resolved();

        foreach (self::IMAGE_UPLOAD_FIELDS as $fileField => $settingKey) {
            if ($request->hasFile($fileField)) {
                $validated[$settingKey] = MediaStorage::replacePublicImage(
                    $request->file($fileField),
                    'hero',
                    $current[$settingKey] ?? null
                );
            }
            unset($validated[$fileField]);
        }

        foreach ($validated as $key => $value) {
            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => trim((string) $value)]
            );
        }

        return redirect()->back()->with('success', 'Konten Hero, landing page, dan foto berhasil disimpan.');
    }
}
