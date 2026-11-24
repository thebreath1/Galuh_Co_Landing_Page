<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Default values for editable landing page sections.
     *
     * @return array<string, string>
     */
    public static function defaults(): array
    {
        return [
            'hero_headline' => 'Hampers Eksklusif untuk Setiap Hantaran Berkesan',
            'hero_subheadline' => 'Selamat datang di GALUH & CO. — kurasi kotak hadiah & hampers premium untuk Lebaran, Natal, Corporate, dan Wedding dengan kudapan pilihan, kemasan mewah, serta sentuhan personal.',
            'hero_primary_cta_label' => 'Lihat Koleksi',
            'hero_secondary_cta_label' => 'Pesan via WhatsApp',
            'hero_bg_image' => '/images/hero-hampers-bg.webp',
            'hero_left_image' => '/images/hero-hamper-left.webp',
            'hero_right_image' => '/images/hero-hamper-right.webp',
            'hero_stat_1_value' => '5.000+',
            'hero_stat_1_label' => 'Hampers Terkirim',
            'hero_stat_2_value' => '120+',
            'hero_stat_2_label' => 'Mitra Korporat',
            'hero_stat_3_value' => '4.9',
            'hero_stat_3_label' => 'Kepuasan Klien',
            'about_eyebrow' => 'Filosofi Kami',
            'about_title' => 'Menghadirkan Keindahan dalam Tradisi Berbagi',
            'about_description' => 'Di GALUH & CO., kami meyakini bahwa sebuah hadiah bukan sekadar bingkisan, melainkan jembatan rasa dan wujud penghormatan tulus. Kami merajut kehangatan melalui detail estetika paripurna yang menghidupkan setiap momen istimewa Anda.',
            'collection_eyebrow' => 'Katalog Kami',
            'collection_title' => 'Koleksi Hampers Pilihan',
            'collection_description' => 'Temukan paduan sempurna rasa lezat dan estetika kemasan untuk setiap perayaan berharga Anda.',
            'testimonials_eyebrow' => 'Testimoni Klien',
            'testimonials_title' => 'Cerita Hangat dari Mereka yang Telah Berbagi',
            'testimonials_description' => 'Kepuasan dan senyum penerima adalah tolak ukur dedikasi kami dalam merangkai setiap hantaran.',
            'whatsapp_number' => (string) config('services.whatsapp.number', '6281234567890'),
        ];
    }

    /**
     * Return all settings merged with defaults.
     *
     * @return array<string, string>
     */
    public static function resolved(): array
    {
        $defaults = static::defaults();
        $stored = static::query()
            ->whereIn('key', array_keys($defaults))
            ->pluck('value', 'key')
            ->all();

        foreach ($stored as $key => $value) {
            if (is_string($value) && trim($value) !== '') {
                $defaults[$key] = $value;
            }
        }

        return $defaults;
    }
}
