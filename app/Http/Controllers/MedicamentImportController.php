<?php

namespace App\Http\Controllers;

use App\OldMedicament;
use Illuminate\Http\Request;

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

    return view('medicament.form')->withAction('IMPORT')->with(compact('old_medicament'))->withDebug($this->DEBUG);
  }
  
}
