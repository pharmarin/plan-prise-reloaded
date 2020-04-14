<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  @include('layouts.header')
</head>
<body>
  <div id="app"></div>
  <script type="text/javascript" src="{{ url(mix('js/app.js')) }}"></script>
</body>
</html>
