@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Bienvenue</div>

                <div class="card-body">
                  <p>
                    Passez moins de temps à préparer des plans de prise et plus de temps avec votre patient. Ce site a pour but de faciliter la réalisation de plans de prise à l'officine.
                    Nous vous permettons ainsi de créer des plans de prise personnalisés, rapidement, et sans efforts.
                  </p>
                  <p>
                    Grâce à des commentaires pré-remplis, la réalisation de plans de prise devient plus rapide avec <?= $_SERVER['SERVER_NAME'] ?>.
                    Et tout cela gratuitement.
                  </p>
                  <p>
                    Ce site est le fruit du travail de thèse de Marion BELACHE et Marin ROUX, sous la direction de Béatrice BELLET (maître de conférence associé en pharmacie clinique à l'UFR de pharmacie de Grenoble).
                  </p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
