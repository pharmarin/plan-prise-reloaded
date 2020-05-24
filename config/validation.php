<?php return [
  "email_create" => "required|string|email|max:255|unique:users",
  "email" => "required|string|email|max:255",
  "password_create" => "required|string|min:8|confirmed",
  "password" => "required|string|min:8|confirmed"
];