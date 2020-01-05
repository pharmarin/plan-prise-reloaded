<?php

namespace App\Console\Commands;

use App\Imports\BdpmCisImport;
use App\Imports\BdpmCisCipImport;
use App\Imports\BdpmCisCompoImport;
use Illuminate\Console\Command;

class ImportExcel extends Command
{
    protected $signature = 'import:excel';

    protected $description = 'Laravel Excel importer';

    public function handle()
    {
        $this->output->title('Resetting database');
        $this->call('migrate:rollback');
        $this->call('migrate');
        $this->output->title('Starting import');
        $this->output->title('Importing CIS_bdpm.txt');
        (new BdpmCisImport)->import(resource_path('imports/CIS_bdpm.txt'));
        $this->output->title('Importing CIS_CIP_bdpm.txt');
        (new BdpmCisCipImport)->import(resource_path('imports/CIS_CIP_bdpm.txt'));
        $this->output->title('Importing CIS_COMPO_bdpm.txt');
        (new BdpmCisCompoImport)->import(resource_path('imports/CIS_COMPO_bdpm.txt'));
        $this->output->success('Import successful');
    }
}
