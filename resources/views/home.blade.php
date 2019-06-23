@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">Que souhaitez-vous créer ? </div>

        <div class="card-body">

          @if (session('status'))
          <div class="alert alert-success" role="alert">
            {{ session('status') }}
          </div>
          @endif

          <div class="row text-center">
            <div class="col-sm-6">
              Créer un plan de prise
            </div>
            <div class="col-sm-6">
              Créer un calendrier de prise
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
@endsection
