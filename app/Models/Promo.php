<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;

class Promo extends Model
{
    use HasFactory;

    public const SCOPE_ALL = 'all';

    public const SCOPE_CATEGORY = 'category';

    public const SCOPE_PRODUCT = 'product';

    public const SCOPES = [
        self::SCOPE_ALL,
        self::SCOPE_CATEGORY,
        self::SCOPE_PRODUCT,
    ];

    protected $fillable = [
        'name',
        'description',
        'discount_percent',
        'scope',
        'target_category',
        'product_id',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected $casts = [
        'discount_percent' => 'integer',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Scope promos that are enabled and active at the given timestamp.
     */
    public function scopeCurrentlyActive(Builder $query, ?CarbonInterface $at = null): Builder
    {
        $timestamp = $at ?? now();

        return $query
            ->where('is_active', true)
            ->where('starts_at', '<=', $timestamp)
            ->where('ends_at', '>=', $timestamp);
    }

    /**
     * Check whether this promo applies to the given product.
     */
    public function appliesToProduct(Product $product): bool
    {
        return match ($this->scope) {
            self::SCOPE_ALL => true,
            self::SCOPE_CATEGORY => is_string($this->target_category)
                && strcasecmp(trim($this->target_category), trim((string) $product->category)) === 0,
            self::SCOPE_PRODUCT => (int) $this->product_id === (int) $product->id,
            default => false,
        };
    }

    /**
     * Resolve the single best active discount payload for a product from a collection of active promos.
     *
     * @param  Collection<int, Promo>  $activePromos
     * @return array{promo_id:int, promo_name:string, description:?string, discount_percent:int, original_price:int, discounted_price:int, ends_at:string}|null
     */
    public static function resolveBestForProduct(Product $product, Collection $activePromos): ?array
    {
        /** @var Promo|null $best */
        $best = $activePromos
            ->filter(fn (Promo $promo) => $promo->appliesToProduct($product))
            ->sortByDesc(fn (Promo $promo) => ($promo->discount_percent * 1_000_000) + $promo->id)
            ->first();

        if (! $best || $best->discount_percent <= 0) {
            return null;
        }

        $originalPrice = (int) $product->price_from;
        $percent = min(90, max(1, (int) $best->discount_percent));
        $discountedPrice = (int) max(0, round($originalPrice * (100 - $percent) / 100));

        return [
            'promo_id' => $best->id,
            'promo_name' => $best->name,
            'description' => $best->description,
            'discount_percent' => $percent,
            'original_price' => $originalPrice,
            'discounted_price' => $discountedPrice,
            'ends_at' => $best->ends_at->toIso8601String(),
        ];
    }
}
