@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Liste des utilisateurs</div>

                    <div class="card-body">

                        @if (session('message'))
                            <div class="alert alert-success" role="alert">
                                {{ session('message') }}
                            </div>
                        @endif

                        <table class="table">
                            <tr>
                                <th>Nom d'utilisateur</th>
                                <th>Nom affiché</th>
                                <th>Email</th>
                                <th>Date d'inscription</th>
                                <th></th>
                            </tr>
                            @forelse ($users as $user)
                                <tr>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->displayName }}</td>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ $user->created_at }}</td>
                                    <td>
                                      @if ($user->admin)
                                        <i class="fa fa-user-lock"></i>
                                      @endif
                                      @if (!$user->approved_at)
                                        <a href="{{ route('admin.users.approve', $user->id) }}" class="btn btn-primary btn-sm">Activer</a>
                                      @endif
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4">Aucun utilisateur. </td>
                                </tr>
                            @endforelse
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
