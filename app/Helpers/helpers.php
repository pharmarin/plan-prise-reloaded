<?php

function mix_routes ($custom = [])
{

  return (object) array_merge($custom, array_map_r(function ($string) {
    return route($string);
  }, Config::get('customRoutes')));

}

function array_map_r ($func, $arr)
{
    $newArr = array();

    foreach( $arr as $key => $value )
    {
        $newArr[ $key ] = ( is_array( $value ) ? array_map_r( $func, $value ) : ( is_array($func) ? call_user_func_array($func, $value) : $func( $value ) ) );
    }

    return $newArr;
}
