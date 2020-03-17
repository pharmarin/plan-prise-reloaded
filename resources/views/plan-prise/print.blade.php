<div class="print">
  @if (count($medicaments) > 0)
    <table id="plan-prise" class="table table-bordered">
      <thead>
        <tr>
          <th>
            Médicament
          </th>
          @foreach ($columns as $column)
            <th>{{ $column['label'] }}</th>
          @endforeach
        </tr>
      </thead>
      <tbody>
        @foreach ($medicaments as $medicament)
          <tr>
            <td>
              <div>
                {{ $medicament->denomination }}
              </div>
              <div class="text-muted font-italic">
                {{ $medicament->compositions }}
              </div>
              <div class="text-muted font-italic">
                (Voie {{ $medicament->voies_administration }})
              </div>
              @if ($medicament->conservation_frigo === 1)
                <small class="text-muted font-italic">
                  Se conserve au réfrigérateur
                </small>
              @endif
            </td>
            @foreach ($columns as $column)
              <td {{ $column['id'] == 'precautions' ? 'style="width: 20%;"' : "" }}>
                @isset($medicament->{$column['id']})
                  @if (is_array($medicament->{$column['id']}))
                    @foreach ($medicament->{$column['id']} as $item)
                      <div>{{ $item }}</div>
                    @endforeach
                  @else
                    {{ $medicament->{$column['id']} }}
                  @endif
                @endisset
              </td>
            @endforeach
          </tr>
        @endforeach
      </tbody>
    </table>
  @else
    <p>
      Ce plan de prise ne contient pas de médicament.
    </p>
    <a href="{{ route('plan-prise.index') }}">Retour</a>
  @endif
</div>
