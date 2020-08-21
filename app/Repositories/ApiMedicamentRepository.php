<?php

namespace App\Repositories;

use App\Models\ApiMedicament;
use Illuminate\Http\Request;

class ApiMedicamentRepository {

  private $root = "https://api.plandeprise.fr/api";

  public function find ($cis) {
    $response = $this->call_api("/medicaments/" . $cis);
    if ($response) {
      return new ApiMedicament($response);
    }
    return false;
  }

  public function search ($denomination) {
    return $this->call_api("/medicaments/?denomination=" . $denomination);
  }

  private function call_api ($query) {
    $curl = curl_init($this->root . $query);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    if ($httpcode !== 200) {
      return false;
    }
    return json_decode($response);
  }

}
