@extends('layouts.app')

@section('content')
  <div id="react-plan-prise"></div>
@endsection

@section('scripts')
  <script type="text/javascript" src="{{ asset('js/plan-prise.js') }}@if (isset($debug) && $debug === true)?rand={{ rand() }}@endif"></script>
@endsection
