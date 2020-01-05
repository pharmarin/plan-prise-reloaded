<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomPrecautionsPivotTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('custom_precautions_pivot', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('precaution_id');
            $table->string('cible_type');
            $table->bigInteger('cible_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('custom_precautions_pivot');
    }
}
