<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('fulfillment_stage', 30)->default('curating')->after('status');
            $table->string('courier_name', 100)->nullable()->after('fulfillment_stage');
            $table->string('tracking_number', 100)->nullable()->after('courier_name');
            $table->string('recipient_name', 150)->nullable()->after('tracking_number');
            $table->text('shipping_notes')->nullable()->after('recipient_name');
            $table->json('tracking_history')->nullable()->after('shipping_notes');
            $table->timestamp('shipped_at')->nullable()->after('reviewed_at');
            $table->timestamp('delivered_at')->nullable()->after('shipped_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'fulfillment_stage',
                'courier_name',
                'tracking_number',
                'recipient_name',
                'shipping_notes',
                'tracking_history',
                'shipped_at',
                'delivered_at',
            ]);
        });
    }
};
