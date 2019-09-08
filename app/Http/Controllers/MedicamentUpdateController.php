<?php


namespace App\Http\Controllers;


use App\Medicament;

use App\Repositories\MedicamentRepository;

use Illuminate\Http\Request;


class MedicamentUpdateController extends Controller

{

  protected $medicament_repository;

  function __construct (MedicamentRepository $medicament_repository) {
    $this->medicament_repository = $medicament_repository;
  }

  function getForm () {

    return view('medicament.update')->withDebug(true);

  }


  function handleRequest (Request $request) {

    switch ($request->input('action')) {

      case 'get':

        $date = \Carbon\Carbon::parse($request->input('data'))->add(1, 'day');

        $update_list = \App\MedicamentAPI::where('updated_at', '<', $date)->first()->pluck('codeCIS')->toJson();

        return json_encode([

          'status' => 'success',

          'data' => $update_list

        ]);

        break;

      case 'update':

        $this->medicament_repository->updateMedicamentByCIS($request->input('data'));


        return json_encode([

          'status' => 'success'

        ]);

      default:

      return json_encode([

        'status' => 'error'

      ]);

        break;

    }


  }

}


