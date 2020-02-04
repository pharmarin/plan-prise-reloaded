<?php

namespace App\Repositories;

use App\Models\PlanPrise;
use App\Repositories\MedicamentRepository;
use Illuminate\Support\Facades\Auth;

class PlanPriseRepository
{

  private $plan_prise;
  private $medicament_repository;

  public function __construct (PlanPrise $plan_prise, MedicamentRepository $medicament_repository)
  {
    $this->plan_prise = $plan_prise;
    $this->medicament_repository = $medicament_repository;
  }

  public function get ($pp_id)
  {
    if ($this->_init($pp_id) === true) {
      return $this->plan_prise;
    } else {
      return abort(404);
    }
  }

  private function _init ($pp_id)
  {
    if ($pp_id > 0) {
      $this->plan_prise = PlanPrise::where('pp_id', $pp_id)->where('user_id', Auth::id())->first();
      if (!$this->plan_prise) abort(404);
      return true;
    } else {
      $this->plan_prise->pp_id = $this->_getNextID();
      $this->plan_prise->user_id = Auth::id();
      return false;
    }
  }

  private function _getNextID () {
    $max_id = PlanPrise::where('user_id', Auth::id())->withTrashed()->max('pp_id');
    $max_id = $max_id ?: 0;
    return $max_id + 1;
  }

  public function store ($pp_id, $value)
  {
    $pp_exists = $this->_init($pp_id);

    if ($this->plan_prise->medic_data->contains('value', $value)) {
      return $this->_getReturnArray('error', ['data' => 'Ce médicament est déjà dans le plan de prise.']);
    }

    $new_line = [
      [
      'type' => request()->input('type'),
      'value' => $value
      ]
    ];

    $medic_data = $this->plan_prise->medic_data->merge($new_line);
    $this->plan_prise->medic_data = $medic_data;

    $this->plan_prise->save();

    return $this->_getReturnArray('success');
  }

  public function update ($pp_id, $values)
  {
    if ($this->_init($pp_id)) {
      //dd(request()->all());
      switch (request()->input('action')) {
        case 'edit':
          $this->plan_prise->custom_data = array_filter($values);
          break;
        case 'delete':
          $this->plan_prise->medic_data = $this->plan_prise->medic_data->reject(function ($item) use ($values) {
            return $item['value'] == $values;
          });
          $this->plan_prise->custom_data = $this->plan_prise->custom_data->forget($values);
          break;
        case 'settings':
          $this->plan_prise->custom_settings = $values;
          break;
        default:
          throw new \Exception('Aucune action demandée. ');
          break;
      }
      $this->plan_prise->save();
      return $this->_getReturnArray('success');
    } else {
      return $this->_getReturnArray('error', ['data' => 'PP not exists']);
    }
  }

  public function destroy ($pp_id) {
    if ($this->_init($pp_id)) {
      $this->plan_prise->delete();
      return $this->_getReturnArray('success');
    } else {
      return $this->_getReturnArray('error', ['data' => 'PP not exists']);
    }
  }

  private function _getReturnArray ($status, $array = [])
  {
    return [
      'status' => $status,
      'data' => array_merge(
        $array,
        ['pp_id' => $this->plan_prise->pp_id]
      )
    ];
  }

}
