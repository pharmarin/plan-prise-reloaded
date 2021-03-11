<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCalendarsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('calendars', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->bigInteger('cal_id')->unsigned();
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
    Schema::dropIfExists('calendars');
  }
}
