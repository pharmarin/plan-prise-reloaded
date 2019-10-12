<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\MedicamentPrecaution;
use App\Repositories\CompositionRepository;

class Medicament extends Model
{
    protected $table = 'custom_medics';

    protected $appends = ['precautions', 'voies_administration_string', 'voies_administration_array'];

    public function bdpm () {
      return $this->hasMany('App\MedicamentAPI');
    }

    // Add attribute
    public function getCustomIndicationsAttribute ($custom_indications) {
      return json_decode($custom_indications);
    }

    public function getPrecautionsAttribute () {
      $voiesAdministration = $this->voies_administration_array;
      if (empty($voiesAdministration) || $this->bdpm()->first() === null) {
        return [];
      }
      array_push($voiesAdministration, 0);
      return MedicamentPrecaution::whereIn('voie_administration', $voiesAdministration)
        ->where(function ($query) {
          $query->where('cible', 'medicament')
          ->where('cible_id', 'M-' . $this->id)
          ->orWhere('cible', 'substance')
          ->whereIn('cible_id', array_map(function ($composition) {
            return $composition->codeSubstance;
          }, $this->bdpm()->first()->compositions_array));
        })
        ->get();
    }

    // Edit attribute
    public function getConservationDureeAttribute ($conservation_array) {
      $conservation_array = json_decode($conservation_array);
      return array_filter(array_map(function ($conservation) {
        return ($conservation->laboratoire === null && $conservation->duree === null) ? null : $conservation;
      }, $conservation_array));
    }

    // Add attribute
    public function getCompositionsAttribute () {
      return $medicamentAPI = $this->bdpm()->first()->compositions;
    }

    public function getDCIAttribute () {
      return $medicamentAPI = $this->bdpm()->first()->compositions_string;
    }

    // Add attribute
    public function getVoiesAdministrationStringAttribute () {
      if ($voiesAdministrationArray = json_decode($this->voies_administration)) {
        $voiesAdministrationValues = [
          1 => 'Orale',
          2 => 'Cutanée',
          3 => 'Auriculaire',
          4 => 'Nasale',
          5 => 'Inhalée',
          6 => 'Vaginale',
          7 => 'Oculaire',
          8 => 'Rectale',
          9 => 'Sous-cutanée',
          10 => 'Intra-musculaire',
          11 => 'Intra-veineux',
          12 => 'Intra-urétrale'
        ];
        return array_map(function ($voieAdministration) use ($voiesAdministrationValues) {
          return $voiesAdministrationValues[$voieAdministration->voies_administration];
        }, $voiesAdministrationArray);
      } else {
        return [];
      }
    }

    // Add attribute
    public function getVoiesAdministrationArrayAttribute () {
      if ($voiesAdministrationArray = json_decode($this->voies_administration)) {
        return array_map(function ($voieAdministration) {
          return $voieAdministration->voies_administration;
        }, $voiesAdministrationArray);
      } else {
        return [];
      }
    }

    public function getEmpty () {
      return tap($this, function ($medicament) {
        $medicament->forceFill(array_fill_keys(array_merge(\Schema::getColumnListing($medicament->getTable()), $this->appends, ["bdpm"]), null));
      });
    }
}
