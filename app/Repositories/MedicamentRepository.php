<?php


namespace App\Repositories;


use App\MedicamentAPI;
use App\MedicamentCIP;

use App\Medicament;

use App\MedicamentPrecaution;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;


class MedicamentRepository {

  protected $medicamentAPI;

  protected $medicamentCustom;


  public function __construct (MedicamentAPI $medicamentAPI, Medicament $medicamentCustom) {

    $this->medicamentAPI = $medicamentAPI;

    $this->medicamentCustom = $medicamentCustom;

  }


  public function getAll () {

    return Medicament::orderBy('customDenomination')->get();

  }


  public function getMedicamentFromOld ($old_medicament) {

    return $this->medicamentAPI;

  }


  public function getMedicamentByCIS ($codeCIS) {

    $medicament = $this->medicamentAPI->where('codeCIS', $codeCIS);

    if ($medicament->count() > 0) {

      return $medicament->first();

    } else {

      $medicament_from_api = $this->getMedicamentDetailFromAPI($codeCIS);

      return $this->setMedicamentFromAPI($medicament_from_api, 'CREATE');

    }

  }


  public function updateMedicamentByCIS ($codeCIS) {

    $medicament_from_api = $this->getMedicamentDetailFromAPI($codeCIS);

    return $this->setMedicamentFromAPI($medicament_from_api, 'UPDATE', $codeCIS);

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


  public function setMedicamentFromAPI ($medicament_from_api, $action = 'CREATE', $codeCIS = 0) {

    switch ($action) {

      case 'CREATE':

        $medicament = new MedicamentAPI();

        $log = 'Imported';

        break;

      case 'UPDATE':

        $medicament = MedicamentAPI::where('codeCIS', $codeCIS)->first();

        $log = 'Updated';

        break;

      default:

        echo 'Error in switch setMedicamentFromAPI'; exit;

    }

    $medicament->codeCIS = $medicament_from_api->codeCIS;

    $medicament->denomination = $medicament_from_api->denomination;
    $medicament->titulaire = $medicament_from_api->titulaires[0];

    $medicament->formePharmaceutique = $medicament_from_api->formePharmaceutique;

    $medicament->voiesAdministration = json_encode($medicament_from_api->voiesAdministration);

    $medicament->homeopathie = $medicament_from_api->homeopathie;

    $medicament->etatCommercialisation = $medicament_from_api->etatCommercialisation;

    $medicament->indicationsTherapeutiques = json_encode($medicament_from_api->indicationsTherapeutiques);

    $medicament->compositions = json_encode($medicament_from_api->compositions);

    $medicament->save();
    $codeCIPArray = array_map(function ($presentation) use ($medicament_from_api) {
      return MedicamentCIP::updateOrCreate(
        ['CIP13' => $presentation->codeCIP13],
        ['CIP7' => $presentation->codeCIP7]
      );
    }, $medicament_from_api->presentations);
    $medicament->cip()->saveMany($codeCIPArray);

    Log::info($log . ' ' . $medicament_from_api->denomination . ' (' . $medicament_from_api->codeCIS . ')');

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

    $this->medicamentCustom = $this->populateModelFromForm($request, $this->medicamentCustom);

    $this->medicamentCustom->save();

    $fromAPI = $this->medicamentAPI::whereIn('codeCIS', $request->input('api_selected'))->get();

    $this->medicamentCustom->bdpm()->saveMany($fromAPI);

    $this->saveOrUpdateCommentairesFromForm($request->input('commentaires'), $this->medicamentCustom->id);

    return $this->medicamentCustom->id;

  }


  public function updateFromForm (Request $request, Medicament $medicament) {

    if ($request->input('_method') == 'PUT') {

      $reference = Medicament::find($medicament->id);

      $commentaires = collect($request->input('commentaires'));

      $commentaires_reference = $reference->precautions->map(function ($commentaire) {

        return $commentaire->id;

      });

      if ($commentaires_reference->isNotEmpty()) {
        $commentaires_comparaison = $commentaires->map(function ($commentaire) {

          return $commentaire['id'];

        });

        $to_delete = $commentaires_reference->diff($commentaires_comparaison);

        $to_delete->each(function ($item, $key) {

          MedicamentPrecaution::find($item)->delete();

        });
      }

    }

    $medicament = $this->populateModelFromForm($request, $medicament);

    $medicament->save();

    $fromAPI = $this->medicamentAPI::whereIn('codeCIS', $request->input('api_selected'))->get();

    $medicament->bdpm()->saveMany($fromAPI);

    $this->saveOrUpdateCommentairesFromForm($request->input('commentaires'), $medicament->id);

  }


  public function populateModelFromForm (Request $request, Medicament $medicament) {

    $medicament->customDenomination = $request->input('customDenomination');

    $medicament->customIndications = json_encode($request->input('customIndications'));

    $medicament->conservationFrigo = $request->input('conservationFrigo');

    $medicament->conservationDuree = json_encode($request->input('conservationDuree'));

    $medicament->voiesAdministration = json_encode($request->input('voiesAdministration'));

    return $medicament;

  }


  public function saveOrUpdateCommentairesFromForm ($commentaires, $medicament_id) {

      if (!$commentaires) return;

    foreach ($commentaires as $commentaire) {

      if (!empty($commentaire['id'])) {

        $this->updateCommentaire($commentaire, $medicament_id);

      } else {

        $this->saveCommentaire($commentaire, $medicament_id);

      }

    }

  }


  protected function saveCommentaire ($commentaire, $medicament_id) {

    $toSave = new MedicamentPrecaution();

    $cible = $this->getCible($commentaire['cible_id'], $medicament_id);

    $toSave->cible = $cible['cible'];

    $toSave->cible_id = $cible['cible_id'];

    $toSave->voie_administration = $commentaire['voie_administration'];

    $toSave->population = $commentaire['population'];

    $toSave->commentaire = $commentaire['commentaire'];

    $toSave->save();

  }


  protected function updateCommentaire ($commentaire, $medicament_id) {

    $toUpdate = MedicamentPrecaution::find($commentaire['id']);

    $cible = $this->getCible($commentaire['cible_id'], $medicament_id);

    $toUpdate->cible = $cible['cible'];

    $toUpdate->cible_id = $cible['cible_id'];

    $toUpdate->voie_administration = $commentaire['voie_administration'];

    $toUpdate->population = $commentaire['population'];

    $toUpdate->commentaire = $commentaire['commentaire'];

    $toUpdate->save();

  }


  public function getCible ($cible, $medicament_id) {

    $substanceOrMedicament = explode('-', $cible);

    switch ($substanceOrMedicament[0]) {

      case "0":

        return [

          'cible' => 'medicament',

          'cible_id' => 'M-' . $medicament_id

        ];

        break;

    case "M":

        return [

        'cible' => 'medicament',

        'cible_id' => 'M-' . $medicament_id

        ];

        break;

      case "S":

        return [

          'cible' => 'substance',

          'cible_id' => $cible

        ];

        break;

      default: break;

    }

  }


  public function delete (Medicament $medicament) {

    $medicament->delete();

    MedicamentPrecaution::where('cible', 'medicament')->where('cible_id', 'M-' . $medicament->id)->delete();

  }


}
