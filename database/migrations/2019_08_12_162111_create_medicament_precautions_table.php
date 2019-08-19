<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMedicamentPrecautionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medicament_precautions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('cible');
            $table->bigInteger('cible_id')->unsigned();
            $table->integer('voie_administration');
            $table->string('population')->nullable();
            $table->text('commentaire');
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
        Schema::dropIfExists('medicament_precautions');
    }
}
