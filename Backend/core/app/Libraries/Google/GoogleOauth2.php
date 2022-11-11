<?php

namespace App\Libraries\Google;

use Google\Service\Oauth2 as Google_Service_Oauth2;

class GoogleOauth2
{
    public function __construct()
    {
    }

    public function getAccountInfo()
    {
        $googleService = \App\Libraries\Google\Config\Services::google();
        [$accessToken, $refreshToken] = $googleService->getUserAccessToken();
        if (empty($accessToken)) {
            return [];
        }
        $googleClient = $googleService->client();
        $googleClient->setAccessToken($accessToken);

        $service = new Google_Service_Oauth2($googleClient);

        return $service->userinfo->get();
    }
}