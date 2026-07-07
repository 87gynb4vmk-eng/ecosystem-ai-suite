# Plano: Fluxo Pós-Compra Automatizado e Seguro

## Status
✅ Implementado (envio automático de e-mail depende da configuração do domínio de e-mail).

## O que foi entregue

### 1. Banco de dados
- Tabela `pedidos` para histórico de compras.
- Colunas novas em `usuarios`: `status`, `acesso_ate`, `trocar_senha_obrigatorio`, contadores mensais.
- Função segura `increment_counter` para atualizar contadores de uso.

### 2. Webhook Cakto robusto
- Registra pedidos.
- Cria/atualiza usuário com senha temporária.
- Trata aprovação, cancelamento, reembolso e falha de cobrança.
- Idempotência por `gateway_event_id`.
- Loga senha temporária no servidor (até o e-mail automático ser ativado).

### 3. Troca obrigatória de senha
- Rota `/primeiro-acesso`.
- Redirecionamento automático após login com senha temporária.
- Liberação do dashboard só após a troca.

### 4. Controle de acesso
- Layout `_authenticated` verifica `status` e `acesso_ate`.
- Usuários inativos/expirados são redirecionados para `/renovar`.
- Tela `/renovar` com links para os planos.

### 5. Limites por plano
- Plano mensal: 5 e-books/mês, 5 vídeos/mês, 3 páginas publicadas.
- Plano vitalício: ilimitado.
- Verificação antes de gerar e-book, publicar página ou gerar vídeo.
- Card de plano no dashboard mostrando uso atual.

### 6. Testes E2E
- `tests/e2e/pos-compra.spec.ts` cobrindo webhook, login e renovação.

## Próximo passo pendente
Configurar o domínio de e-mail para ativar o envio automático de credenciais após a compra.
