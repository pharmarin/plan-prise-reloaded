<?php

return [
  'secret' => env('CAPTCHA_SECRET_KEY'),
  'sitekey' => env('REACT_APP_CAPTCHA_SITE_KEY'),
  'options' => [
    'timeout' => 30,
  ],
];
