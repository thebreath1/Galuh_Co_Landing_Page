<?php

namespace Tests\Feature;

use App\Mail\InquiryReceivedMail;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_renders_successfully_with_products_and_whatsapp_number(): void
    {
        Product::create([
            'name' => 'The Royal Fitr',
            'slug' => 'the-royal-fitr',
            'category' => 'Lebaran',
            'short_description' => 'Hampers Lebaran Mewah',
            'contents' => ['Nastar', 'Kastengel'],
            'price_from' => 850000,
            'image' => 'https://example.com/img.jpg',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Inactive Hamper',
            'slug' => 'inactive-hamper',
            'category' => 'Lebaran',
            'short_description' => 'Produk tidak aktif',
            'contents' => ['Kue'],
            'price_from' => 300000,
            'image' => 'https://example.com/inactive.jpg',
            'sort_order' => 2,
            'is_active' => false,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('products', 1)
            ->where('products.0.name', 'The Royal Fitr')
            ->has('whatsappNumber')
        );
    }

    public function test_corporate_inquiry_can_be_submitted_successfully(): void
    {
        Mail::fake();

        $formData = [
            'name' => 'Budi Santoso',
            'company' => 'PT Sumber Makmur',
            'email' => 'budi@sumbermakmur.com',
            'whatsapp_number' => '081234567890',
            'estimated_quantity' => '50 - 100 paket',
            'budget_per_package' => 'Rp 350.000 - Rp 500.000',
            'payment_method' => 'po_net14',
            'needed_date' => now()->addDays(14)->format('Y-m-d'),
            'notes' => 'Tolong sertakan custom logo emas pada box.',
            'website' => '', // honeypot empty
        ];

        $response = $this->post('/inquiries', $formData);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('inquiries', [
            'name' => 'Budi Santoso',
            'company' => 'PT Sumber Makmur',
            'email' => 'budi@sumbermakmur.com',
            'payment_method' => 'po_net14',
        ]);

        Mail::assertSent(InquiryReceivedMail::class);
    }

    public function test_inquiry_fails_if_honeypot_field_is_filled(): void
    {
        Mail::fake();

        $formData = [
            'name' => 'Spam Bot',
            'company' => 'Bot Company',
            'email' => 'bot@spam.com',
            'whatsapp_number' => '081234567890',
            'estimated_quantity' => '50 - 100 paket',
            'budget_per_package' => 'Rp 350.000 - Rp 500.000',
            'needed_date' => now()->addDays(7)->format('Y-m-d'),
            'notes' => 'Spam link',
            'website' => 'http://spamlink.com', // honeypot filled by bot
        ];

        $response = $this->post('/inquiries', $formData);

        $response->assertSessionHasErrors('website');
        $this->assertDatabaseCount('inquiries', 0);
        Mail::assertNothingSent();
    }

    public function test_inquiry_validates_required_fields(): void
    {
        $response = $this->post('/inquiries', []);

        $response->assertSessionHasErrors([
            'name',
            'company',
            'email',
            'whatsapp_number',
            'estimated_quantity',
            'budget_per_package',
            'needed_date',
        ]);
    }

    public function test_phone_numbers_exceeding_12_digits_are_rejected(): void
    {
        $customer = User::factory()->create();

        $product = Product::create([
            'name' => 'Test Phone Limit',
            'slug' => 'test-phone-limit',
            'category' => 'Lebaran',
            'short_description' => 'Hampers',
            'contents' => ['Nastar'],
            'price_from' => 500000,
            'image' => 'https://example.com/img.jpg',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->actingAs($customer)->post('/orders', [
            'product_id' => $product->id,
            'customer_name' => 'Tester',
            'customer_whatsapp' => '0812345678901', // 13 digits
            'shipping_address' => 'Jl. Sudirman No. 1',
            'quantity' => 1,
        ])->assertSessionHasErrors('customer_whatsapp');

        $this->post('/inquiries', [
            'name' => 'Tester Corp',
            'company' => 'PT Uji',
            'email' => 'tester@gmail.com',
            'whatsapp_number' => '0812345678901', // 13 digits
            'estimated_quantity' => '50 - 100 paket',
            'budget_per_package' => 'Rp 350.000 - Rp 500.000',
            'needed_date' => now()->addDays(7)->format('Y-m-d'),
        ])->assertSessionHasErrors('whatsapp_number');
    }

    public function test_guest_cannot_submit_order_and_is_redirected_to_login(): void
    {
        $product = Product::create([
            'name' => 'Guest Gate Hamper',
            'slug' => 'guest-gate-hamper',
            'category' => 'Lebaran',
            'short_description' => 'Hampers',
            'contents' => ['Nastar'],
            'price_from' => 500000,
            'image' => 'https://example.com/img.jpg',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->post('/orders', [
            'product_id' => $product->id,
            'customer_name' => 'Guest User',
            'customer_whatsapp' => '081234567890',
            'shipping_address' => 'Jl. Sudirman No. 1',
            'quantity' => 1,
        ])->assertRedirect(route('login'));

        $this->assertDatabaseCount('orders', 0);
        $this->get(route('orders.mine'))->assertRedirect(route('login'));
    }

    public function test_authenticated_customer_can_order_and_view_only_own_orders(): void
    {
        $customerA = User::factory()->create(['name' => 'Customer A']);
        $customerB = User::factory()->create(['name' => 'Customer B']);

        $product = Product::create([
            'name' => 'Member Hamper',
            'slug' => 'member-hamper',
            'category' => 'Lebaran',
            'short_description' => 'Hampers',
            'contents' => ['Nastar'],
            'price_from' => 750000,
            'image' => 'https://example.com/img.jpg',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->actingAs($customerA)->post(route('orders.store'), [
            'product_id' => $product->id,
            'customer_name' => 'Customer A',
            'customer_whatsapp' => '081234567890',
            'shipping_address' => 'Jl. Sudirman No. 10',
            'quantity' => 2,
        ])->assertRedirect();

        $orderA = Order::query()->where('user_id', $customerA->id)->firstOrFail();
        expect($orderA->customer_email)->toBe($customerA->email);

        $this->actingAs($customerB)->post(route('orders.store'), [
            'product_id' => $product->id,
            'customer_name' => 'Customer B',
            'customer_whatsapp' => '081234567891',
            'shipping_address' => 'Jl. Merdeka No. 20',
            'quantity' => 1,
        ])->assertRedirect();

        $this->actingAs($customerA)
            ->get(route('orders.mine'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('orders/index')
                ->has('orders', 1)
                ->where('orders.0.order_code', $orderA->order_code)
            );
    }
}
