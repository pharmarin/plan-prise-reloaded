<?php

namespace App\Http\Controllers;

use App\PlanPrise;
use App\Repositories\PlanPriseRepository;
use App\Repositories\CommonRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;

class PlanPriseController extends Controller
{
    private $pp_repository;

    /**
     * Only accept ajax calls
     */
    public function __construct (PlanPriseRepository $pp_repository)
    {
      $this->middleware('ajax', ['only' => 'create']);
      $this->pp_repository = $pp_repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index ($pp_id = 0)
    {
      $current_pp = $pp_id > 0 ? $this->pp_repository->get($pp_id) : null;
      $javascript = [
        'routes' => mix_routes([
          'api' => [
            'planprise' => [
              'index' => route('api.plan-prise.index'),
              'store' => route('api.plan-prise.store'),
              'update' => route('api.plan-prise.index'),
              'destroy' => route('api.plan-prise.index')
            ]
          ],
          'token' => auth('api')->tokenById(Auth::id())
        ]),
        'default' => [
          'inputs' => Config::get('inputs.plan_prise'),
          'voies_administration' => Config::get('inputs.voies_administration')
        ],
        'user' => [
          'name' => Auth::user()->display_name ?? Auth::user()->name
        ]
      ];

      return view('plan-prise.plan')->with(compact('javascript'));
    }

    public function export ($pp_id)
    {
      $columns = [];
      $current_pp = $this->pp_repository->get($pp_id);
      $custom_data = $current_pp->custom_data;
      $default = $current_pp->medicaments;
      $settings = $current_pp->custom_settings;
      $inputs = Config::get('inputs.plan_prise');
      foreach ($inputs as $group_id => $group) {
        foreach ($group['inputs'] as $input) {
          if ($group_id === 'posologies') {
            if (
              !(isset($input['default']) && $input['default'] === true)
              &&
              !(isset($settings->inputs->{$input['id']}) && $settings->inputs->{$input['id']}->checked === true)
            ) continue;
          }
          $columns[$input['id']] = $input;
        }
      }
      $medicaments = array_map(function ($medicament) use ($custom_data, $columns) {
        return CommonRepository::getValues($medicament, $custom_data[$medicament['value']['id']] ?? null, $columns);
      }, $default);
      if (count(array_filter(array_column($medicaments, 'conservation_duree'))) === 0) {
        unset($columns['conservation_duree']);
      }
      $pdf = PDF::loadView('plan-prise.print', compact('pp_id', 'medicaments', 'columns'));
		  return $pdf->stream('document.pdf');
    }

    public function print ($pp_id)
    {
      $columns = [];
      $current_pp = $this->pp_repository->get($pp_id);
      $custom_data = $current_pp->custom_data;
      $default = $current_pp->medicaments;
      $settings = $current_pp->custom_settings;
      $inputs = Config::get('inputs.plan_prise');
      foreach ($inputs as $group_id => $group) {
        foreach ($group['inputs'] as $input) {
          if ($group_id === 'posologies') {
            if (
              !(isset($input['default']) && $input['default'] === true)
              &&
              !(isset($settings->inputs->{$input['id']}) && $settings->inputs->{$input['id']}->checked === true)
            ) continue;
          }
          $columns[$input['id']] = $input;
        }
      }
      $medicaments = array_map(function ($medicament) use ($custom_data, $columns) {
        return CommonRepository::getValues($medicament, $custom_data[$medicament['value']['id']] ?? null, $columns);
      }, $default);
      if (count(array_filter(array_column($medicaments, 'conservation_duree'))) === 0) {
        unset($columns['conservation_duree']);
      }
      return view('plan-prise.print')->with(compact('pp_id', 'medicaments', 'columns'));
    }
}
