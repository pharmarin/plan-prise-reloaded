@extends('layouts.app')

@section('title', 'Recherche')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Rechercher un médicament</div>

                    <div class="card-body">

                      <form method="get" action="{{ route('medicament.search') }}">
                        <div class="form-group d-flex">
                          <input type="text" name="query" class="form-control" placeholder="Rechercher..." />
                          <button type="submit" class="btn btn-primary ml-2">Rechercher</button>
                        </div>
                      </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
