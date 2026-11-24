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
            $table->string('payment_method', 50)->default('transfer_bca')->after('greeting_card_note');
        });

        Schema::table('inquiries', function (Blueprint $table) {
            $table->string('payment_method', 50)->default('invoice_termin')->after('budget_per_package');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('payment_method');
        });

        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropColumn('payment_method');
        });
    }
};
