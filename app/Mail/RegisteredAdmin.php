<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class RegisteredAdmin extends Mailable implements ShouldQueue
{
  use Queueable, SerializesModels;

  public User $user;

  /**
   * Create a new message instance.
   *
   * @return void
   */
  public function __construct(User $user)
  {
    $this->user = $user;
  }

  /**
   * Build the message.
   *
   * @return $this
   */
  public function build()
  {
    $mail = $this->subject(
      'Inscription en attente sur plandeprise.fr'
    )->markdown('emails.registered-admin');

    if ($this->user->status === 'student') {
      $mail->attachFromStorage('school_certs/' . $this->user->id);
    }

    return $mail;
  }
}
