<?php

namespace App\Models;

use Jenssegers\Model\Model;

class ApiMedicament extends Model
{
  static function init()
  {
    return new \GuzzleHttp\Client([
      'base_uri' => 'https://api.plandeprise.fr',
    ]);
  }

  static function find($cis)
  {
    $response = static::init()->get('/medicaments/' . $cis);
    if ($response->getStatusCode() === 200) {
      $json = $response->getBody()->getContents();
      $object = json_decode($json);
      return new ApiMedicament([
        'cis' => $cis,
        'denomination' => $object->denomination,
        'loaded' => true,
      ]);
    } else {
      return new ApiMedicament([
        'cis' => $cis,
        'loaded' => false,
      ]);
    }
  }

  public function to_medicament()
  {
    return $this;
  }

  public function getTypeAttribute()
  {
    return 2;
  }
}
