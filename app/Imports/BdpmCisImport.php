<?php

namespace App\Imports;

use App\Models\BdpmCis;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;
use Maatwebsite\Excel\Concerns\Importable;

class BdpmCisImport implements ToCollection, WithCustomCsvSettings, WithChunkReading, ShouldQueue
{

    use Importable;

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function collection (Collection $rows)
    {
      foreach ($rows as $row) {
        BdpmCis::create([
          'code_cis' => $row[0],
          'denomination' => $row[1],
          'forme_pharmaceutique' => $row[2],
          'voies_administration' => $row[3],
          'statut_administratif' => $row[4],
          'type_procedure' => $row[5],
          'etat_commercialisation' => $row[6],
          'date_amm' => $row[7],
          'statut_bdm' => $row[8],
          'numero_europe' => $row[9],
          'titulaires' => $row[10],
          'surveillance' => $row[11]
        ]);
      }
    }

    public function getCsvSettings () : array
    {
      return [
        'input_encoding' => 'ISO-8859-1',
        'delimiter' => "\t"
      ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
