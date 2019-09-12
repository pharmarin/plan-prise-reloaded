@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">Import de médicaments @isset($old_medicaments) ({{ $old_medicaments->total() }}) @endisset</div>

        <div class="card-body">

          @if (isset($old_medicaments))
            <ul class="list-unstyled">
              @foreach ($old_medicaments as $old_medicament)
                <li>
                  <a href="{{ route('medicament.import.form', ['id' => $old_medicament->id, 'query' => app('request')->all()]) }}">{{ $old_medicament->nomMedicament }}</a>
                </li>
              @endforeach
            </ul>
            {{ $old_medicaments->appends(request()->input())->links() }}
          @else
            <form method="get" action="{{ route('medicament.import.search') }}" class="form-inline">
              <input type="text" name="query" class="form-control flex-fill" placeholder="Rechercher un médicament" />
              <button type="submit" name="get" value="search" class="mx-2 btn btn-primary">Rechercher</button>
              OU
              <button type="submit" name="get" value="all" class="mx-2 btn btn-primary">Tout rechercher</button>
            </form>
          @endif

        </div>
      </div>
    </div>
  </div>
</div>
@endsection
