<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'initials' => 'DS',
                'name' => 'Dian Sastrawati',
                'role' => 'VP Human Capital, PT Astra Financial',
                'content' => 'Kerapian kemasan dan kelezatan kue kering dari GALUH & CO. mendapat apresiasi langsung dari jajaran direksi kami. Pengiriman multi-alamat ke 300 rekan bisnis di 5 kota besar terlaksana tepat waktu tanpa cacat.',
                'product_tag' => 'Synergy Grand Hamper • Corporate Order',
                'rating' => 5,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'initials' => 'HG',
                'name' => 'Hendra Gunawan',
                'role' => 'Managing Partner, HG Law Firm',
                'content' => 'Hampers akhir tahun untuk para klien VVIP kami dipersiapkan dengan sangat eksklusif. Grafir logo emas di atas hardbox magnetik beludru membuat bingkisan ini terasa berbobot, elegan, dan penuh rasa hormat.',
                'product_tag' => 'Executive Prestige Gift • VIP Custom',
                'rating' => 5,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'initials' => 'NF',
                'name' => 'Nadira & Fikri',
                'role' => 'Bridal Couple, Jakarta Selatan',
                'content' => 'Souvenir dan hampers pengiring pengantin kami luar biasa anggun. Detail pita satin sutra dan stempel lilin monogram inisial nama kami membuat sahabat-sahabat terharu saat menerima undangannya.',
                'product_tag' => 'Eternal Grace Bridal Suite • Wedding',
                'rating' => 5,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'initials' => 'KC',
                'name' => 'Kartika Chandra',
                'role' => 'Private Client, Surabaya',
                'content' => 'Sudah 3 tahun berturut-turut saya mempercayakan hampers Idul Fitri kepada GALUH & CO. Rasa nastar wisman dan kastengelnya benar-benar resep asli mentega Belanda. Selalu jadi rebutan keluarga!',
                'product_tag' => 'The Royal Fitr • Personal Order',
                'rating' => 5,
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($items as $item) {
            Testimonial::query()->updateOrCreate(
                ['name' => $item['name']],
                $item
            );
        }
    }
}
