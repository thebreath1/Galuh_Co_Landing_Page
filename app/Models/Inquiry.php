<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company',
        'email',
        'whatsapp_number',
        'estimated_quantity',
        'budget_per_package',
        'needed_date',
        'notes',
    ];

    protected $casts = [
        'needed_date' => 'date',
    ];
}
