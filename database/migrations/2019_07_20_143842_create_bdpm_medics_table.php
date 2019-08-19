<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBdpmMedicsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bdpm_medics', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('codeCIS')->unique()->unsigned();
            $table->string('denomination');
            $table->string('formePharmaceutique');
            $table->string('voiesAdministration');
            $table->boolean('homeopathie');
            $table->boolean('etatCommercialisation');
            $table->text('indicationsTherapeutiques');
            $table->text('compositions');
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
        Schema::dropIfExists('bdpm_medics');
    }
}
