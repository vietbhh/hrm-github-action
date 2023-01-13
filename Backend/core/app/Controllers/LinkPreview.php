<?php

namespace App\Controllers;

use Dusterio\LinkPreview\Client;
use stdClass;

class LinkPreview extends ErpController
{

    public function get_link_content_get()
    {
        $postData = $this->request->getGet();
        $link = isset($postData['link']) ? $postData['link'] : '';
        $code =  base64_encode(preg_replace('/[^A-Za-z0-9\-]/', '',$link));

        if (strlen(trim($link)) == 0) {
            return $this->respond([
                'result' => new stdClass
            ]);
        }

        if ($dataCache = cache($code)) {
            /*return $this->respond([
                'result' => $dataCache
            ]);*/
        }

        $previewClient = new Client($link);

        // Get a preview from specific parser
        $preview = $previewClient->getPreview('general');

        $result = $preview->toArray();
        cache()->save($code, $result, getenv('default_cache_time'));

        return $this->respond([
            'result' => $result
        ]);
    }
}
