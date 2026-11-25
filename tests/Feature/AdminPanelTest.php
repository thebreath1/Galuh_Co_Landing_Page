<?php

use App\Models\Inquiry;
use App\Models\Order;
use App\Models\Product;
use App\Models\Promo;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

test('guests cannot access admin routes', function () {
    $this->get(route('admin.orders.index'))->assertRedirect(route('login'));
    $this->get(route('admin.products.index'))->assertRedirect(route('login'));
    $this->get(route('admin.content.index'))->assertRedirect(route('login'));
    $this->get(route('admin.testimonials.index'))->assertRedirect(route('login'));
    $this->get(route('admin.inquiries.index'))->assertRedirect(route('login'));
});

test('customers are forbidden from accessing admin routes', function () {
    $customer = User::factory()->create();
    $this->actingAs($customer);

    $this->get(route('dashboard'))->assertForbidden();
    $this->get(route('admin.orders.index'))->assertForbidden();
    $this->get(route('admin.shipments.index'))->assertForbidden();
    $this->get(route('admin.products.index'))->assertForbidden();
    $this->get(route('admin.promos.index'))->assertForbidden();
    $this->get(route('admin.content.index'))->assertForbidden();
    $this->get(route('admin.testimonials.index'))->assertForbidden();
    $this->get(route('admin.inquiries.index'))->assertForbidden();
});

test('authenticated admin can view all admin pages', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $this->get(route('dashboard'))->assertOk();
    $this->get(route('admin.orders.index'))->assertOk();
    $this->get(route('admin.products.index'))->assertOk();
    $this->get(route('admin.content.index'))->assertOk();
    $this->get(route('admin.testimonials.index'))->assertOk();
    $this->get(route('admin.inquiries.index'))->assertOk();
});

function fakePngUpload(string $filename): UploadedFile
{
    // Valid 1x1 PNG binary so validation passes cleanly even without ext-gd.
    $pngBinary = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');

    return UploadedFile::fake()->createWithContent($filename, $pngBinary);
}

test('admin can create, update with uploaded image, toggle, and delete catalog product', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $createResponse = $this->post(route('admin.products.store'), [
        'name' => 'Royal Emerald Box',
        'category' => 'Lebaran',
        'short_description' => 'Hampers mewah edisi spesial.',
        'contents' => ['Nastar Gold', 'Kastengel Edam'],
        'price_from' => 950000,
        'sort_order' => 1,
        'is_active' => true,
        'image_file' => fakePngUpload('hamper.png'),
    ]);

    $createResponse->assertRedirect();
    $product = Product::query()->where('name', 'Royal Emerald Box')->firstOrFail();
    expect($product->image)->toStartWith('/storage/products/');

    $storedRelativePath = str_replace('/storage/', '', $product->image);
    Storage::disk('public')->assertExists($storedRelativePath);

    $this->patch(route('admin.products.toggle', $product))->assertRedirect();
    expect($product->fresh()->is_active)->toBeFalse();

    $this->post(route('admin.products.update', $product), [
        'name' => 'Royal Emerald Grand',
        'category' => 'Corporate',
        'short_description' => 'Edisi korporat diperbarui.',
        'contents' => ['Kopi Artisan', 'Cokelat Single Origin'],
        'price_from' => 1200000,
        'sort_order' => 2,
        'is_active' => true,
        'image_url' => '/images/hero-hamper-left.webp',
    ])->assertRedirect();

    $updated = $product->fresh();
    expect($updated->name)->toBe('Royal Emerald Grand');
    expect($updated->image)->toBe('/images/hero-hamper-left.webp');
    Storage::disk('public')->assertMissing($storedRelativePath);

    $this->delete(route('admin.products.destroy', $updated))->assertRedirect();
    expect(Product::query()->find($updated->id))->toBeNull();
});

test('admin can update hero texts and images and reflect them on landing page', function () {
    Storage::fake('public');
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $payload = array_merge(SiteSetting::defaults(), [
        'hero_headline' => 'Hantaran Mewah Ciamis Eksklusif',
        'hero_subheadline' => 'Subheadline terbaru dari admin panel.',
        'whatsapp_number' => '628999999999',
        'hero_left_image_file' => fakePngUpload('left.png'),
    ]);

    $this->post(route('admin.content.update'), $payload)->assertRedirect();

    $resolved = SiteSetting::resolved();
    expect($resolved['hero_headline'])->toBe('Hantaran Mewah Ciamis Eksklusif');
    expect($resolved['hero_left_image'])->toStartWith('/storage/hero/');

    $homeResponse = $this->get(route('home'));
    $homeResponse->assertOk();
    $homeResponse->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('siteSettings.hero_headline', 'Hantaran Mewah Ciamis Eksklusif')
        ->where('whatsappNumber', '628999999999')
    );
});

