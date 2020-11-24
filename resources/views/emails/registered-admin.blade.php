@component('mail::message')
# Inscription en attente de validation

Bonjour, 

Une nouvelle inscription est en attente de validation sur [plandeprise.fr](https://www.plandeprise.fr). 


@component('mail::panel')
Détails du nouvel inscrit : 
 - Nom : {{ $user->name }}
 - Structure : {{ $user->display_name }}
 - Statut : @if ($user->status === "pharmacist") Pharmacien @else Étudiant @endif

 @if ($user->status === "pharmacist")
 - RPPS : [{{ $user->rpps }}](http://www.ordre.pharmacien.fr/annuaire/pharmacien?search=pharmacist&lastname={{ $user->last_name }}&institution=&maiden=&date=&firstname={{ $user->first_name }}&zipcode=&city=&op=Rechercher&institution-mobile=&date-mobile=&zipcode-mobile=&city-mobile=)
 @endif
@endcomponent

@endcomponent