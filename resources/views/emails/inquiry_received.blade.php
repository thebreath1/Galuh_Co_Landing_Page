<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inquiry Corporate Baru - GALUH & CO.</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f4ee; color: #2c2724; padding: 24px; line-height: 1.6; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e8e2d5; overflow: hidden; }
        .header { background-color: #1b382b; color: #ffffff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.05em; }
        .body { padding: 24px; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0ece3; }
        .label { font-weight: 600; color: #6e675f; font-size: 14px; }
        .value { color: #1b382b; font-weight: 500; font-size: 14px; text-align: right; }
        .notes-box { background: #faf8f5; border-left: 3px solid #c8a951; padding: 12px 16px; margin-top: 16px; border-radius: 4px; font-size: 14px; }
        .footer { text-align: center; font-size: 12px; color: #9c9489; padding: 16px; background: #fdfbf7; border-top: 1px solid #f0ece3; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>GALUH & CO.</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: #dfca86;">Notifikasi Permintaan Penawaran Corporate Gifting</p>
        </div>
        <div class="body">
            <p>Halo Admin, terdapat permintaan penawaran baru dari klien korporat dengan rincian sebagai berikut:</p>
            
            <div class="row">
                <span class="label">Nama Kontak:</span>
                <span class="value">{{ $inquiry->name }}</span>
            </div>
            <div class="row">
                <span class="label">Perusahaan / Instansi:</span>
                <span class="value">{{ $inquiry->company }}</span>
            </div>
            <div class="row">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:{{ $inquiry->email }}">{{ $inquiry->email }}</a></span>
            </div>
            <div class="row">
                <span class="label">WhatsApp:</span>
                <span class="value"><a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $inquiry->whatsapp_number) }}">{{ $inquiry->whatsapp_number }}</a></span>
            </div>
            <div class="row">
                <span class="label">Perkiraan Jumlah Paket:</span>
                <span class="value">{{ $inquiry->estimated_quantity }}</span>
            </div>
            <div class="row">
                <span class="label">Budget per Paket:</span>
                <span class="value">{{ $inquiry->budget_per_package }}</span>
            </div>
            <div class="row">
                <span class="label">Metode Pembayaran:</span>
                <span class="value">{{ $inquiry->payment_method ?? 'invoice_termin' }}</span>
            </div>
            <div class="row">
                <span class="label">Tanggal Kebutuhan:</span>
                <span class="value">{{ $inquiry->needed_date ? $inquiry->needed_date->format('d F Y') : '-' }}</span>
            </div>

            @if($inquiry->notes)
            <div style="margin-top: 16px;">
                <span class="label">Catatan / Kebutuhan Khusus:</span>
                <div class="notes-box">
                    {{ $inquiry->notes }}
                </div>
            </div>
            @endif
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} GALUH & CO. Hampers & Corporate Gifting. All rights reserved.
        </div>
    </div>
</body>
</html>