test('admin can delete corporate inquiry', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $inquiry = Inquiry::query()->create([
        'name' => 'Budi Santoso',
        'company' => 'PT Nusantara',
        'email' => 'budi@nusantara.co.id',
        'whatsapp_number' => '08123456789',
        'estimated_quantity' => '100 Paket',
        'budget_per_package' => 'Rp 500rb - 1jt',
        'needed_date' => '2026-12-20',
    ]);

    $this->delete(route('admin.inquiries.destroy', $inquiry))->assertRedirect();
    expect(Inquiry::query()->find($inquiry->id))->toBeNull();
});

test('admin can create, update, toggle, and delete testimonials and reflect active ones on home', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $this->post(route('admin.testimonials.store'), [
        'name' => 'Rizky Pratama',
        'initials' => '',
        'role' => 'Direktur Operasional, PT Sinar Maju',
        'content' => 'Pengiriman rapi dan kue premiumnya sangat memuaskan.',
        'product_tag' => 'Executive Prestige Gift • Corporate',
        'rating' => 5,
        'sort_order' => 1,
        'is_active' => true,
    ])->assertRedirect();

    $testimonial = Testimonial::query()->where('name', 'Rizky Pratama')->firstOrFail();
    expect($testimonial->initials)->toBe('RP');

    $this->get(route('home'))->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('testimonials.0.name', 'Rizky Pratama')
    );

    $this->put(route('admin.testimonials.update', $testimonial), [
        'name' => 'Rizky Pratama',
        'initials' => 'RZK',
        'role' => 'CEO, PT Sinar Maju',
        'content' => 'Testimoni diperbarui oleh admin.',
        'product_tag' => 'The Royal Fitr • VIP',
        'rating' => 4,
        'sort_order' => 2,
        'is_active' => true,
    ])->assertRedirect();

    expect($testimonial->fresh()->initials)->toBe('RZK');
    expect($testimonial->fresh()->rating)->toBe(4);

    $this->patch(route('admin.testimonials.toggle', $testimonial))->assertRedirect();
    expect($testimonial->fresh()->is_active)->toBeFalse();

    $this->get(route('home'))->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('testimonials', 0)
    );

    $this->delete(route('admin.testimonials.destroy', $testimonial))->assertRedirect();
    expect(Testimonial::query()->find($testimonial->id))->toBeNull();
});

