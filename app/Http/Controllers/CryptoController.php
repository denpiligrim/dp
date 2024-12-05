<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class CryptoController extends Controller
{
  function apiError($msg)
  {
    $result = array(
      "status" => false,
      "message" => $msg
    );
    return json_encode($result);
  }

  public function cryptocurrencyList()
  {
    $response = Http::withHeaders([
      'X-CMC_PRO_API_KEY' => env('CMC_API_KEY', '')
    ])->get(env('CMC_BASE_URL', '') . '/v1/cryptocurrency/listings/latest');
    if ($response->ok()) {

      $response = $response->json();
      $result = array(
        "status" => true,
        "result" => $response
      );
      return json_encode($result);
    } else {
      return $this->apiError('Неизвестная ошибка!');
    }
  }
  public function globalMetrics()
  {
    $response = Http::withHeaders([
      'X-CMC_PRO_API_KEY' => env('CMC_API_KEY', '')
    ])->get(env('CMC_BASE_URL', '') . '/v1/global-metrics/quotes/latest');
    if ($response->ok()) {

      $response = $response->json();
      $result = array(
        "status" => true,
        "result" => $response
      );
      return json_encode($result);
    } else {
      return $this->apiError('Неизвестная ошибка!');
    }
  }
  public function fearGreedIndex()
  {
    $response = Http::withHeaders([
      'X-CMC_PRO_API_KEY' => env('CMC_API_KEY', '')
    ])->get(env('CMC_BASE_URL', '') . '/v3/fear-and-greed/latest');
    if ($response->ok()) {

      $response = $response->json();
      $result = array(
        "status" => true,
        "result" => $response
      );
      return json_encode($result);
    } else {
      return $this->apiError('Неизвестная ошибка!');
    }
  }
}
