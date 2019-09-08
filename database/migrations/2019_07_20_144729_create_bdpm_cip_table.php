<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBdpmCipTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bdpm_cip', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('medicament_id')->unsigned()->nullable();
            $table->bigInteger('CIP7')->unsigned();
            $table->bigInteger('CIP13')->unsigned();

            $table->foreign('medicament_id')->references('id')->on('bdpm_medics')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('bdpm_cip', function(Blueprint $table) {
        $table->dropForeign('bdpm_cip_medicament_id_foreign');
      });
      Schema::drop('bdpm_cip');
    }
}
