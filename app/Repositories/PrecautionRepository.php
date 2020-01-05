<?php

namespace App\Repositories;

use App\Models\BdpmCisCompo;
use App\Models\Medicament;
use App\Models\Precaution;
use App\Repositories\CompositionRepository;

class PrecautionRepository
{
  public function __construct ($init = null)
  {
    if ($init instanceof CompositionRepository) {
      return $this->fromComposition($init);
    } elseif ($init === null) {
      return;
    } else {
      throw new \Exception('Wrong variable type ');
    }
  }

  public function fromMedicament (Medicament $medicament)
  {
    $precautions_collection = Precaution::whereHas('medicaments', function ($query) use ($medicament) {
      $query->where('cible_id', $medicament->id);
    })->get();
    $precautions_composition = $this->fromComposition($medicament->composition);
    return $precautions_collection->merge($precautions_composition);
  }

  public function fromComposition (CompositionRepository $composition)
  {
    $pivot_table = (new Precaution)->compositions()->getTable();
    $precautions_table = (new Precaution)->getTable();
    foreach ($composition->composition_parsed as $composition) {
      $precautions_results = Precaution::join($pivot_table, $precautions_table.'.id', '=', $pivot_table.'.precaution_id')
        ->select($precautions_table.'.*')
        ->where($pivot_table.'.cible_type', BdpmCisCompo::class)
        ->whereIn($pivot_table.'.cible_id', $composition['code_substance'])
        ->get();
      // Merge results to return array
      $precautions_collection = isset($precautions_collection) ? $precautions_collection->merge($precautions_results) : $precautions_results;
    }
    return $precautions_collection;
  }
}
