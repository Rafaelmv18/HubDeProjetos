<?php

use App\Modulos\Conta\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertAuthenticatedAs;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\postJson;

/*
| US01 Criar conta
|
| O visitante envia nome, e-mail e senha para POST /api/conta.
| A API confere os dados (nunca confia no que chega), grava o usuário
| e já o deixa logado.
|
| Critérios de aceite (requisitos.html):
|  - o e-mail é único, com erro claro se já existir;
|  - a senha tem no mínimo 8 caracteres, pelo menos um caractere especial
|    e é salva com hash (RNF01);
|  - após o cadastro, o usuário já está logado.
*/

uses(RefreshDatabase::class);

/**
 * Dados válidos de um cadastro. Cada teste troca só o campo que quer testar.
 *
 * @param  array<string, mixed>  $trocas
 * @return array<string, mixed>
 */
function dadosDeCadastro(array $trocas = []): array
{
    return array_merge([
        'name' => 'Ana Souza',
        'email' => 'ana@exemplo.com',
        'password' => 'senha-segura-123',
    ], $trocas);
}

// ---------------------------------------------------------------------------
// Caminho feliz
// ---------------------------------------------------------------------------

it('cria a conta e responde 201 com os dados do usuário', function () {
    postJson('/api/conta', dadosDeCadastro())
        ->assertCreated()
        ->assertJsonPath('usuario.name', 'Ana Souza')
        ->assertJsonPath('usuario.email', 'ana@exemplo.com')
        ->assertJsonStructure(['usuario' => ['id', 'name', 'email']]);

    assertDatabaseHas('users', ['email' => 'ana@exemplo.com']);
});

it('nunca devolve a senha na resposta', function () {
    postJson('/api/conta', dadosDeCadastro())
        ->assertCreated()
        ->assertJsonMissingPath('usuario.password');
});

it('usa uuid como id do usuário', function () {
    $id = postJson('/api/conta', dadosDeCadastro())->json('usuario.id');

    expect($id)->toBeString()->toBeUuid();
});

it('salva a senha com hash, nunca em texto puro', function () {
    postJson('/api/conta', dadosDeCadastro(['password' => 'senha-segura-123']));

    $user = User::query()->where('email', 'ana@exemplo.com')->firstOrFail();

    expect($user->password)->not->toBe('senha-segura-123')
        ->and(Hash::check('senha-segura-123', $user->password))->toBeTrue();
});

it('deixa o usuário logado logo após o cadastro', function () {
    postJson('/api/conta', dadosDeCadastro());

    $user = User::query()->where('email', 'ana@exemplo.com')->firstOrFail();

    assertAuthenticatedAs($user);
});

it('guarda o e-mail em minúsculas', function () {
    postJson('/api/conta', dadosDeCadastro(['email' => 'Ana@Exemplo.COM']))
        ->assertCreated()
        ->assertJsonPath('usuario.email', 'ana@exemplo.com');

    assertDatabaseHas('users', ['email' => 'ana@exemplo.com']);
});

// ---------------------------------------------------------------------------
// E-mail único
// ---------------------------------------------------------------------------

it('recusa um e-mail que já tem conta, com mensagem clara', function () {
    User::factory()->create(['email' => 'ana@exemplo.com']);

    postJson('/api/conta', dadosDeCadastro())
        ->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'Este e-mail já está em uso.');

    assertDatabaseCount('users', 1);
    assertGuest();
});

it('trata maiúsculas e minúsculas como o mesmo e-mail', function () {
    User::factory()->create(['email' => 'ana@exemplo.com']);

    postJson('/api/conta', dadosDeCadastro(['email' => 'ANA@exemplo.com']))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);

    assertDatabaseCount('users', 1);
});

// ---------------------------------------------------------------------------
// Validação dos campos
// ---------------------------------------------------------------------------

it('recusa senha com menos de 8 caracteres', function () {
    // 7 caracteres, já com um especial: o único problema é o tamanho
    postJson('/api/conta', dadosDeCadastro(['password' => 'abc-123']))
        ->assertUnprocessable()
        ->assertJsonPath('errors.password.0', 'A senha precisa ter pelo menos 8 caracteres.');

    assertDatabaseCount('users', 0);
});

it('recusa senha sem caractere especial', function () {
    // Tamanho de sobra: o único problema é não ter um caractere especial
    postJson('/api/conta', dadosDeCadastro(['password' => 'senhasegura123']))
        ->assertUnprocessable()
        ->assertJsonPath('errors.password.0', 'A senha precisa ter pelo menos um caractere especial.');

    assertDatabaseCount('users', 0);
});

it('aceita senha com exatamente 8 caracteres e um especial', function () {
    postJson('/api/conta', dadosDeCadastro(['password' => 'abcd-123']))
        ->assertCreated();
});

it('recusa o cadastro quando falta um campo obrigatório', function (string $campo) {
    postJson('/api/conta', dadosDeCadastro([$campo => '']))
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$campo]);

    assertDatabaseCount('users', 0);
})->with(['name', 'email', 'password']);

it('recusa e-mail com formato inválido', function () {
    postJson('/api/conta', dadosDeCadastro(['email' => 'isto-nao-e-email']))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);

    assertDatabaseCount('users', 0);
});

it('recusa nome com mais de 255 caracteres', function () {
    postJson('/api/conta', dadosDeCadastro(['name' => str_repeat('a', 256)]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

it('ignora campos que não fazem parte do cadastro', function () {
    $id = postJson('/api/conta', dadosDeCadastro(['id' => 'id-escolhido-pelo-visitante']))
        ->assertCreated()
        ->json('usuario.id');

    expect($id)->not->toBe('id-escolhido-pelo-visitante');
});

// ---------------------------------------------------------------------------
// Só visitantes criam conta
// ---------------------------------------------------------------------------

it('não deixa quem já está logado criar outra conta', function () {
    actingAs(User::factory()->create());

    postJson('/api/conta', dadosDeCadastro())
        ->assertForbidden();

    assertDatabaseCount('users', 1);
});
