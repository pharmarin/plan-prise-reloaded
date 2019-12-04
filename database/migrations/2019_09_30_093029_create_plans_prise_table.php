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
            $table->bigInteger('user_id')->unsigned();
            $table->text('medic_data');
            $table->text('custom_data')->nullable();
            $table->text('custom_settings')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('plans_prise', function ($table) {
            $table->foreign('user_id')
              ->references('id')
              ->on('users')
              ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('plans_prise', function(Blueprint $table) {
        $table->dropForeign('plans_prise_user_id_foreign');
      });
      Schema::drop('plans_prise');
    }
}
