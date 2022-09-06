<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class UsuarioController extends Controller
{
    public function notificaciones(){
        $unreadCount = auth()->user()->unreadNotifications->count();
        $notificaciones = DB::table('notifications')->where('notifiable_id', auth()->user()->id)->paginate();
        return response()->json(['data' => $notificaciones, 'unread_count' => $unreadCount], 200);
    }

    public function marcarComoLeido(){
        auth()->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Se han marcado todas como leídas.'], 200);
    }
}
