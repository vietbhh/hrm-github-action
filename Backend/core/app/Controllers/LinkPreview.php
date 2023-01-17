<?php

namespace App\Controllers;

use DOMDocument;
use Goutte\Client;
use Exception;
use stdClass;

class LinkPreview extends ErpController
{

    public function get_link_content_get()
    {
        header('Content-Type: text/html; charset=utf-8');

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
        $host = parse_url($url)['host'];
        $sourceUrl = (!$this->_checkValidUrl($host)) ? parse_url($url)['scheme'] . '://' . $host : $host;

        $client = new Client();

        if ($dataCache = cache($code)) {
            return $this->respond([
                'result' => json_decode($dataCache, true)
            ]);
        }

        try {
            $client->setServerParameters([
                'HTTP_USER_AGENT' => $_SERVER["HTTP_USER_AGENT"]
            ]);
            $crawler = $client->request('GET', $url);
            $statusCode = $client->getResponse()->getStatusCode();
            if ($statusCode == 200) {
                if ($this->_isImageUrl($url)) {
                    $urlExtension = strtolower(strrchr($url, '.'));
                    $imageData = base64_encode(file_get_contents($url));
                    $results['title'] = $url;
                    $results['cover'] = '';
                    $results['url'] = $url;
                    $results['host'] = $host;
                    $results['description'] = '';
                    $results['images'] = ["data:image/" . $urlExtension . ";base64," . $imageData];

                    cache()->save($code, json_encode($results), 150);

                    return $this->respond([
                        'result' => $results
                    ]);
                }

                $title = $crawler->filter('title')->text();
                iconv(mb_detect_encoding($title, mb_detect_order(), true), "UTF-8", $title);

                if ($crawler->filterXpath('//meta[@name="description"]')->count()) {
                    $description = $crawler->filterXpath('//meta[@name="description"]')->attr('content');
                }

                $image = [];
                if ($crawler->filterXpath('//meta[@name="og:image"]')->count()) {
                    $image[] = $crawler->filterXpath('//meta[@name="og:image"]')->attr('content');
                } elseif ($crawler->filterXpath('//meta[@name="twitter:image"]')->count()) {
                    $image[] = $crawler->filterXpath('//meta[@name="twitter:image"]')->attr('content');
                } else {
                    if ($crawler->filter('img')->count()) {
                        $imageTemp = $crawler->filter('img')->each(function ($item) {
                            return $item->attr('src');
                        });
                        $imageTemp = array_filter($imageTemp, function ($value) {
                            return !is_null($value) && $value !== '';
                        });

                        $image = array_values($imageTemp);
                        foreach ($image as $key => $row) {
                            if (!$this->_checkValidUrl($image[$key])) {
                                $image[$key] = $sourceUrl . $image[$key];
                            }
                        }
                    } else {
                        $image = [];
                    }
                }

                if (count($image) == 0) {
                    $doc = new DOMDocument();
                    $doc->strictErrorChecking = FALSE;
                    libxml_use_internal_errors(true);
                    $doc->loadHTML(file_get_contents($url));
                    libxml_clear_errors();
                    $xml = simplexml_import_dom($doc);
                    $arr = $xml->xpath('//link[@rel="shortcut icon"]');
                    $image = isset($arr[0]['href']) ? array_values(json_decode(json_encode($arr[0]['href']), true)) : [];
                }

                $results['title'] = $title;
                $results['cover'] = '';
                $results['url'] = $url;
                $results['host'] = $host;
                $results['description'] = !empty($description) ? $description : $url;
                $results['images'] = $image;

                cache()->save($code, json_encode($results), 150);

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

    // ** support function
    private function _checkValidUrl($url)
    {
        if (strpos($url, 'https') === false || strpos($url, 'https') === '') {
            return false;
        }

        return true;
    }

    private function _isImageUrl($url)
    {
        $imageExtensions = array(
            '.jpg',
            '.jpeg',
            '.gif',
            '.png',
            '.flv'
        );
        $urlExtension = strtolower(strrchr($url, '.'));

        if (in_array($urlExtension, $imageExtensions)) {
            return true;
        }

        return false;
    }
}
