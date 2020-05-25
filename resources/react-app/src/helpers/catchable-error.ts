export default class CatchableError extends Error {
  constructor(params: any) {
    // Passer les arguments restants (incluant ceux spécifiques au vendeur) au constructeur parent
    super(params);

    // Maintenir dans la pile une trace adéquate de l'endroit où l'erreur a été déclenchée (disponible seulement en V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CatchableError);
    }

    this.name = 'CatchableError';
  }
}
