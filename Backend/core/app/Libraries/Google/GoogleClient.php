<?php

namespace App\Libraries\Google;

use App\Libraries\Google\GoogleCalendar;
use App\Libraries\Google\GoogleDrive;
use App\Libraries\Google\GoogleOauth2;

class GoogleClient
{
    private $client = '';
    private $googleCalendar = '';
    private $googleDrive = '';
    private $googleOauth2 = '';

    public function __construct()
    {
        $this->client = new \Google\Client();
    }

    public function client()
    {
        $jsonPath = FCPATH . '..' . DIRECTORY_SEPARATOR . 'google_client_secret.json';
        $this->client->setAuthConfig($jsonPath);
        $clientKey = empty($key) ? preference('google_developer_key') : $key;
        $this->client->setDeveloperKey($clientKey);
        $this->client->setAccessType('offline');

        return $this->client;
    }

    public function handleInsertToken($modules, $token)
    {
        $checkSync = $this->getInfoUserSyncedGoogle();
        if ($checkSync['synced']) {
            return true;
        }
        $modules->setModule('users');
        $model = $modules->model;
        try {
            $googleLinked = [
                'access_token' => isset($token['access_token']) ? $token['access_token'] : '',
                'refresh_token' => isset($token['refresh_token']) ? $token['refresh_token'] : '',
                'expires_in' => isset($token['expires_in']) ? $token['expires_in'] : '',
                'created' => isset($token['created']) ? $token['created'] : '',
                'id_token' => isset($token['id_token']) ? $token['id_token'] : '',
                'sync_calendar_status' => 1,
                'sync_drive_status' => 1
            ];

            $arrUpdateData = [
                'id' => user_id(),
                'google_linked' => json_encode($googleLinked)
            ];
            $model->setAllowedFields(array_keys($arrUpdateData));
            $model->save($arrUpdateData);
        } catch (\Exception $e) {
            return $e->getMessage();
        }

        return true;
    }

    public function getInfoUserSyncedGoogle()
    {
        $currentUser = user();
        $googleLinked = json_decode($currentUser->google_linked, true);
        $result = [
            'id' => $currentUser->id,
            'synced' => false,
            'sync_calendar_status' => false,
            'sync_drive_status' => false
        ];
        if (
            isset($googleLinked['access_token'])
            && !empty($googleLinked['access_token'])
            && isset($googleLinked['refresh_token'])
            && !empty($googleLinked['refresh_token'])
        ) {
            $result['synced'] = true;
            $result['sync_calendar_status'] = $googleLinked['sync_calendar_status'] == 1;
            $result['sync_drive_status'] = $googleLinked['sync_drive_status'] == 1;
        }

        return $result;
    }

    public function getUserAccessToken()
    {
        $googleService = \App\Libraries\Google\Config\Services::google();
        $googleClient = $googleService->client();

        $currentUser = user();
        if (!empty($currentUser->google_linked)) {
            $googleLinked = json_decode($currentUser->google_linked, true);
            if (
                isset($googleLinked['access_token'])
                && !empty($googleLinked['access_token'])
                && isset($googleLinked['refresh_token'])
                && !empty($googleLinked['refresh_token'])
            ) {
                $googleClient->setAccessToken($googleLinked);
                if ($googleClient->isAccessTokenExpired()) {
                    $modules = \Config\Services::modules();
                    $resultRefreshToken = $googleClient->refreshToken($googleLinked['refresh_token']);
                    $googleService->handleInsertToken($modules, $resultRefreshToken);

                    return [
                        isset($resultRefreshToken['access_token']) ? $resultRefreshToken['access_token'] : '',
                        isset($resultRefreshToken['refresh_token']) ? $resultRefreshToken['refresh_token'] : ''
                    ];
                }
                return [
                    $googleLinked['access_token'],
                    $googleLinked['refresh_token']
                ];
            }
        }

        return ['', ''];
    }

    public function calendar()
    {
        $this->googleCalendar = new GoogleCalendar();

        return $this->googleCalendar;
    }

    public function drive()
    {
        $this->googleDrive = new GoogleDrive();

        return $this->googleDrive;
    }

    public function oauth2()
    {
        $this->googleOauth2 = new GoogleOauth2();

        return $this->googleOauth2;
    }
}
