<?php


namespace App\Http\Controllers;


use App\Medicament;

use App\Repositories\MedicamentAPIRepository;

use Illuminate\Http\Request;


class MedicamentAPIController extends Controller

{

  protected $medicament_api_repository;
  protected $DEBUG = false;

  function __construct (MedicamentAPIRepository $medicament_api_repository) {
    $this->medicament_api_repository = $medicament_api_repository;
  }

  /**
  * Called by select to get detail of medicaments from CIS
  * @param  [Int] $request Array of CIS numbers
  * @return [Medicament] Array of medicaments
  */
  public function getDetailFromCIS (Request $request) {
    $cis_array = array_wrap($request->input('data'));
    $detail = [];
    $compositionArray = [];
    $compositionReference = null;

    foreach ($cis_array as $cis) {
      $api_medicament = $this->medicament_api_repository->getMedicamentAPIByCIS($cis);

      if ($api_medicament->etat_commercialisation == false) {
        $deselect[] = $api_medicament->code_cis;
      }

      $compositionArray[] = (object) [
        "code_cis" => $api_medicament->code_cis,
        "code_substance" => $api_medicament->compositions->getCodeSubstanceArray(),
        "code_string" => $api_medicament->compositions->getString()
      ];

      // Check if compositions are the same or return error
      if (!$compositionReference) {
        $compositionReference = $api_medicament->compositions;
        $denominationReference = $api_medicament->denomination;
      } else {
        $compositionComparer = $api_medicament->compositions;
        if ($compositionComparer->getCodeSubstanceArray() != $compositionReference->getCodeSubstanceArray()) {
          $message = 'Problème de PA pour ' . $api_medicament->denomination . ' vs. ' . $denominationReference . '(' . var_export($compositionComparer->getCodeSubstanceArray(), true) . ' vs. ' . var_export($compositionReference->getCodeSubstanceArray(), true) . ')\n';
          $deselect = [];
        }
      }
      // If OK, add the medicament to the array
      $detail[] = $api_medicament;
    }

    //sleep(10);

    if (isset($deselect)) {
      return response()->json(
        [
          'status' => 'error',
          'data' => (isset($message) ? $message : "") . 'Nous avons déselectionné les médicaments non commercialisés. Merci de réessayer. ',
          'deselect' => $deselect,
          'compositions' => $compositionArray
        ]
      );
    }

    return response()->json(
      [
        'status' => 'success',
        'data' => json_encode($detail)
      ]
    );
  }

  function refresh () {

    return view('medicament.update')->withDebug(true);

  }


  function update (Request $request) {

    switch ($request->input('action')) {

      case 'get':

      $date = \Carbon\Carbon::parse($request->input('data'))->add(1, 'day');

      $update_list = \App\MedicamentAPI::where('updated_at', '<', $date)->first()->pluck('codeCIS')->toJson();

      return response()->json([

        'status' => 'success',

        'data' => $update_list

      ]);

      break;

      case 'update':

      $this->medicament_api_repository->updateMedicamentAPIByCIS($request->input('data'));


      return response()->json([

        'status' => 'success'

      ]);

      default:

      return response()->json([

        'status' => 'error'

      ]);

      break;

    }


  }

}
