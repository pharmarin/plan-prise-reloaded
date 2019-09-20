<?php

namespace App\Repositories;


use App\MedicamentAPI;
use App\MedicamentCIP;

use App\Medicament;

use App\MedicamentPrecaution;

use Illuminate\Http\Request;

class MedicamentAPIRepository {

  protected $medicamentAPI;

  public function __construct (MedicamentAPI $medicamentAPI) {

    $this->medicamentAPI = $medicamentAPI;

  }

  /**
   * Check if a MedicamentAPI exists or import it from the BDPM
   * @method getMedicamentAPIByCIS
   * @param  integer $codeCIS codeCIS
   * @return MedicamentAPI Existing or imported MedicamentAPI
   */
  public function getMedicamentAPIByCIS ($codeCIS) {

    $medicament = $this->medicamentAPI->where('code_cis', $codeCIS);

    if ($medicament->count() > 0) {

      return $medicament->first();

    } else {

      $medicament_from_api = $this->getMedicamentDetailFromAPI($codeCIS);

      return $this->setMedicamentFromAPI($medicament_from_api, 'CREATE');

    }

  }


  /**
   * Get MedicamentAPI from the BDPM
   * @method getMedicamentListFromAPI
   * @param  string $query Query to BDPM
   * @param  boolean $isRetrying ??
   * @return [Object] Array of objects from the BDPM
   */
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


  /**
   * Permet d'obtenir les détails du médicament depuis la BDPM
   * @method getMedicamentDetailFromAPI
   * @param  integer $codeCIS Code CIS du médicament
   * @return object Objet qui sera parsé en médicament
   */
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


  /**
   * Update MedicamentAPI detail from BDPM
   * @method updateMedicamentAPIByCIS
   * @param  integer $codeCIS Code CIS
   * @return MedicamentAPI MedicamentAPI mis à jour
   */
  public function updateMedicamentAPIByCIS ($codeCIS) {

    $medicament_from_api = $this->getMedicamentDetailFromAPI($codeCIS);

    return $this->setMedicamentFromAPI($medicament_from_api, 'UPDATE', $codeCIS);

  }


  /**
   * Parse the BDPM medicament, to Create or Update MedicamentAPI from BDPM
   * @method setMedicamentFromAPI
   * @param  Object $medicament_from_api Médicament importé depuis la BDPM
   * @param  string $action Action à effectuer (CREATE || UPDATE)
   * @param  integer $codeCIS Code CIS du médicament à mettre à jour
   */
  public function setMedicamentFromAPI ($medicament_from_api, $action = 'CREATE', $codeCIS = 0) {

    switch ($action) {

      case 'CREATE':

        $medicament = new MedicamentAPI();

        $log = 'Imported';

        break;

      case 'UPDATE':

        $medicament = MedicamentAPI::where('code_cis', $codeCIS)->first();

        $log = 'Updated';

        break;

      default:

        echo 'Error in switch setMedicamentFromAPI'; exit;

    }

    $medicament->code_cis = $medicament_from_api->codeCIS;

    $medicament->denomination = $medicament_from_api->denomination;
    $medicament->titulaire = $medicament_from_api->titulaires[0];

    $medicament->forme_pharmaceutique = $medicament_from_api->formePharmaceutique;

    $medicament->voies_administration = json_encode($medicament_from_api->voiesAdministration);

    $medicament->homeopathie = $medicament_from_api->homeopathie;

    $medicament->etat_commercialisation = $medicament_from_api->etatCommercialisation;

    $medicament->indications_therapeutiques = json_encode($medicament_from_api->indicationsTherapeutiques);

    $medicament->compositions = json_encode($medicament_from_api->compositions);

    $medicament->save();
    $codeCIPArray = array_map(function ($presentation) use ($medicament_from_api) {
      return MedicamentCIP::updateOrCreate(
        ['CIP13' => $presentation->codeCIP13],
        ['CIP7' => $presentation->codeCIP7]
      );
    }, $medicament_from_api->presentations);
    $medicament->cip()->saveMany($codeCIPArray);

    logger($log . ' ' . $medicament_from_api->denomination . ' (' . $medicament_from_api->codeCIS . ')');

    return $medicament;

  }

}
