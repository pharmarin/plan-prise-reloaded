<?php

namespace App\Models;

use CloudCreativity\LaravelJsonApi\Exceptions\JsonApiException;
use CloudCreativity\LaravelJsonApi\Document\Error\Error;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

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

  static function getCacheID(int $cis)
  {
    return 'cis_' . $cis;
  }

  static function find(int $cis)
  {
    return new ApiMedicament(Cache::remember(static::getCacheID($cis), 6000, function () use ($cis) {
      $response = static::init()->get("/medicaments/${cis}");

      if ($response->getStatusCode() === 200) {
        $json = $response->getBody()->getContents();
        $object = json_decode($json);
        return [
          'id' => $cis,
          'denomination' => $object->denomination,
          'loaded' => true,
        ];
      } else {
        throw new JsonApiException(Error::fromArray([
          'title' => 'Impossible d\'accéder au serveur',
          'status' => '500',
        ]));
      }
    }));
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
    }
    throw new JsonApiException(Error::fromArray([
      'title' => 'Impossible d\'accéder au serveur',
      'status' => '500',
    ]));
  }

  public function to_medicament()
  {
    return $this;
  }

  public function getTypeAttribute()
  {
    return 'api-medicaments';
  }
}
