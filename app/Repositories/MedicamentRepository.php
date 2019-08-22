<?php

namespace App\Repositories;

use App\Medicament;
use App\MedicamentCustom;
use App\MedicamentPrecaution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MedicamentRepository {
  protected $medicament;
  protected $custom;

  public function __construct (Medicament $medicament, MedicamentCustom $custom) {
    $this->medicament = $medicament;
    $this->custom = $custom;
  }

  public function getMedicamentFromOld ($old_medicament) {
    return $this->medicament;
  }

  public function getMedicamentByCIS ($codeCIS) {
    $medicament = $this->medicament->where('codeCIS', $codeCIS);
    if ($medicament->count() > 0) {
      return $medicament->first();
    } else {
      $medicament_from_api = $this->getMedicamentDetailFromAPI($codeCIS);
      return $this->setMedicamentFromAPI($medicament_from_api);
    }
  }

  public function getMedicamentListFromAPI ($query, $isRetrying = false) {
    $url = 'https://www.open-medicaments.fr/api/v1/medicaments/?query=' . urlencode(stripslashes($query)) . '&limit=100';

    try {
      $content = file_get_contents($url);

      if ($content === false) {
        echo 'API returned null';
        return null;
      }

      $json = json_decode($content);

      if (count($json) == 0) {
        echo $url;
        if (!$isRetrying) return $this->getMedicamentListFromAPI(explode(' ', trim($query))[0], true);
      }

      return json_decode($content);
    } catch (Exception $e) {
      echo 'Get API errored';
      var_dump($e);
      return null;
    }
  }

  public function setMedicamentFromAPI ($medicament_from_api) {
    $medicament = new Medicament();
    $medicament->codeCIS = $medicament_from_api->codeCIS;
    $medicament->denomination = $medicament_from_api->denomination;
    $medicament->formePharmaceutique = $medicament_from_api->formePharmaceutique;
    $medicament->voiesAdministration = json_encode($medicament_from_api->voiesAdministration);
    $medicament->homeopathie = $medicament_from_api->homeopathie;
    $medicament->etatCommercialisation = $medicament_from_api->etatCommercialisation;
    $medicament->indicationsTherapeutiques = json_encode($medicament_from_api->indicationsTherapeutiques);
    $medicament->compositions = json_encode($medicament_from_api->compositions);
    $medicament->save();
    Log::info('Imported ' . $medicament_from_api->denomination . ' (' . $medicament_from_api->codeCIS . ')');
    return $medicament;
  }

  public function getMedicamentDetailFromAPI ($codeCIS) {
    try {
      $content = file_get_contents('https://www.open-medicaments.fr/api/v1/medicaments/' . urlencode($codeCIS));

      if ($content === false) {
        echo 'API returned null';
        return null;
      }
      return json_decode($content);
    } catch (Exception $e) {
      echo 'Get API errored';
      var_dump($e);
      return null;
    }
  }

  public function saveFromForm (Request $request) {
    $this->custom->customDenomination = $request->input('customDenomination');
    $this->custom->customIndications = json_encode($request->input('customIndications'));
    $this->custom->conservationFrigo = $request->input('conservationFrigo');
    $this->custom->conservationDuree = json_encode($request->input('conservationDuree'));
    $this->custom->voiesAdministration = json_encode($request->input('voieAdministration'));
    $this->custom->save();
    $this->custom->apiMedic()->attach($request->input('api_selected'));
    $this->saveCommentairesFromForm($request->input('commentaires'), $this->custom->id);
    return $this->custom->id;
  }

  public function saveCommentairesFromForm ($commentaires, $id) {
    foreach ($commentaires as $commentaire) {
      $toSave = new MedicamentPrecaution();
      $substanceOrMedicament = explode('-', $commentaire['cible']);
      switch ($substanceOrMedicament[0]) {
        case 0:
          $toSave->cible = 'medicament';
          $toSave->cible_id = $id;
          break;
        default:
          // code...
          break;
      }
      $toSave->voie_administration = $commentaire['voieAdministration'];
      $toSave->population = $commentaire['population'];
      $toSave->commentaire = $commentaire['commentaire'];
      $toSave->save();
    }
  }
}
