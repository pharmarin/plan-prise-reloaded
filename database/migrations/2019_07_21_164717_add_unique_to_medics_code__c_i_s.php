<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUniqueToMedicsCodeCIS extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bdpm_medics', function (Blueprint $table) {
            $table->unique('codeCIS', 'bdpm_codeCIS_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropUnique('codeCIS', 'bdpm_codeCIS_unique');
    }
}
