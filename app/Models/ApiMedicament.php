<?php

namespace App\Models;

class ApiMedicament
{
  private $cis;
  private $denomination;

  public function __construct ($object) {
    $this->cis = (int) $object->cis;
    $this->denomination = $object->denomination;
  }

  public function to_medicament () {
    return (object) [
        'id' => $this->cis,
        'denomination' => $this->denomination,
        'type' => 2
      ];
  }
}