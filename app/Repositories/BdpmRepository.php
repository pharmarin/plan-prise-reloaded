<?php

namespace App\Repositories;

use App\Models\BdpmCis;
use Illuminate\Http\Request;

class BdpmRepository {

  protected $bdpm_cis;

  public function __construct (BdpmCis $bdpm_cis = null) {

    if ($bdpm_cis === null) $bdpm_cis = new BdpmCis();
    $this->bdpm_cis = $bdpm_cis;

  }

  public function all ($options = [])
  {

    $paginate = isset($options['paginate']) ? $options['paginate'] : 20;
    $order_by = isset($options['order_by']) ? $options['order_by'] : 'denomination';
    $all = $this->bdpm_cis->where('statut_administratif', 'Autorisation active');
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

    return $this->bdpm_cis::find($code_cis)->load('compo');

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
