<?php

namespace App\Http\Requests;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_whatsapp' => ['required', 'string', 'max:12', 'regex:/^[0-9]{1,12}$/'],
            'customer_email' => ['nullable', 'string', 'email', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1', 'max:10000'],
            'delivery_date' => ['nullable', 'date'],
            'shipping_address' => ['required', 'string', 'max:2000'],
            'greeting_card_note' => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['nullable', 'string', Rule::in(Order::PAYMENT_METHODS)],
            'website' => ['nullable', 'prohibited'],
        ];
    }

    /**
     * Custom Indonesian validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'Silakan pilih paket hampers terlebih dahulu.',
            'customer_name.required' => 'Nama pemesan wajib diisi.',
            'customer_whatsapp.required' => 'Nomor WhatsApp aktif wajib diisi.',
            'customer_whatsapp.max' => 'Nomor WhatsApp maksimal 12 digit angka.',
            'customer_whatsapp.regex' => 'Nomor WhatsApp hanya boleh berisi angka (maksimal 12 digit).',
            'customer_email.email' => 'Format email tidak valid.',
            'quantity.required' => 'Jumlah pesanan wajib diisi.',
            'quantity.min' => 'Minimal pemesanan adalah 1 paket.',
            'shipping_address.required' => 'Alamat pengiriman wajib diisi.',
            'website.prohibited' => 'Pengiriman formulir terdeteksi sebagai spam.',
        ];
    }
}
