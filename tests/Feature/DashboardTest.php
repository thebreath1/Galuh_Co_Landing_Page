<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('customers cannot visit the admin dashboard', function () {
    $customer = User::factory()->create();
    $this->actingAs($customer);

    $this->get(route('dashboard'))->assertForbidden();
});

test('authenticated admins can visit the dashboard', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats.confirmedRevenue')
            ->has('stats.pendingRevenue')
            ->has('activitySeries', 7)
            ->has('categoryBreakdown')
        );
});
