<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'short_description',
        'contents',
        'price_from',
        'image',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'contents' => 'array',
        'price_from' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];
}
