@isset ($javascript)
  <script>
    window.php = {!! json_encode($javascript) !!};
  </script>
  <script src="http://localhost:8097"></script>
@endisset
