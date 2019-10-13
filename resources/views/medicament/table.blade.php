<table class="table">
  @forelse ($medicaments as $medicament)
  <tr>
    @foreach ($columns as $key)
      <td>
        @if (is_object($medicament[$key]))
          {!! $medicament[$key]->getDisplay($key) !!}
        @else
          {{ $medicament[$key] }}
        @endif
      </td>
    @endforeach
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
{{ $medicaments->links() }}
