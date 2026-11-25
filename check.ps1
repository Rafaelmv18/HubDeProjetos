# check.ps1 — confere o projeto inteiro com um comando só.
#
# Como usar (na raiz do projeto, com o Docker no ar):
#     .\check.ps1
#
# O que ele faz: roda, um por um, a formatação, a análise e os testes
# do back-end e do front-end. Ele SÓ CONFERE: não conserta nenhum arquivo.
# No fim mostra um resumo. Se qualquer etapa falhar, termina com erro.

# Garante que os comandos rodem na raiz do projeto,
# mesmo se o script for chamado de outra pasta.
Push-Location $PSScriptRoot

# A lista de verificações. Cada linha diz em qual serviço do Docker rodar
# (api = Laravel, web = React) e qual comando rodar lá dentro.
$etapas = @(
    @{ Lado = 'Back-end';  Nome = 'Formatação (Pint)';           Servico = 'api'; Comando = @('vendor/bin/pint', '--test') },
    @{ Lado = 'Back-end';  Nome = 'Análise estática (Larastan)'; Servico = 'api'; Comando = @('composer', 'analyse') },
    @{ Lado = 'Back-end';  Nome = 'Testes (Pest)';               Servico = 'api'; Comando = @('vendor/bin/pest') },
    @{ Lado = 'Front-end'; Nome = 'Formatação (Prettier)';       Servico = 'web'; Comando = @('npm', 'run', 'format:check') },
    @{ Lado = 'Front-end'; Nome = 'Lint (oxlint)';               Servico = 'web'; Comando = @('npm', 'run', 'lint') },
    @{ Lado = 'Front-end'; Nome = 'Tipos (TypeScript)';          Servico = 'web'; Comando = @('npm', 'run', 'typecheck') },
    @{ Lado = 'Front-end'; Nome = 'Testes (Vitest)';             Servico = 'web'; Comando = @('npm', 'run', 'test') }
)

# Antes de tudo: os serviços api e web precisam estar no ar.
$noAr = docker compose ps --status running --services
if (($noAr -notcontains 'api') -or ($noAr -notcontains 'web')) {
    Write-Host ''
    Write-Host 'Os serviços api e web precisam estar no ar.' -ForegroundColor Red
    Write-Host 'Abra o Docker Desktop e rode: docker compose up -d'
    Pop-Location
    exit 1
}

# Roda cada etapa e guarda se passou ou falhou.
# Mesmo que uma falhe, as outras rodam: assim você vê todos os problemas de uma vez.
$resultados = @()
foreach ($etapa in $etapas) {
    Write-Host ''
    Write-Host "=== $($etapa.Lado): $($etapa.Nome) ===" -ForegroundColor Cyan

    $comando = $etapa.Comando
    # -T: sem terminal interativo, para funcionar também em automações
    docker compose exec -T $etapa.Servico @comando

    # Todo programa devolve um número ao terminar: 0 quer dizer "deu certo"
    $resultados += @{ Etapa = "$($etapa.Lado): $($etapa.Nome)"; Passou = ($LASTEXITCODE -eq 0) }
}

# Resumo final
Write-Host ''
Write-Host '=== Resumo ===' -ForegroundColor Cyan
foreach ($resultado in $resultados) {
    if ($resultado.Passou) {
        Write-Host "  OK      $($resultado.Etapa)" -ForegroundColor Green
    }
    else {
        Write-Host "  FALHOU  $($resultado.Etapa)" -ForegroundColor Red
    }
}

$falhas = @($resultados | Where-Object { -not $_.Passou }).Count
Write-Host ''
Pop-Location

if ($falhas -gt 0) {
    Write-Host "check: $falhas etapa(s) falharam." -ForegroundColor Red
    exit 1
}

Write-Host 'check: tudo certo.' -ForegroundColor Green
exit 0
