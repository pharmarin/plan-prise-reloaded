<?php

namespace App\Repositories;


use App\Models\BdpmCis;
use App\Models\Composition;

use App\Models\Medicament;

use App\Models\Precaution;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedicamentRepository {

  protected $bdpmCis;

  protected $medicamentCustom;

  protected $pivot_table;


  public function __construct (BdpmCis $bdpmCis, Medicament $medicamentCustom) {

    $this->bdpmCis = $bdpmCis;

    $this->medicamentCustom = $medicamentCustom;

    $this->pivot_table = 'custom_precautions_pivot';

  }


  public function all ($options = [])
  {
    $paginate = isset($options['paginate']) ? $options['paginate'] : 20;
    $order_by = isset($options['order_by']) ? $options['order_by'] : 'custom_denomination';
    return $this->medicamentCustom::orderBy($order_by)->paginate($paginate);
  }

  public function getLike ($string)
  {
    return $this->medicamentCustom::where('custom_denomination', 'LIKE', '%' . $string . '%')->paginate(20);
  }

  public function getMedicamentByCIS ($cis) {
    return optional($this->bdpmCis::where('code_cis', $cis)->first())->custom_values;
  }


  /**
   * Créé un médicament depuis le formulaire de création ou d'import
   * @method saveFromForm
   * @param  Request $request Données du formulaire
   * @return integer id du nouveau médicament
   */
  public function saveFromForm (Request $request) {

    $guard = Medicament::where('custom_denomination', '=', $request->input('custom_denomination'))->get();
    if (count($guard) > 0) throw new \Exception('Un médicament portant ce nom existe déjà. ');

    $this->medicamentCustom = $this->_populateModelFromForm($request, $this->medicamentCustom);

    $this->medicamentCustom->save();

    $fromAPI = $this->bdpmCis::whereIn('code_cis', $request->input('bdpm'))->get();
    $this->medicamentCustom->bdpm()->saveMany($fromAPI);

    $composition_array = $this->_saveOrUpdateComposition($request->input('composition'));
    $this->medicamentCustom->compositions()->sync($composition_array);

    $this->_filterPrecautions($request->input('delete_precautions'));

    $this->saveOrUpdateCommentairesFromForm($request->input('commentaires'));

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

      $this->medicamentCustom = Medicament::find($medicament->id);

      $this->_filterPrecautions($request->input('delete_precautions'));

      $this->_populateModelFromForm($request, $this->medicamentCustom);

      $this->medicamentCustom->save();

      $fromAPI = $this->bdpmCis::whereIn('code_cis', $request->input('bdpm'))->get();
      $medicament->bdpm()->sync($fromAPI);

      $composition_array = $this->_saveOrUpdateComposition($request->input('composition'));
      $this->medicamentCustom->compositions()->sync($composition_array);

      $this->saveOrUpdateCommentairesFromForm($request->input('commentaires'));

      return true;

    }

    abort(403, 'Bad method ;)');
  }


  /**
   * Populate le modèle Medicament avec les données du formulaire
   * @method populateModelFromForm
   * @param  Request $request Données du formulaire
   * @param  Medicament $medicament Médicament à modifier (créé précédemment ou existant)
   * @return Medicament Médicament modifié
   */
  private function _populateModelFromForm (Request $request, Medicament $medicament) {

    $medicament->custom_denomination = $request->input('custom_denomination');

    $medicament->custom_indications = json_encode($request->input('custom_indications'));

    $medicament->conservation_frigo = $request->input('conservation_frigo');

    $medicament->conservation_duree = json_encode($request->input('conservation_duree'));

    $medicament->voies_administration = json_encode($request->input('voies_administration'));

    return $medicament;

  }

  private function _saveOrUpdateComposition ($composition_array) {
    return array_map(function ($composition) {
      if (is_numeric($composition)) {
        $model = Composition::findOrFail($composition);
      } else {
        $model = new Composition();
        $model->denomination = $composition;
        $model->save();
      }
      return $model->id;
    }, $composition_array);
  }


  /**
   * Créé ou met à jour les commentaires
   * @method saveOrUpdateCommentairesFromForm
   * @param  object $commentaires Données du formulaire ($request->input('commentaires'))
   * @param  integer $medicament_id ID du médicament (intervient dans la cible du commentaire)
   * @return boolean True if OK
   */
  public function saveOrUpdateCommentairesFromForm ($commentaires) {

    if (!$commentaires) return;


    foreach ($commentaires as $commentaire) {

      if (empty($commentaire['commentaire'])) return;

      if (!empty($commentaire['id'])) {

        $this->updateCommentaire($commentaire);

      } else {

        $this->saveCommentaire($commentaire);

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
  protected function saveCommentaire ($commentaire) {

    $cible = $this->getCible($commentaire['cible_id'], $this->medicamentCustom->id);

    $precaution = new Precaution();
    $precaution->voie_administration = $commentaire['voie_administration'];
    $precaution->population = $commentaire['population'];
    $precaution->commentaire = $commentaire['commentaire'];
    $precaution->save();

    $this->_insertPivots($cible, $precaution);

    return true;

  }


  /**
   * Modifie le commentaire depuis les données du formulaire
   * @method updateCommentaire
   * @param  object $commentaire Données transmises depuis le formulaire
   * @param  integer $medicament_id ID du médicament (pour la cible)
   * @return boolean True if OK
   */
  protected function updateCommentaire ($commentaire) {

    $toUpdate = Precaution::find($commentaire['id']);

    $cible = $this->getCible($commentaire['cible_id'], $this->medicamentCustom->id);

    $this->_insertPivots($cible, $toUpdate);

    $toUpdate->voie_administration = $commentaire['voie_administration'];

    $toUpdate->population = $commentaire['population'];

    $toUpdate->commentaire = $commentaire['commentaire'];

    $toUpdate->save();

    return true;

  }

  private function _filterPrecautions ($delete_id) {
    $to_delete = collect($delete_id)->filter();
    if (count($to_delete) > 0 && !$to_delete->isEmpty()) {
      $to_delete->each(function ($item) {
        Precaution::find($item)->delete();
      });
    }
  }

  private function _insertPivots ($cible, $precaution)
  {

    $cible['model']->precs()->save($precaution);

  }


  /**
   * Pour obtenir la cible du commentaire
   * @method getCible
   * @param  string $cible Cible du médicament (M-{ID} ou S-{codeSubstance})
   * @param  integer $medicament_id ID du médicament
   * @return array Array contenant la cible du commentaire et l'id de la cible
   */
  public function getCible ($cible, $medicament_id) {

    $cible_return = [];

    $substanceOrMedicament = explode('-', $cible);

    switch ($substanceOrMedicament[0]) {
      case "0":
      case "M":
        return [
          'type' => 'M',
          'model' => Medicament::findOrFail($medicament_id)
        ];
      case "S":
        $composition = is_numeric($substanceOrMedicament[1]) ? Composition::findOrFail($substanceOrMedicament[1]) : Composition::where('denomination', '=', $substanceOrMedicament[1])->firstOrFail();
        return [
          'type' => 'S',
          'model' => $composition
        ];
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

    return true;

  }

}
