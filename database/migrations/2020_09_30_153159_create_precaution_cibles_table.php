<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrecautionCiblesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('precaution_cibles', function (Blueprint $table) {
      $table->bigInteger('precaution_id');
      $table->string('precaution_cible_type');
      $table->bigInteger('precaution_cible_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('precaution_cibles');
  }
}
