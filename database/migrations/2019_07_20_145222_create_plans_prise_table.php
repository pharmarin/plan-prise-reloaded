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
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('pp_id');
            $table->bigInteger('bdpm_id')->unsigned();
            $table->timestamps();
        });

        Schema::table('plans_prise', function ($table) {
            $table->foreign('user_id')
              ->references('id')
              ->on('users')
              ->onDelete('cascade');
            $table->foreign('bdpm_id')
              ->references('id')
              ->on('bdpm_medics')
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
        $table->dropForeign('plans_prise_bdpm_id_foreign');
      });
      Schema::drop('plans_prise');
    }
}
