@extends('layouts.app')

@section('title', "Importer depuis la base de données")

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">Importer depuis la base de données</div>

        <div class="card-body">

          {{ Form::open(['route' => 'medicament.import.process']) }}
            @foreach ($tables as $slug => $file)
              <div class="form-check">
                {!! Form::checkbox('tables[]', $slug, true, ['class' => 'form-check-input']) !!}
                {!! Form::label($slug, $file, ['class' => 'form-check-label']) !!}
              </div>
            @endforeach
            {{ Form::submit('Mettre à jour', ['class' => 'btn btn-danger']) }}
          {{ Form::close() }}

        </div>
      </div>
    </div>
  </div>
</div>
@endsection
