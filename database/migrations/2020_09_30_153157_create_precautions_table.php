<?php

use App\Models\Medicament;
use App\Models\Utility\PrincipeActif;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrecautionsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('precautions', function (Blueprint $table) {
      $table->id();
      $table->integer('voie_administration');
      $table->string('population');
      $table->text('commentaire');
      $table->string('precaution_cible_type');
      $table->foreignId('precaution_cible_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('precautions');
  }
}
