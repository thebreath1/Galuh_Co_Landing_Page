<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaStorage
{
    /**
     * Store an uploaded image on the public disk and remove the previous local upload if present.
     */
    public static function replacePublicImage(UploadedFile $file, string $directory, ?string $previousUrl = null): string
    {
        $path = $file->store($directory, 'public');

        if ($previousUrl !== null) {
            static::deleteIfLocalUpload($previousUrl);
        }

        return '/storage/' . ltrim($path, '/');
    }

    /**
     * Delete a previously uploaded file if it points to local /storage/.
     */
    public static function deleteIfLocalUpload(?string $url): void
    {
        if (! is_string($url) || ! Str::startsWith($url, '/storage/')) {
            return;
        }

        $relativePath = Str::after($url, '/storage/');
        if ($relativePath !== '' && Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }
}
