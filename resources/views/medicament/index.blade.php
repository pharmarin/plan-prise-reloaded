@extends('layouts.app')

@section('title')
  @if (request()->get('query'))
    Résultats de la recherche pour "{{ request()->get('query') }}"
  @else
    Tous les médicaments
  @endif
@endsection

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Médicaments ({{ $medicaments->total() }})</div>

                    <div class="card-body">

                        @if (session('message'))
                            <div class="alert alert-success" role="alert">
                                {{ session('message') }}
                            </div>
                        @endif

                        @include('medicament.table')
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
