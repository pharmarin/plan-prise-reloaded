@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">Import de médicaments</div>

        <div class="card-body">

          @foreach ($old_medicaments as $old_medicament)

            <a href="{{ url()->current() . '/' . $old_medicament->id }}">{{ $old_medicament->nomMedicament }}</a>
            <br />


          @endforeach

          {{ $old_medicaments->links() }}

          {{ var_dump($old_medicaments->first()) }}

        </div>
      </div>
    </div>
  </div>
</div>
@endsection
