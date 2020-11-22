<?php

namespace App\Listeners;

use App\Mail\Registered as MailRegistered;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendRegisterConfirmation implements ShouldQueue
{
  /**
   * Create the event listener.
   *
   * @return void
   */
  public function __construct()
  {
    //
  }

  /**
   * Handle the event.
   *
   * @param  Registered  $user
   * @return void
   */
  public function handle(Registered $event)
  {
    Mail::to($event->user->email)->send(new MailRegistered());
  }
}
