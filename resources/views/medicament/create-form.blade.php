@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-10">
      <div id="react-create-medicament" data-csrf="{{ csrf_token() }}" data-api="{{ route('medicament.api') }}" data-route="{{ route('medicament.store') }}"></div>
    </div>
  </div>
</div>
@endsection

@section('scripts')
  <script type="text/javascript" src="{{ asset('js/medicament-create.js') . (App::Environment('local') ? '?rand=' . rand() : '') }}"></script>
@endsection
