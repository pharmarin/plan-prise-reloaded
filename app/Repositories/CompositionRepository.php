<?php

namespace App\Repositories;

class CompositionRepository
{

  public $composition_parsed;

  public function __construct ($composition_object)
  {
    $this->composition_parsed = $this->_parseObject($composition_object->groupBy('pivot'));
  }

  public function toArray ()
  {
    return $this->composition_parsed->map(function ($composition) {
      return (object) [
        'code_substance' => $composition['code_substance'],
        'denomination_substance' => $composition['denomination_substance']
      ];
    });
  }

  public function toString () {
    return $this->composition_parsed->map(function ($item) {
      return $item['denomination_substance'];//trim(preg_split('/[()]+/', $item['denomination_substance'])[0]);
    })->implode(' + ');
  }

  public function merge (CompositionRepository $composition)
  {
    foreach ($composition->composition_parsed as $new_key => $new_parsed) {
      foreach ($this->composition_parsed as $previous_key => $previous_parsed) {
        if ($previous_parsed['denomination_substance'] == $new_parsed['denomination_substance'] || !$previous_parsed['code_substance']->intersect($new_parsed['code_substance'])->isEmpty()) {
          $this->composition_parsed[$previous_key]['code_substance'] = $previous_parsed['code_substance']->merge($new_parsed['code_substance'])->unique()->sort();
          continue 2;
        } else {
          $need_push = $new_parsed;
        }
      }
      if (isset($need_push)) {
        $this->composition_parsed->push($need_push);
        unset($need_push);
      }
    }
    return $this;
  }

  private function _parseObject ($composition_object)
  {
    $return = [];
    // Pour chaque forme pharmaceutique dans l'objet (ex : Actonel Combi contient sachets et comprimés)
    foreach ($composition_object as $composition) {
      // Pour chaque PA dans la forme pharmaceutique
      $tmp_denomination = "";
      $tmp_codes = [];
      foreach ($composition as $substance_active) {
        switch ($substance_active->nature_composant) {
          case 'FT':
            $tmp_denomination = $substance_active->denomination_substance;
          case 'SA':
            $tmp_denomination = $tmp_denomination === "" ? $substance_active->denomination_substance : $tmp_denomination;
            $tmp_codes[] = $substance_active->code_substance;
            break;
          default:
            # code...
            break;
        }
      }
      $return[] = collect([
        'code_substance' => collect($tmp_codes),
        'denomination_substance' => $tmp_denomination
      ]);
    }
    return collect($return);
  }

  private function _codeArrayToString ($code_array)
  {
    return $code_array->sort()->map(function ($code) {
      return 'S-' . $code;
    })->implode('+');
  }

}
