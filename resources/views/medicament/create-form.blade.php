@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-10">
      <div id="react-app" data-csrf="{{ csrf_token() }}" data-view="ImportMedicament" data-route="{{ route('medicament.store') }}" data-api_selected_detail='{{ json_encode($api_selected_detail) }}' data-old_medicament='{{ json_encode($old_medicament) }}'></div>
    </div>
  </div>
</div>
@endsection

@section('scripts')
  <script type="text/javascript" src="{{ asset('js/app.js') . (App::Environment('local') ? "?rand=" . rand() : "") }}"></script>
@endsection
