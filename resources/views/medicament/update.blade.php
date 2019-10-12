@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-10">
      <h5>Mise à jour des médicaments depuis la <em>Base de données publique des médicaments</em></h5>
      <div id="react-medicament-update"
        data-api="{{ route('medicament.api.update') }}"
        ></div>
    </div>
  </div>
</div>
@endsection

@section('scripts')
  <script type="text/javascript" src="{{ url(mix('js/medicament-update.js')) }}"></script>
@endsection
