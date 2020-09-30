<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMedicamentsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('medicaments', function (Blueprint $table) {
      $table->id();
      $table->string('denomination');
      $table->json('principes_actifs');
      $table->json('indications');
      $table->boolean('conservation_frigo');
      $table->json('conservation_duree');
      $table->json('voies_administration');
      $table->json('cis')->nullable();
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
    Schema::table('medicaments', function (Blueprint $table) {
      $table->dropSoftDeletes();
    });
    Schema::dropIfExists('medicaments');
  }
}
