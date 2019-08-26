@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Médicaments</div>

                    <div class="card-body">

                        @if (session('message'))
                            <div class="alert alert-success" role="alert">
                                {{ session('message') }}
                            </div>
                        @endif

                        <table class="table">
                            <tr>
                                <th>Médicament</th>
                                <th></th>
                            </tr>
                            @forelse ($medicaments as $medicament)
                                <tr>
                                    <td>{{ $medicament->customDenomination }}</td>
                                    <td>
                                      <a href="{{ route('medicament.show', $medicament->id) }}" class="btn btn-success btn-sm">Voir</a>
                                      <a href="{{ route('medicament.edit', $medicament->id) }}" class="btn btn-warning btn-sm">Modifier</a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4">Pas de médicament...</td>
                                </tr>
                            @endforelse
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
