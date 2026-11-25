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
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description', 500)->nullable();
            $table->unsignedTinyInteger('discount_percent');
            $table->string('scope', 20)->default('all'); // all | category | product
            $table->string('target_category', 60)->nullable();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedInteger('original_unit_price')->nullable()->after('unit_price');
            $table->string('promo_name')->nullable()->after('total_price');
            $table->unsignedTinyInteger('discount_percent')->default(0)->after('promo_name');
            $table->unsignedBigInteger('discount_amount')->default(0)->after('discount_percent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'original_unit_price',
                'promo_name',
                'discount_percent',
                'discount_amount',
            ]);
        });

        Schema::dropIfExists('promos');
    }
};
