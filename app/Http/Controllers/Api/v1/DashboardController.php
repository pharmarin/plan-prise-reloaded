<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Medicament;
use App\Models\PlanPrise;
use App\Models\User;
use CloudCreativity\LaravelJsonApi\Encoder\Encoder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
  public function __construct()
  {
    //$this->middleware('admin');

    $locale = app()->getLocale();

    Carbon::setLocale($locale);
  }

  private function getEmptyMonths($number)
  {
    $start = \Carbon\Carbon::now();

    $dates = collect();

    for ($i = 0; $i <= $number; $i++) {
      $dates->put($start->isoFormat('MMMM YY'), 0);
      $start->subMonth();
    }

    return $dates;
  }

  private function getCountByMonth(Model $entity, int $months)
  {
    $stats = $entity
      ::select(
        DB::raw(
          'DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as total_count'
        )
      )
      ->where(
        'created_at',
        '>=',
        Carbon::now()
          ->subMonths($months)
          ->startOfMonth()
      )
      ->groupBy('month')
      ->get()
      ->mapWithKeys(function ($item) {
        return [
          Carbon::createFromIsoFormat('YYYY-MM', $item['month'])->isoFormat(
            'MMMM YY'
          ) => $item['total_count'],
        ];
      });

    return $this->getEmptyMonths($months)->merge($stats);
  }

  public function stats()
  {
    return Encoder::instance([])->encodeMeta([
      'medicaments' => [
        'total' => Medicament::count(),
        'latest' => Medicament::orderBy('created_at', 'desc')
          ->take(10)
          ->get(),
      ],
      'plan-prises' => [
        'total' => PlanPrise::count(),
        'stats' => $this->getCountByMonth(new PlanPrise(), 12)->reverse(),
      ],
      'users' => [
        'total' => User::count(),
        'stats' => $this->getCountByMonth(new User(), 6)->reverse(),
      ],
    ]);
  }
}
