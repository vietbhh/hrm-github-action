<?php
namespace App\Libraries\Notifications\FirebaseCM;

use GuzzleHttp;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\ResponseInterface;

/**
 *
 * @author sngrl
 *
 */
interface ClientInterface
{

    /**
     * add your server api key here
     * read how to obtain an api key here: https://firebase.google.com/docs/server/setup#prerequisites
     *
     * @param string $apiKey
     *
     * @return Client
     */
    function setApiKey($apiKey);
    

    /**
     * people can overwrite the api url with a proxy server url of their own
     *
     * @param string $url
     *
     * @return Client
     */
    function setProxyApiUrl($url);

    /**
     * sends your notification to the google servers and returns a guzzle repsonse object
     * containing their answer.
     *
     * @param Message $message
     *
     * @return ResponseInterface
     * @throws RequestException
     */
    function send(Message $message);
    
}
   