@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">Import de {{ $old_medicament->nomMedicament }}</div>

        <div class="card-body">

          <h6>Correspondance dans la Base de Données Publique des Médicaments</h6>

          {!! Form::open(array('route' => array('medicament.create'), 'method' => 'GET')) !!}
            {!! Form::hidden('old_medicament', $old_medicament->id) !!}
            <div class="overflow-auto" style="max-height: 25vh;">
            @foreach ($api_search as $api_result)
              <div>
                {!! Form::checkbox('api_selected[]', $api_result->codeCIS) !!}
                {!! Form::label($api_result->codeCIS, $api_result->denomination) !!}
              </div>
            @endforeach
            </div>
            {!! Form::submit('Importer') !!}
          {!! Form::close() !!}

        </div>
      </div>
    </div>
  </div>
</div>
@endsection
