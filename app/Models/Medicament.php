<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

use App\Repositories\BdpmRepository;
use App\Repositories\CompositionRepository;
use App\Repositories\PrecautionRepository;

class Medicament extends Model
{
    protected $table = 'custom_medics';
    protected $appends = ['precautions', 'type'];
    protected $with = ['compositions'];

    public function bdpm () {
      return $this->belongsToMany('App\Models\BdpmCis', 'bdpm_custom_pivot', 'medicament_id', 'code_cis');
    }

    public function precs ()
    {
      return $this->morphMany('App\Models\Precaution', 'cible');
    }

    public function compositions () {
      return $this->belongsToMany('App\Models\Composition');
    }

    public function getTypeAttribute () {
      return 1;
    }

    public function getPrecautionsAttribute ()
    {

      return (new PrecautionRepository())->fromMedicament($this);

    }

    // Add attribute
    public function getCustomIndicationsAttribute ($custom_indications) {
      return collect(json_decode($custom_indications));
    }

    /*public function getPrecautionsAttribute () {
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
    }*/

    // Edit attribute
    public function getConservationDureeAttribute ($conservation_array) {
      $conservation_array = json_decode($conservation_array);
      if (!$conservation_array) return;
      return array_filter(array_map(function ($conservation) {
        return ($conservation->laboratoire === null && $conservation->duree === null) ? null : $conservation;
      }, $conservation_array));
    }

    // Add attribute
    /*public function getCompositionAttribute () {
      $bdpm_repository = new BdpmRepository();
      return $bdpm_repository->getCompositionFromBdpmCollection($this->bdpm);
    }*/

    /*public function getCompositionStringAttribute () {
      return $this->composition->toString();
    }*/

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
