@extends('layouts.app')

@section('title')
  Modifier {{ $composition->denomination }}
@endsection

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Modifier {{ $composition->denomination }}</div>

                    <div class="card-body">

                        @if (session('message'))
                            <div class="alert alert-success" role="alert">
                                {{ session('message') }}
                            </div>
                        @endif

                        {!! Form::open(['route' => ['api.composition.update', $composition->id], 'method' => 'put']) !!}
                        <div class="form-group">
                          {!! Form::label('denomination', 'Dénomination') !!}
                          {!! Form::text('denomination', $composition->denomination, ['class' => 'form-control']) !!}
                        </div>
                        {!! Form::submit('Modifier', ['class' => 'btn btn-warning']) !!}
                        {!! Form::close() !!}

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
