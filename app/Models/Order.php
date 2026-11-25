<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_COMPLETED = 'completed';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
        self::STATUS_COMPLETED,
    ];

    public const STAGE_CURATING = 'curating';
    public const STAGE_PACKED = 'packed';
    public const STAGE_SHIPPED = 'shipped';
    public const STAGE_DELIVERED = 'delivered';

    public const FULFILLMENT_STAGES = [
        self::STAGE_CURATING,
        self::STAGE_PACKED,
        self::STAGE_SHIPPED,
        self::STAGE_DELIVERED,
    ];

    public const PAYMENT_METHODS = [
        'transfer_bca',
        'transfer_mandiri',
        'qris',
        'ewallet',
        'cod',
    ];

    protected $fillable = [
        'order_code',
        'product_id',
        'product_name',
        'unit_price',
        'original_unit_price',
        'quantity',
        'total_price',
        'promo_name',
        'discount_percent',
        'discount_amount',
        'customer_name',
        'customer_whatsapp',
        'customer_email',
        'delivery_date',
        'shipping_address',
        'greeting_card_note',
        'payment_method',
        'status',
        'fulfillment_stage',
        'courier_name',
        'tracking_number',
        'recipient_name',
        'shipping_notes',
        'tracking_history',
        'admin_note',
        'reviewed_by',
        'reviewed_at',
        'shipped_at',
        'delivered_at',
    ];

    protected $casts = [
        'unit_price' => 'integer',
        'original_unit_price' => 'integer',
        'quantity' => 'integer',
        'total_price' => 'integer',
        'discount_percent' => 'integer',
        'discount_amount' => 'integer',
        'tracking_history' => 'array',
        'delivery_date' => 'date:Y-m-d',
        'reviewed_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
