@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-10">
      <h5>
      @switch($action)
          @case('IMPORT')
            Import de {{ $old_medicament->nomMedicament }}
            @break
          @case('EDIT')
            Modification de {{ $medicament->customDenomination }}
            @break
          @default
            Ajout d'un médicament
            @break
        @endswitch
              </h5>
      <div id="react-medicament"
        data-api="{{ route('medicament.api.get') }}"
      @if ($action == 'test')
        data-route="{{ route('medicament.store') }}&{{ /*http_build_query(app('request')->input('query'))*/ }}"
        @elseif ($action == 'CREATE' || $action == 'IMPORT')
            data-route="{{ route('medicament.store') }}"
      @elseif ($action == 'EDIT')
        data-route="{{ route('medicament.update', $medicament->id) }}"
        data-edit="{{ $medicament->toJson() }}"
      @endif
      @if ($action == 'IMPORT')
        data-old_medicament='{{ json_encode($old_medicament) }}'
      @endif
      ></div>
    </div>
  </div>
</div>
@endsection

@section('scripts')
  <script type="text/javascript" src="{{ asset('js/medicament.js') }}@isset($debug)?rand={{ rand() }}@endisset"></script>
@endsection
