<?php

namespace App\Http\Controllers\Api;

use App\Models\Composition;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CompositionApiController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      if ($request->has('query')) {
        $compositions = Composition::where('denomination', 'LIKE', $request->input('query') .'%')->orderBy('denomination')->get();
      } elseif ($request->has('data')) {
        $compositions = Composition::whereIn('id', $request->input('data'))->get();
        $compositions->transform(function ($composition) {
          return $composition->append('precautions');
        });
      } else {
        $compositions = Composition::orderBy('denomination')->paginate();
      }
      return response()->json($compositions);
    }

    public function get (Request $request)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
      $composition = Composition::findOrFail($id);
      $composition->denomination = ucwords($request->input('denomination'));
      $composition->save();
      return redirect()->route('composition.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
      $composition = Composition::findOrFail($id);
      $composition->delete();
      return redirect()->route('composition.index');
    }
}
