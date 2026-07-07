# Plano: Fluxo Pós-Compra Automatizado e Seguro

## Objetivo
Fazer com que o cliente receba os dados de acesso automaticamente após a compra, entre no app de forma segura e tenha a experiência correta de acordo com o plano (mensal ou vitalício) e o status do pagamento.

## Pré-requisito obrigatório
Configurar um domínio de e-mail para o projeto. Como já existe o domínio `suportealevi.store`, sugerimos usar um subdomínio de remetente (ex: `noreply@suportealevi.store`). Sem isso, não é possível enviar e-mails automaticamente pelo app.

```text
Ação do usuário: configurar o domínio de e-mail em Project Settings → Email.
```

---

## 1. E-mail automático de boas-vindas com credenciais

Após a Cakto confirmar a compra via webhook, o app enviará um e-mail para o cliente com:
- E-mail de acesso
- Senha temporária gerada automaticamente
- Link direto para a tela de login
- Instruções de que a senha deve ser trocada no primeiro acesso

### Implementação
- Criar tabela `pedidos` para registrar cada compra (ver seção 3).
- No webhook `/api/public/webhook/cakto`, após criar/atualizar o usuário, disparar envio de e-mail transacional usando Lovable Emails.
- O e-mail usará um template customizado com a identidade visual do app.
- Caso o envio falhe, o pedido será marcado com `email_enviado: false` para retry manual/admin.

---

## 2. Primeiro acesso com troca obrigatória de senha

Atualmente o cliente faz login com a senha temporária e fica nela para sempre. Isso é inseguro.

### Implementação
- Adicionar coluna `trocar_senha_obrigatorio` (ou usar metadado do Supabase Auth) na tabela `usuarios`.
- No webhook, marcar `trocar_senha_obrigatorio = true` para novos usuários.
- Criar rota pública `/primeiro-acesso` (ou usar `/reset-password` com lógica específica).
- Após login com sucesso, se `trocar_senha_obrigatorio = true`, redirecionar para a tela de troca de senha.
- Só liberar o dashboard após a senha ser alterada.
- Após a troca, marcar `trocar_senha_obrigatorio = false`.

---

## 3. Histórico de pedidos

Hoje o app não guarda registro de compras. Vamos criar uma tabela de pedidos vinculada ao usuário.

### Estrutura sugerida
```text
pedidos
- id (uuid)
- usuario_id (uuid, referência ao auth.users)
- email (text)
- plano (mensal | vitalicio)
- valor (numeric)
- status (aprovado | cancelado | reembolsado | pendente)
- gateway (cakto)
- gateway_event_id (text)
- produto_nome (text)
- created_at
- updated_at
```

### Regras
- Inserir pedido no webhook para todo evento de compra aprovada.
- Atualizar status para `cancelado` ou `reembolsado` quando a Cakto enviar esses eventos.
- Exibir histórico de pedidos no painel administrativo.
- Usar o histórico para decidir se o usuário mensal ainda tem acesso ativo.

---

## 4. Controle de acesso por status de pagamento

Hoje qualquer usuário logado acessa tudo, sem verificar se o plano mensal está pago.

### Implementação
- Adicionar colunas na tabela `usuarios`:
  - `plano`: mensal | vitalicio
  - `status`: ativo | inativo | cancelado
  - `acesso_ate`: timestamp (para plano mensal, data de expiração)
- No webhook de compra aprovada:
  - Plano vitalício: status = ativo, acesso_ate = null.
  - Plano mensal: status = ativo, acesso_ate = now() + 30 dias.
- No webhook de cancelamento/reembolso:
  - Plano mensal: status = inativo ou cancelado, acesso_ate = data do evento.
- No layout `_authenticated/route.tsx`, verificar se o usuário tem acesso ativo antes de renderizar o dashboard.
- Se inativo, redirecionar para uma página de "Assinatura expirada" com botão de renovar.

---

## 5. Diferenciação de funcionalidades entre planos

Hoje mensal e vitalício têm a mesma experiência. Vamos diferenciar de forma simples e justa.

### Proposta
| Funcionalidade | Mensal | Vitalício |
|---|---|---|
| Geração de e-books | até 5/mês | ilimitado |
| Páginas publicadas | até 3 | ilimitado |
| Vídeos gerados | até 5/mês | ilimitado |
| Suporte | e-mail | prioritário |

### Implementação
- Criar tabela `planos` ou usar configuração em código para limites.
- Adicionar contadores mensais na tabela `usuarios`:
  - `ebooks_gerados_mes`
  - `videos_gerados_mes`
  - `paginas_publicadas_total`
- Criar server function `verificarLimite` que checa o plano e os contadores antes de permitir ação.
- No dashboard, desabilitar botões quando o limite for atingido e mostrar mensagem de upgrade.
- Resetar contadores mensais automaticamente (via cron ou no primeiro uso do mês).

---

## 6. Melhorias no webhook da Cakto

O webhook atual só trata compra aprovada. Precisamos ampliá-lo.

### Eventos a tratar
- `purchase.approved`: criar/atualizar usuário, enviar e-mail, registrar pedido.
- `purchase.canceled` / `subscription.canceled`: marcar plano mensal como inativo.
- `purchase.refunded`: marcar pedido como reembolsado e, se for mensal, inativar acesso.
- `subscription.charge_failed`: marcar status como pendente/inativo.

### Segurança
- Manter validação de assinatura HMAC.
- Adicionar idempotência: ignorar eventos duplicados pelo `gateway_event_id`.
- Registrar todos os eventos em log para auditoria.

---

## 7. Página de "Acesso bloqueado / Renovar assinatura"

Criar rota pública `/renovar` para usuários com acesso inativo.
- Explicar o motivo do bloqueio.
- Mostrar botões para os planos atuais (links Cakto).
- Após nova compra, o webhook reativa o acesso automaticamente.

---

## 8. Testes E2E

Atualizar os testes Playwright existentes para cobrir:
- Simulação de webhook Cakto aprovado → criação de usuário.
- Login com senha temporária.
- Troca obrigatória de senha.
- Acesso ao dashboard após troca.
- Bloqueio de funcionalidade ao atingir limite do plano mensal.

---

## Resumo das entregas
1. Configuração de domínio de e-mail.
2. Envio automático de e-mail de boas-vindas com credenciais.
3. Troca obrigatória de senha no primeiro acesso.
4. Tabela de pedidos e histórico administrativo.
5. Controle de acesso ativo/inativo baseado em pagamento.
6. Limites de uso diferenciados entre planos mensal e vitalício.
7. Webhook Cakto robusto para aprovação, cancelamento e reembolso.
8. Página de renovação para usuários bloqueados.
9. Testes E2E do fluxo completo.

---

## Próximos passos
Aprovar este plano para que eu comece a implementação. A primeira ação será configurar o domínio de e-mail, que é pré-requisito para todas as melhorias de envio automático.