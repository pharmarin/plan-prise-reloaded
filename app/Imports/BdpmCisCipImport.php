<?php

namespace App\Imports;

use App\Models\BdpmCisCip;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;
use Maatwebsite\Excel\Concerns\Importable;

class BdpmCisCipImport implements ToCollection, WithCustomCsvSettings, WithChunkReading, ShouldQueue
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
        BdpmCisCip::create([
          'code_cis' => $row[0],
          'cip_7' => $row[1],
          'presentation' => $row[2],
          'status_administratif' => $row[3],
          'commercialisation' => $row[4],
          'date_commercialisation' => $row[5],
          'cip_13' => $row[6],
          'collectivites' => $row[7],
          'remboursement' => $row[8],
          'prix_brut' => $row[9],
          'prix_net' => $row[10],
          'honoraire' => $row[11],
          'indications' => $row[12]
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
