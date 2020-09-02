<?php

namespace App\Models;

use Jenssegers\Model\Model;

class ApiMedicament extends Model
{

  static function find($cis)
  {
    return new ApiMedicament([
      'cis' => $cis,
      'denomination' => 'test'
    ]);
  }

  public function to_medicament () {
    return $this;
  }

  public function getTypeAttribute() {
    return 2;
  }
}