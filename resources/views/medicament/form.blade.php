@extends('layouts.app')

@section('title')
  @switch($action)
    @case('IMPORT')
      Import de {{ $old_medicament->nomMedicament }}
      @break
    @case('EDIT')
      Modification de {{ $medicament->custom_denomination }}
      @break
    @default
      Ajout d'un médicament
      @break
  @endswitch
@endsection

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
            Modification de {{ $medicament->custom_denomination }}
            @break
          @default
            Ajout d'un médicament
            @break
        @endswitch
      </h5>
      <div id="react-medicament"
      @if ($action == 'IMPORT')
        data-route="{{ route('medicament.store') }}?{{ http_build_query(app('request')->input('query')) }}"
        @elseif ($action == 'CREATE')
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
  <script type="text/javascript" src="{{ url(mix('js/medicament.js')) }}"></script>
@endsection
