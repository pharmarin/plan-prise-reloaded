<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBdpmCisBdpmTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bdpm_cis_bdpm', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('code_cis')->unique()->unsigned();
            $table->string('denomination');
            $table->string('forme_pharmaceutique');
            $table->string('voies_administration');
            $table->string('statut_administratif');
            $table->string('type_procedure');
            $table->string('etat_commercialisation');
            $table->string('date_amm');
            $table->string('statut_bdm');
            $table->string('numero_europe');
            $table->string('titulaires');
            $table->string('surveillance');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bdpm_cis_bdpm');
    }
}
