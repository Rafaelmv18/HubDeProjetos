<?php

use Illuminate\Support\Facades\DB;

use function Pest\Laravel\getJson;

/*
| Rota de saúde: GET /api/saude
|
| Mostra se a API está no ar e se ela consegue falar com o banco de dados.
| É a primeira resposta da API que o React vai mostrar (Etapa 0).
*/

it('responde que a API e o banco estão funcionando', function () {
    getJson('/api/saude')
        ->assertOk()
        ->assertExactJson([
            'status' => 'ok',
            'banco' => 'ok',
        ]);
});

it('avisa com o status 503 quando o banco está fora do ar', function () {
    // Simula o banco fora do ar: aponta a conexão para uma porta onde nada responde
    config(['database.connections.pgsql.port' => 1]);
    DB::purge('pgsql');

    getJson('/api/saude')
        ->assertStatus(503)
        ->assertExactJson([
            'status' => 'erro',
            'banco' => 'fora do ar',
        ]);
});
