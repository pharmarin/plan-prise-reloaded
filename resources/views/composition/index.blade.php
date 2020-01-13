@extends('layouts.app')

@section('title')
  Liste des substances actives
@endsection

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Substances actives ({{ $compositions->total() }})</div>

                    <div class="card-body">

                        @if (session('message'))
                            <div class="alert alert-success" role="alert">
                                {{ session('message') }}
                            </div>
                        @endif

                        <table class="table">
                          @forelse ($compositions as $composition)
                          <tr>
                            <td>
                              {{ $composition->denomination }} ({{ $composition->loadCount('medicaments')->medicaments_count }})
                            </td>
                            <td class="d-flex justify-content-end">
                              <a href="{{ route('composition.edit', $composition->id) }}" class="btn btn-warning btn-sm ml-1">Modifier</a>
                              {!! Form::open(['route' => ['api.composition.destroy', $composition->id], 'method' => 'delete']) !!}
                              {!! Form::submit('Supprimer', ['class' => 'btn btn-danger btn-sm ml-1']) !!}
                              {!! Form::close() !!}
                            </td>
                          </tr>
                          @empty
                          <tr>
                            <td colspan="4">Pas de substance active...</td>
                          </tr>
                          @endforelse
                        </table>
                        {{ $compositions->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
