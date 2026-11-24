<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    public const PAYMENT_METHODS = [
        'invoice_termin',
        'transfer_perusahaan',
        'po_net14',
        'qris',
    ];

    protected $fillable = [
        'name',
        'company',
        'email',
        'whatsapp_number',
        'estimated_quantity',
        'budget_per_package',
        'payment_method',
        'needed_date',
        'notes',
    ];

    protected $casts = [
        'needed_date' => 'date',
    ];
}
