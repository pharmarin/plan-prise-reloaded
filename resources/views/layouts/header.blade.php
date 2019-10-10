<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- CSRF Token -->
<meta name="csrf-token" content="{{ csrf_token() }}">

<!-- Medicament API route -->
<meta name="plan-prise-base-url" content="{{ str_replace('http://'.$_SERVER['HTTP_HOST'], '',  URL::to('/')).route('plan-prise.index', [], false) }}">
<meta name="medicament-api" content="{{ route('medicament.api.get') }}">
<meta name="medicament-custom" content="{{ route('medicament.custom.get') }}">
<meta name="plan-prise-api" content="{{ route('plan-prise.api') }}">

<title>@if(View::hasSection('title'))@yield('title') - @endif{{ config('app.name', 'Laravel') }}</title>

<!-- Fonts -->
<link rel="dns-prefetch" href="//fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">

<!-- Font-Awesome -->
<script src="https://kit.fontawesome.com/a8171fc0f6.js"></script>

<!-- Styles -->
<link href="{{ asset('css/app.css') }}" rel="stylesheet">

<!-- Scripts -->
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=String.prototype.startsWith,Array.from,Array.prototype.fill,Array.prototype.keys,Array.prototype.findIndex,Number.isInteger&flags=gated"></script>
