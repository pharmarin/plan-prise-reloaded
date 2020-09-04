<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Medicament;
use App\Models\OldMedicament;
use App\Repositories\CommonRepository;

class CommonApiController extends Controller
{
  public function __construct()
  {
    $this->middleware('ajax');
  }

  public function search(Request $request)
  {
    return response()->json(CommonRepository::search($request->input('query')));
  }

  public function show(Request $request)
  {
    return response()->json(
      CommonRepository::find($request->input('id'), $request->input('type'))
    );
  }
}
