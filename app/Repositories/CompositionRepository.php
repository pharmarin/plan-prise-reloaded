<?php

namespace App\Repositories;

class CompositionRepository
{

  private $compositionObject;
  private $compositionArray;

  public function __construct ($compositionObject)
  {
    $this->compositionObject = $compositionObject;
    $this->compositionArray = $this->parseObject($compositionObject);
  }

  public function getCISArray ()
  {
    return array_map(function ($composition) {
      return $composition->codeSubstance;
    }, $this->compositionArray);
  }

  public function getArray ()
  {
    return array_map(function ($composition) {
      return (object) [
        'codeSubstance' => 'S-' . $composition->codeSubstance,
        'denominationSubstance' => $composition->denominationSubstance,
        'dosageSubstance' => $composition->dosageSubstance
      ];
    }, $this->compositionArray);
  }

  public function getString () {
    return implode(array_map(function ($composition, $index) {
      return ($index === 0 ? "" : " + ") . implode(array_map(function ($word) {
        $word = mb_strtolower($word);
        switch ($word) {
          case 'de': case'(de': case'de)':
            return $word;
            break;
          case "base":
            return "";
            break;
          default:
            return str_replace('( ', '(', ucwords(str_replace('(', '( ', $word)));
            break;
        }
      }, explode(" ", $composition->denominationSubstance)), " ") . " (" . $composition->codeSubstance . ")";
    }, $this->compositionArray, array_keys($this->compositionArray)));
  }

  private function parseObject ()
  {
    $return = [];
    // Pour chaque forme pharmaceutique dans l'objet (ex : Actonel Combi contient sachets et comprimés)
    foreach ($this->compositionObject as $composition) {
      // Pour chaque PA dans la forme pharmaceutique
      foreach ($composition->substancesActives as $substanceActive) {
        // Pour chaque fraction thérapeutique s'il y en a une ou plusieurs
        if (!empty($substanceActive->fractionsTherapeutiques)) {
          foreach ($substanceActive->fractionsTherapeutiques as $fractionTherapeutique) {
            $return[] = $this->getSubstanceObject($fractionTherapeutique);
          }
        } else {
          $return[] = $this->getSubstanceObject($substanceActive);
        }
      }
    }
    return $return;
  }

  private function getSubstanceObject ($substance)
  {
    return (object) [
      'codeSubstance' => $substance->codeSubstance,
      'denominationSubstance' => $substance->denominationSubstance,
      'dosageSubstance' => $substance->dosageSubstance
    ];
  }

}
