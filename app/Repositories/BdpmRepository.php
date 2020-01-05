<?php

namespace App\Repositories;

use App\Models\BdpmCis;
use Illuminate\Http\Request;

class BdpmRepository {

  protected $bdpmCis;

  public function __construct (BdpmCis $bdpmCis) {

    $this->bdpmCis = $bdpmCis;

  }

  public function all ($options = [])
  {

    $paginate = isset($options['paginate']) ? $options['paginate'] : 20;
    $order_by = isset($options['order_by']) ? $options['order_by'] : 'denomination';
    $all = $this->bdpmCis->where('statut_administratif', 'Autorisation active');
    if (isset($options['display'])) {
      $all = $all->select(explode(',', $options['display']));
    }
    if (isset($options['query'])) {
      foreach (explode('*', $options['query']) as $query) {
        $all->where('denomination', 'LIKE', '%' . $query . '%');
      }
    }
    $all = $all->orderBy($order_by)->paginate($paginate);
    if (isset($options['load'])) {
      foreach (explode(',', $options['load']) as $relation) {
        $all->load($relation);
      }
    }
    return $all;

  }

  public function show (int $code_cis)
  {

    return $this->bdpmCis::find($code_cis)->load('compo');

  }

  public function loadRelations (array $relations = [], &$eloquent)
  {

    foreach ($relations as $relation) {
      $eloquent->load($relation);
    }

  }

  /**
   * Get BDPM by CIS
   * @method getBdpmByCIS
   * @param  integer $codeCIS codeCIS
   * @return BdpmCis
   */
  public function getFromCIS ($codeCIS) {

    return BdpmCis::where('code_cis', $codeCIS)->first();

  }

}
