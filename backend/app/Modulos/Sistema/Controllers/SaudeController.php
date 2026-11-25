<?php

namespace App\Modulos\Sistema\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Responde se a API está no ar e se consegue falar com o banco de dados.
 *
 * É um controller "de uma ação só" (invokable): o método __invoke é chamado
 * quando a rota é acessada, sem precisar dar nome ao método.
 */
class SaudeController
{
    public function __invoke(): JsonResponse
    {
        try {
            DB::select('select 1');
        } catch (Throwable) {
            // Qualquer falha de conexão com o banco cai aqui
            return response()->json([
                'status' => 'erro',
                'banco' => 'fora do ar',
            ], 503);
        }

        return response()->json([
            'status' => 'ok',
            'banco' => 'ok',
        ]);
    }
}
