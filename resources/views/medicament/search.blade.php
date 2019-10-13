@extends('layouts.app')

@section('title', 'Recherche')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header">Rechercher un médicament</div>

                    <div class="card-body">

                      <form method="get" action="{{ route('medicament.search') }}">
                        <div class="form-group d-flex">
                          <div class="input-group">
                            <input type="text" name="query" class="form-control" placeholder="Rechercher..." value="{{ request()->get('query') }}" />
                            <div class="input-group-append">
                              <button type="submit" class="btn btn-primary">Rechercher</button>
                            </div>
                          </div>
                        </div>
                      </form>

                      @isset ($medicaments)
                        <div>
                          @include('medicament.table')
                        </div>
                      @endisset

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
