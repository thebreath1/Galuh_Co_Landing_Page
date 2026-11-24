<?php

namespace App\Http\Requests;

use App\Models\Inquiry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInquiryRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:30'],
            'estimated_quantity' => ['required', 'string', 'max:100'],
            'budget_per_package' => ['required', 'string', 'max:100'],
            'payment_method' => ['nullable', 'string', Rule::in(Inquiry::PAYMENT_METHODS)],
            'needed_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
            // Honeypot field - must remain empty if submitted by humans
            'website' => ['nullable', 'prohibited'],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'company.required' => 'Nama perusahaan atau instansi wajib diisi.',
            'email.required' => 'Email bisnis wajib diisi.',
            'email.email' => 'Format email bisnis tidak valid.',
            'whatsapp_number.required' => 'Nomor WhatsApp aktif wajib diisi.',
            'estimated_quantity.required' => 'Silakan pilih perkiraan jumlah paket.',
            'budget_per_package.required' => 'Silakan tentukan alokasi budget per paket.',
            'needed_date.required' => 'Silakan tentukan tanggal kebutuhan hampers.',
            'website.prohibited' => 'Pengiriman formulir terdeteksi sebagai spam.',
        ];
    }
}
