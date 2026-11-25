<?php

use function Pest\Laravel\get;

/*
| Sanctum no modo cookie (D33)
|
| Antes de entrar ou criar conta, o React chama esta rota para receber o
| cookie XSRF-TOKEN. Esse código volta em cada chamada que altera dados e
| prova que ela saiu da nossa página, e não de outro site (proteção CSRF).
|
| A rota fica debaixo de /api (o padrão do Sanctum é /sanctum/csrf-cookie)
| para o proxy do Vite alcançá-la com a mesma regra do resto da API.
*/

it('entrega o cookie de CSRF em /api/sanctum/csrf-cookie', function () {
    get('/api/sanctum/csrf-cookie')
        ->assertNoContent()
        ->assertCookie('XSRF-TOKEN');
});

it('não deixa a rota no endereço padrão, fora de /api', function () {
    get('/sanctum/csrf-cookie')->assertNotFound();
});
