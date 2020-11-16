<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
  use HasFactory;
  use Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'name',
    'display_name',
    'email',
    'password',
    'admin',
    'status',
    'rpps',
    'approved_at',
  ];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = [
    'password',
    'remember_token',
    'created_at',
    'updated_at',
    'approved_at',
    'email_verified_at',
  ];

  /**
   * The attributes that should be cast to native types.
   *
   * @var array
   */
  protected $casts = [
    'admin' => 'boolean',
    'email_verified_at' => 'datetime',
  ];

  public function plans_prise()
  {
    return $this->hasMany(PlanPrise::class);
  }

  protected static function boot()
  {
    parent::boot();

    static::deleting(function ($user) {
      foreach ($user->plans_prise as $plan_prise) {
        $plan_prise->forceDelete();
      }
    });
  }
}
