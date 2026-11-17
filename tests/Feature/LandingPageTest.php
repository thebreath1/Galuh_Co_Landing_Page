<?php

namespace Tests\Feature;

use App\Mail\InquiryReceivedMail;
use App\Models\Inquiry;
use App\Models\Product;
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
}
