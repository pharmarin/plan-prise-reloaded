<?php

namespace App\Http\Controllers;

use App\Models\Composition;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CompositionController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index(Request $request)
  {
    $compositions = Composition::orderBy('denomination')->paginate();
    return view('composition.index')->with(compact('compositions'));
  }

  /**
   * Show the form for editing the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function edit($id)
  {
    $composition = Composition::findOrFail($id);
    return view('composition.edit')->with(compact('composition'));
  }
}
