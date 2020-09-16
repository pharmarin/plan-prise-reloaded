<?php

namespace App\Models;

use Jenssegers\Model\Model;

class ApiMedicament extends Model
{
  public $fillable = ['id', 'denomination', 'loaded'];
  protected $appends = ['type'];

  static function init()
  {
    return new \GuzzleHttp\Client([
      'base_uri' => 'https://api.plandeprise.fr',
    ]);
  }

  static function find(int $cis)
  {
    $response = static::init()->get("/medicaments/${cis}");
    if ($response->getStatusCode() === 200) {
      $json = $response->getBody()->getContents();
      $object = json_decode($json);
      return new ApiMedicament([
        'id' => $cis,
        'denomination' => $object->denomination,
        'loaded' => true,
      ]);
    } else {
      return new ApiMedicament([
        'id' => $cis,
        'loaded' => false,
      ]);
    }
  }

  static function where($field, $query)
  {
    $response = static::init()->get("/medicaments/?${field}=${query}");
    if ($response->getStatusCode() === 200) {
      $json = $response->getBody()->getContents();
      $collection = collect(json_decode($json));
      return $collection->map(function ($o) {
        return new ApiMedicament([
          'id' => $o->cis,
          'denomination' => $o->denomination,
          'loaded' => true,
        ]);
      });
    } else {
      return collect([]);
    }
  }

  public function to_medicament()
  {
    return $this;
  }

  public function getTypeAttribute()
  {
    return 'api-medicament';
  }
}
