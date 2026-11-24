<?php

use App\Models\Inquiry;
use App\Models\Order;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests cannot access admin routes', function () {
    $this->get(route('admin.orders.index'))->assertRedirect(route('login'));
    $this->get(route('admin.products.index'))->assertRedirect(route('login'));
    $this->get(route('admin.content.index'))->assertRedirect(route('login'));
    $this->get(route('admin.testimonials.index'))->assertRedirect(route('login'));
    $this->get(route('admin.inquiries.index'))->assertRedirect(route('login'));
});

test('authenticated admin can view all admin pages', function () {
    $user = User::factory()->create();
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
    $user = User::factory()->create();
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
    $user = User::factory()->create();
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
    $user = User::factory()->create();
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
    $user = User::factory()->create();
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

    $this->post(route('orders.store'), [
        'product_id' => $product->id,
        'customer_name' => 'Ibu Rina',
        'customer_whatsapp' => '081234567890',
        'customer_email' => 'rina@example.com',
        'quantity' => 3,
        'delivery_date' => '2026-12-24',
        'shipping_address' => 'Jl. Jend. Sudirman No. 175, Ciamis',
        'greeting_card_note' => 'Selamat merayakan hari spesial!',
    ])->assertRedirect();

    $order = Order::query()->where('customer_name', 'Ibu Rina')->firstOrFail();
    expect($order->status)->toBe(Order::STATUS_PENDING);
    expect($order->total_price)->toBe(2550000);

    $admin = User::factory()->create();
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
