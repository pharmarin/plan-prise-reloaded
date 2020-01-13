<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\BdpmCisImport;
use App\Imports\BdpmCisCipImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Controllers\Controller;

class BdpmController extends Controller
{

    private $buffer;

    public function initImport () {
      $tables = [
        'bdpm_cis' => 'CIS_bdpm.txt',
        'bdpm_cis_cip' => 'CIS_CIP_bdpm.txt'
      ];
      return view('bdpm.selection')->with(compact('tables'));
    }

    public function launchImport () {
      $this->init();
      $this->output('== Starting import ==');
      $this->output('>> Importing CIS_bdpm.txt');
      $this->import(new BdpmCisImport, resource_path('imports/CIS_bdpm.txt'));
      $this->output('>> Importing CIS_CIP_bdpm.txt');
      $this->import(new BdpmCisCipImport, resource_path('imports/CIS_CIP_bdpm.txt'));
      $this->output('== Import successful ==');
      $this->end();
    }

    public function processImport (Request $request)
    {
      session()->put('requested', $request->input('tables'));
      var_dump(session()->get('requested'));
    }

    private function init ()
    {
      $this->buffer = str_repeat(" ", 4096) . "\r\n<div></div>\r\n";
      ini_set('memory_limit', '512M');
      ob_start();
    }

    private function end ()
    {
      ob_end_flush();
    }

    private function output ($string)
    {
      echo $this->buffer . $string;
      ob_flush();
      flush();
    }

    private function import ($model, $file)
    {
      set_time_limit(300);
      $model->import($file);
    }
}
