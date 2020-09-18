<?php

namespace App\Repositories;

use App\Models\PlanPrise;
use App\Repositories\MedicamentRepository;
use Illuminate\Support\Facades\Auth;

class PlanPriseRepository
{
  private $plan_prise;
  private $medicament_repository;

  public function __construct(
    PlanPrise $plan_prise,
    MedicamentRepository $medicament_repository
  ) {
    $this->plan_prise = $plan_prise;
    $this->medicament_repository = $medicament_repository;
  }

  private function _init($pp_id)
  {
    if ($pp_id > 0) {
      $this->plan_prise = PlanPrise::where('pp_id', $pp_id)
        ->where('user_id', Auth::id())
        ->first();
      if (!$this->plan_prise) {
        abort(404);
      }
      $this->plan_prise->append('medicaments');
      return true;
    } else {
      $this->plan_prise->pp_id = $this->_getNextID();
      $this->plan_prise->user_id = Auth::id();
      return false;
    }
  }

  private function _getNextID()
  {
    $max_id = PlanPrise::where('user_id', Auth::id())
      ->withTrashed()
      ->max('pp_id');
    $max_id = $max_id ?: 0;
    return $max_id + 1;
  }

  public function get($pp_id)
  {
    if ($this->_init($pp_id) === true) {
      return $this->plan_prise;
    } else {
      return abort(404);
    }
  }

  public function index($id)
  {
    if ($id) {
      $item = PlanPrise::where('user_id', Auth::id())
        ->where('pp_id', $id)
        ->first();
      if (!$item) {
        abort(
          404,
          "Le plan de prise a été supprimé ou vous n'avez pas l'autorisation d'y accéder"
        );
      }
      return [
        'data' => $item,
        'source' => $item->data,
      ];
    } else {
      return PlanPrise::where('user_id', Auth::id())->pluck('pp_id');
    }
  }

  public function update($pp_id, $data)
  {
    if ($this->_init($pp_id)) {
      foreach ($data as $d) {
        switch ($d['type']) {
          case 'medic_data':
            $this->plan_prise->medic_data = $d['value'];
            break;
          case 'custom_data':
            $this->plan_prise->custom_data = $d['value'];
            break;
          case 'custom_settings':
            $this->plan_prise->custom_settings = $d['value'];
            break;
          default:
            throw new \Error(
              'Cette action ne correpond pas aux actions autorisées pour une mise à jour du contenu'
            );
            break;
        }
      }
    }
    $this->plan_prise->save();
    return $this->_getReturnArray('success');
  }

  public function destroy($pp_id)
  {
    if ($this->_init($pp_id)) {
      $this->plan_prise->delete();
      return $this->_getReturnArray('success');
    } else {
      return $this->_getReturnArray('error', ['data' => 'PP not exists']);
    }
  }

  private function _getReturnArray($status, $array = null, $join = true)
  {
    switch ($status) {
      case 'success':
        return response()->json($array, 200);
      case 'error':
        return response()->json($array, 404);
      default:
        return response()->json($array, 500);
    }
  }
}
