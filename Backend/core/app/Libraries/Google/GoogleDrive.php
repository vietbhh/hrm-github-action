<?php

namespace App\Libraries\Google;

use Google\Service\Drive as Google_Service_Drive;

class GoogleDrive
{
    public function __construct()
    {
    }

    public function handleGetFileContent($data)
    {
        $googleService = \App\Libraries\Google\Config\Services::google();
        [$accessToken, $refreshToken] = $googleService->getUserAccessToken();
        if (empty($accessToken)) {
            return '';
        }
        $googleClient = $googleService->client();
        $googleClient->setAccessToken($accessToken);

        $services = new Google_Service_Drive($googleClient);

        $arrExtension = [
            'application/vnd.google-apps.document' => [
                'extension' => 'docx',
                'mimeType' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ],
            'application/vnd.google-apps.spreadsheet' => [
                'extension' => 'xlsx',
                'mimeType' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ],
            'application/vnd.google-apps.presentation' => [
                'extension' => 'pptx',
                'mimeType' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ]
        ];

        $results = [];
        $errors = [];
        foreach ($data as $row) {
            $isSuccess = false;

            if ($row['type'] == 'photo' || $row['type'] == 'file') {
                $contentFile = $services->files->get($row['id'], array("alt" => "media"));
                $filename = $row['name'];
                $isSuccess = true;
            } elseif ($row['type'] == 'document') {
                if (isset($arrExtension[$row['mimeType']]['mimeType'])) {
                    $contentFile = $services->files->export(
                        $row['id'],
                        $arrExtension[$row['mimeType']]['mimeType'],
                        array("alt" => "media")
                    );
                    $filename = $row['name'] . '.' . $arrExtension[$row['mimeType']]['extension'];
                    $isSuccess = true;
                } else {
                    $filename = $row['name'];
                    $isSuccess = false;
                }
            }

            if ($isSuccess) {
                $results[] = [
                    'id' => $row['id'],
                    'filename' => $filename,
                    'content' => $contentFile->getBody()->getContents()
                ];
            } else {
                $errors[] = [
                    'id' => $row['id'],
                    'filename' => $filename,
                ];
            }
        }

        return [
            'result' => $results,
            'error' => $errors
        ];
    }
}
