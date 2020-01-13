<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePrecautionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('custom_precautions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('voie_administration');
            $table->string('population')->nullable();
            $table->text('commentaire');
            $table->string('cible_type');
            $table->bigInteger('cible_id');
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
        Schema::dropIfExists('custom_precautions');
    }
}
