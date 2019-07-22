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
            $table->bigInteger('CIS')->unsigned();
            $table->bigInteger('CIP7')->unsigned();
            $table->bigInteger('CIP13')->unsigned();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::drop('bdpm_cip');
    }
}
