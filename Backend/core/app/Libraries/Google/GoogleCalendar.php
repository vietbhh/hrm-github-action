<?php

namespace App\Libraries\Google;

use Google\Service\Calendar as Google_Service_Calendar;
use Google\Service\Calendar\Event as Google_Service_Calendar_Event;

class GoogleCalendar
{
    public function __construct()
    {
    }

    public function handleAddEvent($arrData, $services = false)
    {
        if (!$services) {
			$googleService = \App\Libraries\Google\Config\Services::google();

			[$accessToken, $refreshToken] = $googleService->getUserAccessToken();
			if (empty($accessToken)) {
				return '';
			}

			$googleClient = $googleService->client();
			$googleClient->setAccessToken($accessToken);
			$services = new Google_Service_Calendar($googleClient);
		}
        

        $calendarId = 'primary';

		$timeZone = $services->calendars->get($calendarId)->getTimeZone();

		$event = new Google_Service_Calendar_Event([
			'summary' => $arrData['title'],
			'description' => $arrData['note'],
			'start' => [
				'dateTime' => $this->_formatDateForCreateEvent($arrData['date_from'] . ' ' . $arrData['time_from'], $timeZone),
				'timeZone' => $timeZone
			],
			'end' => [
				'dateTime' => $this->_formatDateForCreateEvent($arrData['date_to'] . ' ' . $arrData['time_to'], $timeZone),
				'timeZone' => $timeZone
			],
			'colorId' => 5 // yellow
		]);

		return  $services->events->insert($calendarId, $event);
    }

    public function handleDeleteEventGoogleCalendar($eventId)
	{
		$googleService = \App\Libraries\Google\Config\Services::google();
		[$accessToken, $refreshToken] = $googleService->getUserAccessToken();
		if (empty($accessToken)) {
			return '';
		}

		$calendarId = 'primary';

		$googleClient = $googleService->client();
		$googleClient->setAccessToken($accessToken);
		$services = new Google_Service_Calendar($googleClient);

		return $services->events->delete($calendarId, $eventId);
	}

    public function handleUpdateEventColorIdGoogleCalendar($eventId, $colorId)
	{
		$googleService = \App\Libraries\Google\Config\Services::google();

		[$accessToken, $refreshToken] = $googleService->getUserAccessToken();
		if (empty($accessToken)) {
			return '';
		}

		$calendarId = 'primary';

		$googleClient = $googleService->client();
		$googleClient->setAccessToken($accessToken);
		$services = new Google_Service_Calendar($googleClient);

		$event = $services->events->get($calendarId, $eventId);
		$event->setColorId($colorId);

		return $services->events->update($calendarId, $event->getId(), $event);
	}

    // ** support function
    private function _formatDateForCreateEvent($date, $timeZone)
	{
		return date('c', strtotime($date));
	}
}
