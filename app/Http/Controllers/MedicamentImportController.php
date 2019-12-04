<?php

namespace App\Http\Controllers;

use App\OldMedicament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class MedicamentImportController extends Controller
{

  protected $DEBUG = false;

  public function importFromOldDatabase (Request $request) {
    if ($request->input('get') === "all") {
      $old_medicaments = OldMedicament::where('import', false)->orderBy('nomGenerique')->paginate(20);
    } elseif ($request->input('get') === "search") {
      $old_medicaments = OldMedicament::where('import', false)->where('nomMedicament', 'like', $request->input('query') . "%")->paginate(20);
    } else {
      $old_medicaments = null;
    }
    return view('medicament.import-choose')->with(compact('old_medicaments'));
  }

  public function showImportFormByID (Request $request, $id) {
    $old_medicament = OldMedicament::where('id', $id)->first();
    $javascript = [
      'old_medicament' => $old_medicament,
      'default_inputs' => Config::get('inputs.medicament'),
      'route' => route('medicament.store')."?".http_build_query($request->input('query'))
    ];
    return view('medicament.form')->withAction('IMPORT')->with(compact('javascript', 'old_medicament'));
  }

}
