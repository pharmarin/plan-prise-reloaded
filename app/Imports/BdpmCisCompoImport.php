<?php

namespace App\Imports;

use App\Models\BdpmCisCompo;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;
use Maatwebsite\Excel\Concerns\Importable;

class BdpmCisCompoImport implements ToCollection, WithCustomCsvSettings, WithChunkReading, ShouldQueue
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
        BdpmCisCompo::create([
          'code_cis' => $row[0],
          'designation' => $row[1],
          'code_substance' => $row[2],
          'denomination_substance' => $row[3],
          'dosage_substance' => $row[4],
          'unite_substance' => $row[5],
          'nature_composant' => $row[6],
          'pivot' => $row[7]
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
