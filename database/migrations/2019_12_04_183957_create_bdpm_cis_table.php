<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBdpmCisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bdpm_cis', function (Blueprint $table) {
            $table->bigIncrements('code_cis')->unique()->unsigned();
            $table->text('denomination');
            $table->text('forme_pharmaceutique');
            $table->text('voies_administration');
            $table->text('statut_administratif');
            $table->text('type_procedure');
            $table->text('etat_commercialisation');
            $table->text('date_amm');
            $table->text('statut_bdm')->nullable();
            $table->text('numero_europe')->nullable();
            $table->text('titulaires');
            $table->string('surveillance');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bdpm_cis');
    }
}