test('customer can submit manual order and admin can monitor, ACC, complete, and delete it', function () {
    $customer = User::factory()->create();
    $product = Product::query()->create([
        'name' => 'The Royal Fitr Test',
        'slug' => 'the-royal-fitr-test',
        'category' => 'Lebaran',
        'short_description' => 'Hampers Lebaran.',
        'contents' => ['Nastar'],
        'price_from' => 850000,
        'image' => '/images/hero-hamper-left.webp',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    $this->actingAs($customer)->post(route('orders.store'), [
        'product_id' => $product->id,
        'customer_name' => 'Ibu Rina',
        'customer_whatsapp' => '081234567890',
        'customer_email' => 'rina@example.com',
        'quantity' => 3,
        'delivery_date' => '2026-12-24',
        'shipping_address' => 'Jl. Jend. Sudirman No. 175, Ciamis',
        'greeting_card_note' => 'Selamat merayakan hari spesial!',
        'payment_method' => 'qris',
    ])->assertRedirect();

    $order = Order::query()->where('customer_name', 'Ibu Rina')->firstOrFail();
    expect($order->user_id)->toBe($customer->id);
    expect($order->status)->toBe(Order::STATUS_PENDING);
    expect($order->total_price)->toBe(2550000);
    expect($order->payment_method)->toBe('qris');

    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);

    $this->patch(route('admin.orders.updateStatus', $order), [
        'status' => Order::STATUS_APPROVED,
        'admin_note' => 'Stok tersedia, siap dirakit.',
    ])->assertRedirect();

    $approved = $order->fresh();
    expect($approved->status)->toBe(Order::STATUS_APPROVED);
    expect($approved->admin_note)->toBe('Stok tersedia, siap dirakit.');
    expect($approved->reviewed_by)->toBe($admin->id);

    $this->patch(route('admin.orders.updateStatus', $approved), [
        'status' => Order::STATUS_COMPLETED,
    ])->assertRedirect();
    expect($approved->fresh()->status)->toBe(Order::STATUS_COMPLETED);

    $this->delete(route('admin.orders.destroy', $approved))->assertRedirect();
    expect(Order::query()->find($approved->id))->toBeNull();
});

test('geocode endpoints return formatted indonesian street addresses and search suggestions', function () {
    Http::fake([
        'nominatim.openstreetmap.org/reverse*' => Http::response([
            'display_name' => 'Jalan Jendral Sudirman, Ciamis, Jawa Barat',
            'address' => [
                'road' => 'Jalan Jendral Sudirman',
                'house_number' => '175',
                'village' => 'Ciamis',
                'subdistrict' => 'Ciamis',
                'regency' => 'Kabupaten Ciamis',
                'state' => 'Jawa Barat',
                'postcode' => '46211',
            ],
        ], 200),
        'nominatim.openstreetmap.org/search*' => Http::response([
            [
                'lat' => '-7.3257',
                'lon' => '108.3534',
                'display_name' => 'Jalan Jendral Sudirman, Ciamis',
                'address' => [
                    'road' => 'Jalan Jendral Sudirman',
                    'subdistrict' => 'Ciamis',
                    'regency' => 'Kabupaten Ciamis',
                    'state' => 'Jawa Barat',
                    'postcode' => '46211',
                ],
            ],
        ], 200),
    ]);

    $reverseResponse = $this->getJson(route('geocode.reverse', [
        'lat' => -7.3257,
        'lon' => 108.3534,
    ]));

    $reverseResponse->assertOk()
        ->assertJsonPath('address', 'Jalan Jendral Sudirman No. 175, Ciamis, Kabupaten Ciamis, Jawa Barat 46211');

    $searchResponse = $this->getJson(route('geocode.search', [
        'q' => 'Sudirman Ciamis',
    ]));

    $searchResponse->assertOk()
        ->assertJsonCount(1, 'results')
        ->assertJsonPath('results.0.lat', -7.3257)
        ->assertJsonPath('results.0.lon', 108.3534);
});

test('admin can manage scheduled promos and active promo automatically discounts catalog and orders', function () {
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);

    $product = Product::query()->create([
        'name' => 'Royal Promo Hamper',
        'slug' => 'royal-promo-hamper',
        'category' => 'Lebaran',
        'short_description' => 'Hampers spesial promo.',
        'contents' => ['Nastar Gold'],
        'price_from' => 1000000,
        'image' => '/images/hero-hamper-left.webp',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    $this->get(route('admin.promos.index'))->assertOk();

    // Future promo (not yet active) should NOT discount now
    $this->post(route('admin.promos.store'), [
        'name' => 'Promo Bulan Depan',
        'discount_percent' => 30,
        'scope' => 'all',
        'starts_at' => now()->addDays(5)->format('Y-m-d H:i:s'),
        'ends_at' => now()->addDays(10)->format('Y-m-d H:i:s'),
        'is_active' => true,
    ])->assertRedirect();

    // Currently active category promo (20%)
    $this->post(route('admin.promos.store'), [
        'name' => 'Promo Lebaran 20%',
        'description' => 'Diskon khusus kategori Lebaran.',
        'discount_percent' => 20,
        'scope' => 'category',
        'target_category' => 'Lebaran',
        'starts_at' => now()->subHour()->format('Y-m-d H:i:s'),
        'ends_at' => now()->addDays(3)->format('Y-m-d H:i:s'),
        'is_active' => true,
    ])->assertRedirect();

    $activePromo = Promo::query()->where('name', 'Promo Lebaran 20%')->firstOrFail();

    // Landing page reflects active promo price (1,000,000 -> 800,000) and activePromos banner
    $this->get(route('home'))->assertOk()->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('activePromos', 1)
        ->where('activePromos.0.name', 'Promo Lebaran 20%')
        ->where('products.0.active_promo.promo_name', 'Promo Lebaran 20%')
        ->where('products.0.active_promo.discount_percent', 20)
        ->where('products.0.active_promo.discounted_price', 800000)
    );

    // Order automatically stores discounted price & savings
    $this->post(route('orders.store'), [
        'product_id' => $product->id,
        'customer_name' => 'Siti Aminah',
        'customer_whatsapp' => '081234567890',
        'quantity' => 2,
        'shipping_address' => 'Jl. Sudirman No. 10, Ciamis',
    ])->assertRedirect();

    $order = Order::query()->where('customer_name', 'Siti Aminah')->firstOrFail();
    expect($order->original_unit_price)->toBe(1000000);
    expect($order->unit_price)->toBe(800000);
    expect($order->total_price)->toBe(1600000);
    expect($order->discount_percent)->toBe(20);
    expect($order->discount_amount)->toBe(400000);
    expect($order->promo_name)->toBe('Promo Lebaran 20%');

    // Toggle off -> landing price returns to normal (no active_promo and empty activePromos)
    $this->patch(route('admin.promos.toggle', $activePromo))->assertRedirect();
    expect($activePromo->fresh()->is_active)->toBeFalse();

    $this->get(route('home'))->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('activePromos', 0)
        ->where('products.0.active_promo', null)
    );

    // Delete promo cleanly
    $this->delete(route('admin.promos.destroy', $activePromo))->assertRedirect();
    expect(Promo::query()->find($activePromo->id))->toBeNull();
});

