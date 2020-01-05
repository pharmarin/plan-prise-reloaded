<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBdpmCisCompoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bdpm_cis_compo', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('code_cis')->unsigned();
            $table->string('designation');
            $table->bigInteger('code_substance');
            $table->text('denomination_substance');
            $table->string('dosage_substance')->nullable();
            $table->string('unite_substance')->nullable();
            $table->string('nature_composant'); // principe actif : « SA » ou fraction thérapeutique : « ST »
            $table->integer('pivot'); // Numéro permettant de lier, le cas échéant, substances actives et fractions thérapeutiques
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bdpm_cis_compo');
    }
}
