<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class MigrateDataFromMedicsSimple extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    ini_set('memory_limit', '4G');

    $old = DB::table('medics_simple')->get();

    $old->each(function ($o) {
      $medic = \App\Models\Medicament::create([
        'denomination' => trim($o->nomMedicament),
        'principes_actifs' => $this->encodePrincipesActifs($o->nomGenerique),
        'indications' => array_map(function ($i) {
          return trim($i);
        }, explode(' OU ', $o->indication)),
        'conservation_frigo' => $o->frigo === 1 ? true : false,
        'conservation_duree' =>
        $this->encodeConservationDuree($o->dureeConservation),
        'voies_administration' => [
          switchVoieAdministration($o->voieAdministration),
        ],
      ]);
      $medic->precautions()->saveMany(
        collect(json_decode(strip_tags($o->commentaire)))->map(function (
          $com
        ) {
          return new \App\Models\Utility\Precaution([
            'voie_administration' => 0,
            'population' => trim($com->span),
            'commentaire' => trim(str_replace('<br>', "\n", $com->text)),
          ]);
        })
      );
    });
  }

  private function encodePrincipesActifs($nomGenerique)
  {
    $composants = collect(explode(' + ', $nomGenerique));
    return $composants->map(function ($c) {
      $c_trim = trim($c);
      $compo = DB::table('principes_actifs')
        ->where('denomination', $c_trim)
        ->first();
      if ($compo) {
        return $compo->id;
      } else {
        return DB::table('principes_actifs')->insertGetId([
          'denomination' => $c_trim,
        ]);
      }
    });
  }

  private function encodeConservationDuree($dureeConservation)
  {
    if ($dureeConservation == "") return [];
    return [json_decode($dureeConservation)
      ? array_map(
        function ($duree, $laboratoire) {
          return [
            'laboratoire' => trim($laboratoire),
            'duree' => trim($duree),
          ];
        },
        array_keys(json_decode($dureeConservation, true)),
        json_decode($dureeConservation, true)
      )
      : ['laboratoire' => "", 'duree' => trim($dureeConservation)]];
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
  }
}

/*
  +"commentaire": "[{"text":"A prendre au cours ou à la fin des repas.","span":"","status":"checked"},{"text":"Penser à boire 1 à 1,5 L d'eau par jour.","span":"","status":"checked"}]"
  */

function switchVoieAdministration($voie_administration)
{
  switch ($voie_administration) {
    case 'Orale':
      return 1;
      break;
    case 'Cutanée':
      return 2;
      break;
    case 'Auriculaire':
      return 3;
      break;
    case 'Nasale':
      return 4;
      break;
    case 'Inhalée':
      return 5;
      break;
    case 'Vaginale':
      return 6;
      break;
    case 'Oculaire':
      return 7;
      break;
    case 'Rectale':
      return 8;
      break;
    case 'Sous-cutanée':
      return 9;
      break;
    case 'Intra-musculaire':
      return 10;
      break;
    case 'Intra-veineux':
      return 11;
      break;
    case 'Intra-urétrale':
      return 12;
      break;
    default:
      return 0;
      break;
  }
}
