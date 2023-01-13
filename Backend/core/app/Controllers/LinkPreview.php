<?php

namespace App\Controllers;

use Dusterio\LinkPreview\Client;
use stdClass;

class LinkPreview extends ErpController
{

    public function get_link_content_post()
    {
        $postData = $this->request->getPost();
        $link = isset($postData['link']) ? $postData['link'] : '';
        $code =  base64_encode($link);

        if (strlen(trim($link)) == 0) {
            return $this->respond([
                'result' => new stdClass
            ]);
        }

        if ($dataCache = cache($code)) {
            return $this->respond([
                'result' => $dataCache
            ]);
        }

        $previewClient = new Client($link);

        // Get previews from all available parsers
        $previews = $previewClient->getPreviews();

        // Get a preview from specific parser
        $preview = $previewClient->getPreview('general');

        $result = $preview->toArray();
        $result['description'] = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s';
        cache()->save($code, $result, getenv('default_cache_time'));

        return $this->respond([
            'result' => $result
        ]);
    }
}
