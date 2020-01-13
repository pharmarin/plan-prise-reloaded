<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompositionMedicamentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('composition_medicament', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('composition_id')->unsigned();
            $table->foreign('composition_id')->references('id')->on('compositions')->onDelete('cascade');
            $table->bigInteger('medicament_id')->unsigned();
            $table->foreign('medicament_id')->references('id')->on('custom_medics')->onDelete('cascade');
        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('composition_medicament', function (Blueprint $table) {
          $table->dropForeign('composition_medicament_composition_id_foreign');
          $table->dropForeign('composition_medicament_medicament_id_foreign');
        });
        Schema::dropIfExists('composition_medicament');
    }
}
