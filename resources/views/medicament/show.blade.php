@extends('layouts.app')

@section('title', $medicament->custom_denomination)

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
                      <h4>{{ $medicament->custom_denomination }}</h4>
                      <ul class="list-unstyled mb-0">
                        @foreach ($medicament->compositions->getArray() as $substance)
                            <li class="text-muted font-italic">{{ $substance->denominationSubstance }} ({{ $substance->codeSubstance }})</li>
                        @endforeach
                      </ul>
                    </div>

                    <div class="card-body">

                      <div class="row">
                        @if ($medicament->indications)
                          <div class="col-sm-4 text-secondary text-right">Indications</div>
                          <div class="col-sm-8">
                            <ul class="list-unstyled">
                              @foreach ($medicament->indications as $indication)
                                <li>{{ $indication }}</li>
                              @endforeach
                            </ul>
                          </div>
                        @endif

                        <div class="col-sm-4 text-secondary text-right">Température de conservation</div>
                        <div class="col-sm-8">
                          {{ $medicament->conservation_frigo ? "Au frigo" : "Température ambiante" }}
                        </div>

                        @if ($medicament->conservation_duree)
                          <div class="col-sm-4 text-secondary text-right">Durée de conservation après ouverture</div>
                          <div class="col-sm-8">
                            <ul class="list-unstyled">
                              @foreach ($medicament->conservation_duree as $conservation)
                                <li>{{ $conservation->duree }} ({{ $conservation->laboratoire }})</li>
                              @endforeach
                            </ul>
                          </div>
                        @endif

                        @if ($medicament->voiesAdministrationString)
                          <div class="col-sm-4 text-secondary text-right">Voie d'administration</div>
                          <div class="col-sm-8">
                            <ul class="list-unstyled">
                              @foreach ($medicament->voiesAdministrationString as $voieAdministration)
                                <li>{{ $voieAdministration }}</li>
                              @endforeach
                            </ul>
                          </div>
                        @endif

                        @if ($medicament->precautions)
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
                        @endif

                        @if ($medicament->bdpm)
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
                        @endif
                    </div>

                    <a href="{{ route('medicament.edit', $medicament->id) }}" class="btn btn-warning btn-sm float-right">Modifier</a>
                  </div>
                </div>
            </div>
        </div>
    </div>
@endsection
