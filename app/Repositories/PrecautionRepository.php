<?php

namespace App\Repositories;

use App\Models\Composition;
use App\Models\Medicament;
use App\Models\Precaution;

class PrecautionRepository
{
  public function __construct($init = null)
  {
    if ($init instanceof CompositionRepository) {
      return $this->fromComposition($init);
    } elseif ($init === null) {
      return;
    } else {
      throw new \Exception('Wrong variable type ');
    }
  }

  public function fromMedicament(Medicament $medicament)
  {
    $precautions_collection = Precaution::whereHasMorph(
      'cible',
      [Medicament::class],
      function ($query) use ($medicament) {
        $query->where('cible_id', $medicament->id);
      }
    )->get();
    // Préparation de l'array contenant les voies d'adminitration du médicament
    $voies_administration = collect(
      json_decode($medicament->voies_administration)
    )
      ->map(function ($item) {
        return (int) $item->voies_administration;
      })
      ->push(0);
    // Retrouver les précautions associées aux compositions
    $precautions_composition = $this->fromComposition(
      $medicament->compositions,
      $voies_administration
    );
    // Merger le tout
    return $precautions_collection->merge($precautions_composition);
  }

  public function fromComposition(
    $composition_array,
    $voies_administration = null
  ) {
    $precautions_collection = Precaution::whereHasMorph(
      'cible',
      [Composition::class],
      function ($query) use ($composition_array) {
        $query->whereIn(
          'cible_id',
          $composition_array->map(function ($composition) {
            return $composition->id;
          })
        );
      }
    )
      ->whereIn('voie_administration', $voies_administration)
      ->get();
    return $precautions_collection->unique();
  }
}
