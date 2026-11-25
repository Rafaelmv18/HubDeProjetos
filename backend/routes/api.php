<?php

/*
|--------------------------------------------------------------------------
| Rotas da API
|--------------------------------------------------------------------------
|
| Todas as rotas da API começam com /api (ex.: /api/saude).
| O React chama essas rotas pelo Vite, que as repassa ao Laravel (D30).
|
| Este arquivo é só o índice: cada módulo guarda as próprias rotas em
| app/Modulos/<Modulo>/rotas.php, junto do código que as atende (D42).
| Módulo novo com rotas = uma linha nova aqui.
|
*/

require app_path('Modulos/Sistema/rotas.php');
