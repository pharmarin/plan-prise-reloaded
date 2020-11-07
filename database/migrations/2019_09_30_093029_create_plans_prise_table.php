<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlansPriseTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('plans_prise', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->bigInteger('pp_id')->unsigned();
      $table
        ->foreignId('user_id')
        ->constrained()
        ->onDelete('cascade');
      $table->text('medic_data');
      $table->text('custom_data')->nullable();
      $table->text('custom_settings')->nullable();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('plans_prise', function (Blueprint $table) {
      $table->dropForeign(['user_id']);
    });
    Schema::drop('plans_prise');
  }
}
