<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  @include('layouts.header')
</head>
<body>
  <div id="app">
    @if (!isset($print) || $print !== true)
      @include('layouts.navbar')
    @endif
    <main class="py-4">
      @yield('content')
    </main>
  </div>
  @include('layouts.footer')
  @yield('scripts')
</body>
</html>
