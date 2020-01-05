<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBdpmCisCipTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bdpm_cis_cip', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('code_cis')->unsigned();
            $table->bigInteger('cip_7')->unsigned();
            $table->text('presentation');
            $table->string('status_administratif');
            $table->string('commercialisation');
            $table->string('date_commercialisation');
            $table->bigInteger('cip_13');
            $table->string('collectivites');
            $table->string('remboursement')->nullable();
            $table->string('prix_brut')->nullable();
            $table->string('prix_net')->nullable();
            $table->string('honoraire')->nullable();
            $table->text('indications')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bdpm_cis_cip');
    }
}
