<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'The Royal Fitr',
                'slug' => 'the-royal-fitr',
                'category' => 'Lebaran',
                'short_description' => 'Koleksi hantaran agung bernuansa zamrud dan emas, merayakan hari kemenangan dengan kehangatan cita rasa istimewa.',
                'contents' => [
                    'Nastar Gold Leaf Wysman (Toples Kaca Kedap)',
                    'Kastengel Keju Edam Tua Istimewa',
                    'Premium Medjool Dates & Walnut',
                    'Artisanal Royal Chamomile Tea Blend',
                    'Custom Silk Greeting Card & Wax Seal Gold',
                ],
                'price_from' => 850000,
                'image' => 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Noor Mubarak Hamper',
                'slug' => 'noor-mubarak-hamper',
                'category' => 'Lebaran',
                'short_description' => 'Kombinasi klasik kue kering warisan keluarga dan madu hutan murni dalam kotak velvet eksklusif.',
                'contents' => [
                    'Putri Salju Mede Premium',
                    'Sagu Keju Lumer Istimewa',
                    'Pure Raw Blossom Honey (250g)',
                    'Stainless Gold Honey Dipper',
                    'Velvet Gift Box with Gold Foil Motif',
                ],
                'price_from' => 620000,
                'image' => 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Winter Solstice Elegance',
                'slug' => 'winter-solstice-elegance',
                'category' => 'Natal',
                'short_description' => 'Kehangatan rempah musim dingin, cokelat artisan, dan aroma lilin pinus untuk momen Natal penuh cinta.',
                'contents' => [
                    'Gingerbread Spiced Butter Biscuits',
                    'Single-Origin Dark Cocoa Truffles',
                    'Hand-Poured Pine & Amber Scented Candle',
                    'Spiced Winter Berry Tea Blend',
                    'Luxury Pinecone & Velvet Ribbon Tag',
                ],
                'price_from' => 780000,
                'image' => 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Noël Joy Grand Box',
                'slug' => 'noel-joy-grand-box',
                'category' => 'Natal',
                'short_description' => 'Paket mewah perayaan akhir tahun dengan sajian kudapan Eropa dalam kotak kayu jati ukir berkelas.',
                'contents' => [
                    'Traditional Italian Panettone (500g)',
                    'Almond Florentine Crisps',
                    'Artisan Caramelized Cashew & Cranberry',
                    'Mulled Wine Spice Sachet Kit',
                    'Custom Wooden Keepsake Box with Brass Lock',
                ],
                'price_from' => 1250000,
                'image' => 'https://images.unsplash.com/photo-1543257580-7269da773bf5?q=80&w=800&auto=format&fit=crop',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Executive Prestige Gift',
                'slug' => 'executive-prestige-gift',
                'category' => 'Corporate',
                'short_description' => 'Representasi apresiasi profesional berkelas dengan logo perusahaan yang dicetak emas timbul pada hardbox magnetik.',
                'contents' => [
                    'Exclusive Arabica Toraja Drip Coffee (5 Sachet)',
                    'Double-Wall Thermal Mug (Custom Logo Grafir)',
                    'Gourmet Macadamia Butter Cookies',
                    'Leather Journal & Gold Metallic Pen',
                    'Corporate Hardbox with Magnetic Clasp',
                ],
                'price_from' => 950000,
                'image' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Synergy Grand Hamper',
                'slug' => 'synergy-grand-hamper',
                'category' => 'Corporate',
                'short_description' => 'Paket bingkisan relasi korporat skala besar untuk merayakan kemitraan bisnis yang sukses dan kokoh.',
                'contents' => [
                    '2 Toples Cookies Pilihan (Nastar & Kastengel)',
                    'Sparkling Apple Grape Cider (Non-Alkohol 750ml)',
                    'Artisanal Roasted Almond & Pistachio Jar',
                    'Custom Branded Satin Sleeve & Ribbon',
                    'Kartu Ucapan Korporat Bergrafir Foil',
                ],
                'price_from' => 680000,
                'image' => 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Eternal Grace Bridal Suite',
                'slug' => 'eternal-grace-bridal-suite',
                'category' => 'Wedding',
                'short_description' => 'Bingkisan pengiring pengantin dan tamu kehormatan dengan sentuhan sutra, renda, dan aroma mawar damask.',
                'contents' => [
                    'Organic Rose Infused Body Soufflé',
                    'Damask Rose Blossom Tea Canister',
                    'Mini Champagne Flute Glass Set (2 pcs)',
                    'Handcrafted Lavender Bath Salt Jar',
                    'Calligraphy Name Card & Pure Silk Bow',
                ],
                'price_from' => 890000,
                'image' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Amour Souvenir Prestige',
                'slug' => 'amour-souvenir-prestige',
                'category' => 'Wedding',
                'short_description' => 'Kenang-kenangan eksklusif ikatan suci pernikahan dengan detail inisial monogram pasangan yang abadi.',
                'contents' => [
                    'Artisan French Macarons Box (Isi 6)',
                    'Personalized Scented Ceramic Diffuser',
                    'Wild Flower Blossom Honey Jar 150g',
                    'Embossed Initial Monogram Tag',
                    'Pastel Ivory Textured Box with Gold Trim',
                ],
                'price_from' => 520000,
                'image' => 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop',
                'sort_order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Corporate Signature Delight',
                'slug' => 'corporate-signature-delight',
                'category' => 'Corporate',
                'short_description' => 'Bingkisan apresiasi kompak namun prestisius untuk rekan tim dan partner berkinerja tinggi.',
                'contents' => [
                    'Artisan Dark Chocolate Bar 70% Single Origin',
                    'Earl Grey Reserve Loose Leaf Tin',
                    'Ceramic Tea Tumbler with Infuser',
                    'Personalized Motivation Greeting Card',
                    'Rigid Box with Custom Logo Emboss',
                ],
                'price_from' => 480000,
                'image' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
                'sort_order' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'Symphony of Eid Grandeur',
                'slug' => 'symphony-of-eid-grandeur',
                'category' => 'Lebaran',
                'short_description' => 'Harmoni rasa manis dan gurih istimewa di hari raya yang dikemas dalam keanggunan motif islami modern.',
                'contents' => [
                    'Lapis Legit Wisman Mini Square (10x10 cm)',
                    'Kaasstengels Gouda Premium Extra Keju',
                    'Kurma Ajwa Madinah Grade A dalam Jar Kaca',
                    'Tasbih Kayu Cendana Alami Wangi',
                    'Emerald Green Box with Gold Lattice Cut',
                ],
                'price_from' => 1100000,
                'image' => 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=800&auto=format&fit=crop',
                'sort_order' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['slug' => $product['slug']],
                $product
            );
        }
    }
}
