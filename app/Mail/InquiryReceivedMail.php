<?php

namespace App\Mail;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InquiryReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Inquiry $inquiry
    ) {}

    /**
     * Get the message envelope.
     */
    public function Envelope(): Envelope
    {
        return new Envelope(
            subject: 'Permintaan Penawaran Baru: ' . $this->inquiry->company . ' (' . $this->inquiry->name . ')',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.inquiry_received',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
