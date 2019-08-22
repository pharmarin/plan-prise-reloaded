@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-10">
      <h5>Import de {{ $old_medicament->nomMedicament }}</h5>
      <div id="react-import-medicament" data-csrf="{{ csrf_token() }}" data-api="{{ route('medicament.api') }}" data-route="{{ route('medicament.store') }}" data-old_medicament='{{ json_encode($old_medicament) }}'></div>
    </div>
  </div>
</div>
@endsection

@section('scripts')
  <script type="text/javascript" src="{{ asset('js/medicament-import.js') . (App::Environment('local') ? '?rand=' . rand() : '') }}"></script>
@endsection
