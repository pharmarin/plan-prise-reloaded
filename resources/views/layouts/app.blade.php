<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  @include('layouts.header')
</head>
<body>
  <div id="app">
    @include('layouts.navbar')
    <main class="py-4">
      @yield('content')
    </main>
  </div>
  <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>
  @yield('scripts')
</body>
</html>
