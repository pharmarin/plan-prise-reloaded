@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item active" aria-current="page">
                    <a href="{{ route('medicament.index') }}" class="text-decoration-none text-secondary"><i class="fa fa-arrow-left"></i> Retour à la liste des médicaments</a>
                  </li>
                </ol>
              </nav>

                <div class="card">
                    <div class="card-header">
                      <h3>{{ $medicament->customDenomination }}</h3>
                      <p class="text-muted font-italic mb-0">
                          @foreach ($medicament->composition as $code => $substance)
                              {{ $substance }} ({{ $code }})
                          @endforeach
                      </p>
                    </div>

                    <div class="card-body">

                      <div class="row">
                        <div class="col-sm-4 text-secondary text-right">Indications</div>
                        <div class="col-sm-8">
                          <ul class="list-unstyled">
                            @foreach ($medicament->indications as $indication)
                              <li>{{ $indication }}</li>
                            @endforeach
                          </ul>
                        </div>

                        <div class="col-sm-4 text-secondary text-right">Température de conservation</div>
                        <div class="col-sm-8">
                          {{ $medicament->conservationFrigo ? "Au frigo" : "Température ambiante" }}
                        </div>

                        @if ($medicament->conservationDuree !== null)
                          <div class="col-sm-4 text-secondary text-right">Durée de conservation après ouverture</div>
                          <div class="col-sm-8">
                            @foreach ($medicament->conservationDuree as $conservation)
                              {{ $conservation->duree }} ({{ $conservation->laboratoire }})
                            @endforeach
                          </div>
                        @endif

                        <div class="col-sm-4 text-secondary text-right">Voie d'administration</div>
                        <div class="col-sm-8">
                          <ul class="list-unstyled">
                            @foreach ($medicament->voiesAdministrationString as $voieAdministration)
                              <li>{{ $voieAdministration }}</li>
                            @endforeach
                          </ul>
                        </div>

                        <div class="col-sm-4 text-secondary text-right">Commentaires par défaut</div>
                        <div class="col-sm-8">
                          <ul class="list-unstyled">
                            @foreach ($medicament->precautions as $precaution)
                              <li>
                                <small class="text-muted text-small">{{ $precaution->option }}</small>
                                <div>{{ $precaution->commentaire }}</div>
                              </li>
                            @endforeach
                          </ul>
                        </div>

                        <div class="col-sm-4 text-secondary text-right">CIP</div>
                        <div class="col-sm-8">
                          <ul class="list-unstyled">
                            @foreach ($medicament->bdpm as $medicamentAPI)
                              @foreach ($medicamentAPI->cip as $cip)
                                <li>
                                  {{ $cip->CIP7 }}, {{ $cip->CIP13 }} ({{ $medicamentAPI->titulaire }})
                                </li>
                              @endforeach
                            @endforeach
                          </ul>
                        </div>
                    </div>

                    <a href="{{ route('medicament.edit', $medicament->id) }}" class="btn btn-warning btn-sm float-right">Modifier</a>
                  </div>
                </div>
            </div>
        </div>
    </div>
@endsection
