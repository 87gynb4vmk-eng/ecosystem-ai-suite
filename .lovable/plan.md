# Plano: Testes E2E do fluxo "Gerar Conteúdo"

## Objetivo
Garantir automaticamente que:
1. Usuário autenticado consegue gerar o eBook e o PDF é disparado para download.
2. Usuário com sessão expirada é redirecionado para `/auth` com mensagem clara, sem quebrar a UI.

## Ferramenta
Playwright (já pré-instalado no sandbox, headless Chromium). Rodar contra o dev server em `http://localhost:8080`.

## Estrutura de arquivos
```
tests/
  e2e/
    playwright.config.ts
    helpers/
      auth.ts            # injeta sessão Supabase via localStorage/cookies
      gemini-mock.ts     # intercepta chamada ao Gemini e retorna JSON válido
    gerar-conteudo.spec.ts
package.json             # adiciona script "test:e2e"
```

## Cenários
### 1. `gera ebook e baixa PDF após login`
- Injeta sessão válida (env `LOVABLE_BROWSER_SUPABASE_*`) no `localStorage` + cookies.
- Intercepta `**/generativelanguage.googleapis.com/**` retornando JSON com título, subtítulo, 10 capítulos, conclusão e CTA.
- Navega para `/dashboard`, seleciona nicho/sub-nicho, clica em "Gerar Conteúdo".
- Aguarda `page.on('download')` e assert `download.suggestedFilename()` termina em `.pdf` e tamanho > 0.
- Screenshot da tela de sucesso.

### 2. `redireciona para /auth quando sessão expira`
- Injeta sessão, abre `/dashboard`, então limpa `localStorage` da chave `sb-*-auth-token` e stub de `supabase.auth.refreshSession` para retornar `{ data: { session: null } }` via `page.addInitScript`.
- Clica em "Gerar Conteúdo".
- Assert URL vira `/auth` e toast/mensagem "Sessão expirada" visível.
- Screenshot.

### 3. (bônus) `mostra erro amigável se Gemini responde 401`
- Intercepta Gemini com status 401.
- Assert mensagem de "chave inválida" na UI.

## Detalhes técnicos
- Config Playwright: `use: { baseURL: 'http://localhost:8080', viewport: {width:1280,height:1800} }`, `webServer` desativado (dev server já roda).
- Helper `auth.ts`: lê `LOVABLE_BROWSER_SUPABASE_STORAGE_KEY` e `_SESSION_JSON`, aplica via `page.evaluate` após `goto('/')`.
- Se `LOVABLE_BROWSER_AUTH_STATUS !== 'injected'`, o teste é `test.skip` com mensagem para o usuário logar no preview.
- Adicionar script `"test:e2e": "playwright test -c tests/e2e/playwright.config.ts"` em `package.json`.
- Sem alterações em código de produção.

## Execução
`bunx playwright test -c tests/e2e/playwright.config.ts` no sandbox após implementar.

Confirma que posso seguir?
