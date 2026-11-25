<?php

use App\Modulos\Sistema\Controllers\SaudeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rotas do módulo Sistema
|--------------------------------------------------------------------------
|
| Este arquivo é carregado pelo routes/api.php, então todas as rotas
| daqui começam com /api (ex.: /api/saude).
|
*/

// Mostra se a API e o banco estão funcionando
Route::get('/saude', SaudeController::class);
