<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomMedicsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('custom_medics', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('customDenomination');
            $table->text('customIndications');
            $table->boolean('conservationFrigo');
            $table->text('conservationDuree');
            $table->text('voiesAdministration');
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
        Schema::dropIfExists('custom_medics');
    }
}
