<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePivotMedicsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pivot_medics', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('CIS')->unsigned()->unique();
            $table->bigInteger('custom_id')->unsigned();

            $table->foreign('CIS')->references('codeCIS')->on('bdpm_medics')->onDelete('cascade');
            $table->foreign('custom_id')->references('id')->on('custom_medics')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pivot_medics');
    }
}
