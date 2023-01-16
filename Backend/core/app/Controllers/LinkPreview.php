<?php

namespace App\Controllers;

use Goutte\Client;
use Exception;
use stdClass;

class LinkPreview extends ErpController
{

    public function get_link_content_get()
    {
        $postData = $this->request->getGet();
        $content  = isset($postData['link']) ? $postData['link'] : '';
        $code =  base64_encode(preg_replace('/[^A-Za-z0-9\-]/', '', $content));
        $urls = preg_match_all('#\bhttps?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/))#', $content, $match);
        $results = [];

        if ($urls <= 0) {
            return $this->respond([
                'result' => new stdClass
            ]);
        }

        $url = $match[0][0];

        $client = new Client();

        if ($dataCache = cache($code)) {
            return $this->respond([
                'result' => $dataCache
            ]);
        }

        try {
            $crawler = $client->request('GET', $url);

            $statusCode = $client->getResponse()->getStatusCode();
            if ($statusCode == 200) {
                $title = $crawler->filter('title')->text();

                if ($crawler->filterXpath('//meta[@name="description"]')->count()) {
                    $description = $crawler->filterXpath('//meta[@name="description"]')->attr('content');
                }

                if ($crawler->filterXpath('//meta[@name="og:image"]')->count()) {
                    $image = $crawler->filterXpath('//meta[@name="og:image"]')->attr('content');
                } elseif ($crawler->filterXpath('//meta[@name="twitter:image"]')->count()) {
                    $image = $crawler->filterXpath('//meta[@name="twitter:image"]')->attr('content');
                } else {
                    if ($crawler->filter('img')->count()) {
                        $image = $crawler->filter('img')->attr('src');
                    } else {
                        $image = 'no_image';
                    }
                }

                $results['title'] = $title;
                $results['cover'] = '';
                $results['url'] = $url;
                $results['host'] = parse_url($url)['host'];
                $results['description'] = isset($description) ? $description : '';
                $results['images'] = $image;

                return $this->respond([
                    'result' => $results
                ]);
            } else {
                return $this->respond([
                    'result' => new stdClass()
                ]);
            }
        } catch (Exception $e) {
            return $this->fail($e->getMessage());
        }
    }
}
