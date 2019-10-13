@isset ($javascript)
  <script>
    window.php = {!! json_encode($javascript) !!};
  </script>
@endisset
