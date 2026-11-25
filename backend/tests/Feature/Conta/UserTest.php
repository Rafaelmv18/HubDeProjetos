<?php

use App\Modulos\Conta\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;

/*
| Model User, dentro do módulo Conta (D36)
|
| O Laravel espera o User em app/Models. Como o nosso mora em
| app/Modulos/Conta/Models, estes testes garantem que as duas ligações
| que dependiam do lugar antigo continuam funcionando: a factory
| (usada para criar usuários nos testes) e a configuração de autenticação.
*/

uses(RefreshDatabase::class);

it('cria um usuário no banco pela factory', function () {
    $user = User::factory()->create(['email' => 'ana@exemplo.com']);

    expect($user)->toBeInstanceOf(User::class);
    assertDatabaseHas('users', ['email' => 'ana@exemplo.com']);
});

it('guarda a senha embaralhada, nunca em texto puro', function () {
    $user = User::factory()->create(['password' => 'segredo-123']);

    expect($user->password)->not->toBe('segredo-123');
});

it('é o model que a autenticação do Laravel usa', function () {
    expect(config('auth.providers.users.model'))->toBe(User::class);
});
