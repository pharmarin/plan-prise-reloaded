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
                            @forelse ($medicaments as $medicament)
                                <tr>
                                    <td>{{ $medicament->customDenomination }}</td>
                                    <td class="d-flex justify-content-end">
                                      <a href="{{ route('medicament.show', $medicament->id) }}" class="btn btn-success btn-sm ml-1">Voir</a>
                                      <a href="{{ route('medicament.edit', $medicament->id) }}" class="btn btn-warning btn-sm ml-1">Modifier</a>
                                      <form action="{{ route('medicament.destroy', $medicament->id) }}" method="POST">
                                        @csrf
                                        <input type="hidden" name="_method" value="DELETE"/>
                                        <button type="submit" class="btn btn-danger btn-sm ml-1">Supprimer</button>
                                      </form>
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
