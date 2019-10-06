<?php

namespace App\Repositories;

use App\PlanPrise;
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

  public function getPP ($pp_id)
  {
    if ($this->initiatePP($pp_id) === true) {
      return $this->plan_prise;
    } else {
      return null;
    }
  }

  private function initiatePP ($pp_id)
  {
    if ($pp_id > 0) {
      $this->plan_prise = PlanPrise::where('pp_id', $pp_id)->where('user_id', Auth::id())->first();
      return true;
    } else {
      $this->plan_prise->pp_id = $this->getNextID();
      $this->plan_prise->user_id = Auth::id();
      return false;
    }
  }

  private function getNextID () {
    $max_id = PlanPrise::where('user_id', Auth::id())->max('pp_id');
    $max_id = $max_id ?: 0;
    return $max_id + 1;
  }

  public function storePP ($pp_id, $value)
  {
    $medicament = $this->medicament_repository->getMedicamentByCIS($value);
    $pp_exists = $this->initiatePP($pp_id);

    if (in_array($value, $this->plan_prise->medic_data)) {
      return $this->getReturnArray('error', ['data' => 'Ce médicament est déjà dans le plan de prise.']);
    }

    $medic_data = array_merge($this->plan_prise->medic_data, array_wrap($value));
    $this->plan_prise->medic_data = $medic_data;

    $this->plan_prise->save();

    return $this->getReturnArray('success', ['data' => $medicament]);
  }

  public function editPP ($pp_id, $modifications)
  {
    if ($this->initiatePP($pp_id)) {
      $this->plan_prise->custom_data = array_filter($modifications);
      $this->plan_prise->save();
      return $this->getReturnArray('success');
    } else {
      return $this->getReturnArray('error', ['data' => 'PP not exists']);
    }
  }

  public function deletePP ($pp_id, $value)
  {
    if ($this->initiatePP($pp_id)) {
      $medic_data = $this->plan_prise->medic_data;
      $this->plan_prise->medic_data = array_values(array_filter($medic_data, function ($cis) use ($value) {
        return $cis != $value;
      }));
      $this->plan_prise->save();
      return $this->getReturnArray('success');
    } else {
      return $this->getReturnArray('error', ['data' => 'PP not exists']);
    }
  }

  private function getReturnArray ($status, $array = [])
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
