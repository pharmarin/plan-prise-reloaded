<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrecautionsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('precautions', function (Blueprint $table) {
      $table->id();
      $table->integer('voie_administration');
      $table->string('population');
      $table->text('commentaire');
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
    Schema::dropIfExists('precautions');
  }
}
