<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;

class ExtendCollectionProvider extends ServiceProvider
{
  /**
   * Register services.
   *
   * @return void
   */
  public function register()
  {
    Collection::macro('getDisplay', function ($inputName = '') {
      if ($inputName !== '') {
        $config = Config::get('inputs.default')[$inputName];
        $display = isset($config['display'])
          ? $config['display']
          : array_keys($config['inputs'])[0];
        $array = $this->map(function ($value) use ($display) {
          return $value->{$display};
        });
        $return = "<ul class='list-unstyled'>";
        foreach ($array as $string) {
          $return .= '<li>' . $string . '</li>';
        }
        $return .= '</ul>';
        return $return;
      }
    });
  }

  /**
   * Bootstrap services.
   *
   * @return void
   */
  public function boot()
  {
  }
}