test('approved orders move out of inbox into shipments tracking where admin updates delivery stages', function () {
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);

    $product = Product::query()->create([
        'name' => 'Shipment Hamper',
        'slug' => 'shipment-hamper',
        'category' => 'Wedding',
        'short_description' => 'Hampers pelacakan.',
        'contents' => ['Kue Artisanal', 'Teh Premium'],
        'price_from' => 900000,
        'image' => '/images/hero-hamper-left.webp',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    $this->post(route('orders.store'), [
        'product_id' => $product->id,
        'customer_name' => 'Andi Wijaya',
        'customer_whatsapp' => '081234567890',
        'quantity' => 1,
        'shipping_address' => 'Jl. Asia Afrika No. 88, Bandung',
    ])->assertRedirect();

    $order = Order::query()->where('customer_name', 'Andi Wijaya')->firstOrFail();

    // Initially visible in Pesanan Masuk, absent from Pelacakan Paket
    $this->get(route('admin.orders.index'))->assertInertia(fn ($page) => $page
        ->component('admin/orders')
        ->has('orders', 1)
        ->where('activeShipmentsCount', 0)
    );
    $this->get(route('admin.shipments.index'))->assertInertia(fn ($page) => $page
        ->component('admin/shipments')
        ->has('shipments', 0)
    );

    // ACC moves order from Pesanan Masuk into Pelacakan Paket
    $this->patch(route('admin.orders.updateStatus', $order), [
        'status' => Order::STATUS_APPROVED,
        'admin_note' => 'Siap masuk perakitan',
    ])->assertRedirect();

    $this->get(route('admin.orders.index'))->assertInertia(fn ($page) => $page
        ->has('orders', 0)
        ->where('activeShipmentsCount', 1)
    );
    $this->get(route('admin.shipments.index'))->assertInertia(fn ($page) => $page
        ->has('shipments', 1)
        ->where('shipments.0.fulfillment_stage', Order::STAGE_CURATING)
    );

    // Update courier & tracking stage -> shipped
    $this->patch(route('admin.shipments.update', $order), [
        'fulfillment_stage' => Order::STAGE_SHIPPED,
        'courier_name' => 'Paxel',
        'tracking_number' => 'PX-123456',
        'shipping_notes' => 'Kurir dalam perjalanan ke Bandung',
    ])->assertRedirect();

    $shipped = $order->fresh();
    expect($shipped->fulfillment_stage)->toBe(Order::STAGE_SHIPPED);
    expect($shipped->courier_name)->toBe('Paxel');
    expect($shipped->tracking_number)->toBe('PX-123456');
    expect($shipped->shipped_at)->not->toBeNull();
    expect(count($shipped->tracking_history ?? []))->toBeGreaterThanOrEqual(2);

    // Mark delivered -> syncs status to completed
    $this->patch(route('admin.shipments.update', $order), [
        'fulfillment_stage' => Order::STAGE_DELIVERED,
        'courier_name' => 'Paxel',
        'tracking_number' => 'PX-123456',
        'recipient_name' => 'Bpk. Andi langsung',
        'shipping_notes' => 'Paket sudah diterima',
    ])->assertRedirect();

    $delivered = $order->fresh();
    expect($delivered->status)->toBe(Order::STATUS_COMPLETED);
    expect($delivered->fulfillment_stage)->toBe(Order::STAGE_DELIVERED);
    expect($delivered->recipient_name)->toBe('Bpk. Andi langsung');
    expect($delivered->delivered_at)->not->toBeNull();
});

test('promo iso timestamps preserve exact Asia/Jakarta wall-clock date and time', function () {
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);

    // 22:30 WIB on 25 Nov 2026 is 15:30Z
    $this->post(route('admin.promos.store'), [
        'name' => 'Promo Malam WIB',
        'discount_percent' => 15,
        'scope' => 'all',
        'starts_at' => '2026-11-25T15:30:00.000Z',
        'ends_at' => '2026-11-25T16:00:00.000Z',
        'is_active' => true,
    ])->assertRedirect();

    $promo = Promo::query()->where('name', 'Promo Malam WIB')->firstOrFail();
    expect($promo->starts_at->timezoneName)->toBe('Asia/Jakarta');
    expect($promo->starts_at->format('Y-m-d H:i'))->toBe('2026-11-25 22:30');
    expect($promo->ends_at->format('Y-m-d H:i'))->toBe('2026-11-25 23:00');
});
