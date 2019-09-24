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


  public function getAll ()
  {
    return $this->medicamentCustom::orderBy('custom_denomination')->paginate(20);
  }

  public function getLike ($string)
  {
    return $this->medicamentCustom::where('custom_denomination', 'LIKE', '%' . $string . '%')->paginate(20);
  }

  public function getMedicamentByCIS ($cis) {
    return optional($this->medicamentAPI::where('code_cis', $cis)->first())->customValues;
  }


  /**
   * Créé un médicament depuis le formulaire de création ou d'import
   * @method saveFromForm
   * @param  Request $request Données du formulaire
   * @return integer id du nouveau médicament
   */
  public function saveFromForm (Request $request) {

    $this->medicamentCustom = $this->populateModelFromForm($request, $this->medicamentCustom);

    $this->medicamentCustom->save();

    $fromAPI = $this->medicamentAPI::whereIn('code_cis', $request->input('api_selected'))->get();

    $this->medicamentCustom->bdpm()->saveMany($fromAPI);

    $this->saveOrUpdateCommentairesFromForm($request->input('commentaires'), $this->medicamentCustom->id);

    return $this->medicamentCustom->id;

  }


  /**
   * Met à jout un médicament depuis le formulaire de modification
   * @method updateFromForm
   * @param  Request $request [description]
   * @param  Medicament $medicament [description]
   * @return boolean True if OK
   */
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

    $fromAPI = $this->medicamentAPI::whereIn('code_cis', $request->input('api_selected'))->get();

    $medicament->bdpm()->saveMany($fromAPI);

    $this->saveOrUpdateCommentairesFromForm($request->input('commentaires'), $medicament->id);

    return true;

  }


  /**
   * Populate le modèle Medicament avec les données du formulaire
   * @method populateModelFromForm
   * @param  Request $request Données du formulaire
   * @param  Medicament $medicament Médicament à modifier (créé précédemment ou existant)
   * @return Medicament Médicament modifié
   */
  public function populateModelFromForm (Request $request, Medicament $medicament) {

    $medicament->custom_denomination = $request->input('custom_denomination');

    $medicament->custom_indications = json_encode($request->input('custom_indications'));

    $medicament->conservation_frigo = $request->input('conservation_frigo');

    $medicament->conservation_duree = json_encode($request->input('conservation_duree'));

    $medicament->voies_administration = json_encode($request->input('voies_administration'));

    return $medicament;

  }


  /**
   * Créé ou met à jour les commentaires
   * @method saveOrUpdateCommentairesFromForm
   * @param  object $commentaires Données du formulaire ($request->input('commentaires'))
   * @param  integer $medicament_id ID du médicament (intervient dans la cible du commentaire)
   * @return boolean True if OK
   */
  public function saveOrUpdateCommentairesFromForm ($commentaires, $medicament_id) {

    if (!$commentaires) return;

    foreach ($commentaires as $commentaire) {

      if (empty($commentaire['commentaire'])) return;

      if (!empty($commentaire['id'])) {

        $this->updateCommentaire($commentaire, $medicament_id);

      } else {

        $this->saveCommentaire($commentaire, $medicament_id);

      }

    }

    return true;

  }


  /**
   * Ajoute un nouveau commentaire depuis les données du formulaire
   * @method saveCommentaire
   * @param  object $commentaire Données transmises depuis le formulaire
   * @param  integer $medicament_id ID du médicament (pour la cible)
   * @return boolean True if OK
   */
  protected function saveCommentaire ($commentaire, $medicament_id) {

    $toSave = new MedicamentPrecaution();

    $cible = $this->getCible($commentaire['cible_id'], $medicament_id);

    $toSave->cible = $cible['cible'];

    $toSave->cible_id = $cible['cible_id'];

    $toSave->voie_administration = $commentaire['voie_administration'];

    $toSave->population = $commentaire['population'];

    $toSave->commentaire = $commentaire['commentaire'];

    $toSave->save();

    return true;

  }


  /**
   * Modifie le commentaire depuis les données du formulaire
   * @method updateCommentaire
   * @param  object $commentaire Données transmises depuis le formulaire
   * @param  integer $medicament_id ID du médicament (pour la cible)
   * @return boolean True if OK
   */
  protected function updateCommentaire ($commentaire, $medicament_id) {

    $toUpdate = MedicamentPrecaution::find($commentaire['id']);

    $cible = $this->getCible($commentaire['cible_id'], $medicament_id);

    $toUpdate->cible = $cible['cible'];

    $toUpdate->cible_id = $cible['cible_id'];

    $toUpdate->voie_administration = $commentaire['voie_administration'];

    $toUpdate->population = $commentaire['population'];

    $toUpdate->commentaire = $commentaire['commentaire'];

    $toUpdate->save();

    return true;

  }


  /**
   * Pour obtenir la cible du commentaire
   * @method getCible
   * @param  string $cible Cible du médicament (M-{ID} ou S-{codeSubstance})
   * @param  integer $medicament_id ID du médicament
   * @return array Array contenant la cible du commentaire et l'id de la cible
   */
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

  /**
   * Supprime le médicament
   * @method delete
   * @param  Medicament $medicament Médicament transmis par Laravel
   * @return boolean True if OK
   */
  public function delete (Medicament $medicament) {

    $medicament->delete();

    MedicamentPrecaution::where('cible', 'medicament')->where('cible_id', 'M-' . $medicament->id)->delete();

    return true;

  }

}
