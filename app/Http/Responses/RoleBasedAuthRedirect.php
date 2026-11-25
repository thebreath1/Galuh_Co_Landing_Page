<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\RegisterResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse;
use Laravel\Fortify\Contracts\VerifyEmailResponse;
use Symfony\Component\HttpFoundation\Response;

class RoleBasedAuthRedirect implements LoginResponse, RegisterResponse, TwoFactorLoginResponse, VerifyEmailResponse
{
    public function __construct(
        private readonly bool $verified = false,
    ) {}

    /**
     * Redirect users after authentication/verification based on their role.
     */
    public function toResponse($request): Response
    {
        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
        }

        $isAdmin = $request->user()?->isAdmin() ?? false;
        $fallback = $isAdmin
            ? route('dashboard', absolute: false)
            : route('home', absolute: false);

        if ($this->verified) {
            return redirect()->intended($fallback.'?verified=1');
        }

        if (! $isAdmin) {
            $intended = (string) $request->session()->get('url.intended', '');
            $intendedPath = parse_url($intended, PHP_URL_PATH) ?: '';

            if (Str::startsWith($intendedPath, ['/dashboard', '/admin'])) {
                $request->session()->forget('url.intended');

                return redirect($fallback);
            }
        }

        return redirect()->intended($fallback);
    }
}
