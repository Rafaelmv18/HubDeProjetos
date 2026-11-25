<?php

use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Configuração do Pest
|--------------------------------------------------------------------------
|
| Os testes em tests/Feature sobem a aplicação Laravel inteira (rotas, banco...)
| e rodam no PostgreSQL de verdade, no banco "hub_testes" (ver phpunit.xml).
|
| Quando os testes passarem a criar dados (Etapa 1), cada teste vai usar o
| RefreshDatabase, que desfaz tudo ao terminar, para um teste não afetar o outro.
|
*/

pest()->extend(TestCase::class)->in('Feature');
