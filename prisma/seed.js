const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Populando banco de dados...')

  // Clínica da Paloma
  const clinica = await prisma.clinica.upsert({
    where: { cnpj: '50.078.343/0001-47' },
    update: {},
    create: {
      nome: 'Clínica FinEstet',
      cnpj: '50.078.343/0001-47',
      responsavel: 'Paloma Najara Silveira Santana',
      whatsapp: '41999999999',
      email: 'paloma@finestai.com.br',
      cidade: 'Curitiba, PR',
      plano: 'PROFISSIONAL',
    }
  })
  console.log('✅ Clínica criada:', clinica.nome)

  // Usuária Paloma
  const senhaHash = await bcrypt.hash('Paloma@2026', 12)
  const usuario = await prisma.usuario.upsert({
    where: { email: 'paloma@finestai.com.br' },
    update: {},
    create: {
      clinicaId: clinica.id,
      nome: 'Paloma Santana',
      email: 'paloma@finestai.com.br',
      senhaHash,
      role: 'ADMIN',
    }
  })
  console.log('✅ Usuária criada:', usuario.email)

  // Paciente Gean (teste)
  const paciente = await prisma.paciente.upsert({
    where: { id: 'gean-teste-id' },
    update: {},
    create: {
      id: 'gean-teste-id',
      clinicaId: clinica.id,
      nome: 'Gean Bandeira',
      cpf: '091.201.639-67',
      telefone: '41987545452',
      email: 'bandeiragean@gmail.com',
    }
  })
  console.log('✅ Paciente criado:', paciente.nome)

  // Lançamentos de maio/2026
  const lancamentos = [
    { tipo: 'entrada', valor: 1100.00, descricao: 'Maria Silva — Botox', categoria: 'Receita · PIX', conta: 'PagBank', data: new Date('2026-06-01') },
    { tipo: 'entrada', valor: 1200.00, descricao: 'Ana Costa — Preenchimento Labial', categoria: 'Receita · PIX', conta: 'PagBank', data: new Date('2026-05-29') },
    { tipo: 'saida',   valor: 565.00,  descricao: 'Merco Sul Soluções', categoria: 'Fornecedor Clínica', conta: 'Santander', data: new Date('2026-06-02') },
    { tipo: 'saida',   valor: 126.00,  descricao: 'Veolia Lixo', categoria: 'Despesa Fixa / Operacional', conta: 'Santander', data: new Date('2026-06-02') },
    { tipo: 'saida',   valor: 500.00,  descricao: 'Marcel Lazer Depilação', categoria: 'Fornecedor Clínica', conta: 'Santander', data: new Date('2026-05-30') },
    { tipo: 'saida',   valor: 1325.70, descricao: 'Danielly de So...', categoria: '⚠️ Pendente · Verificar', conta: 'Santander', data: new Date('2026-04-27') },
  ]

  for (const l of lancamentos) {
    await prisma.lancamento.create({
      data: { clinicaId: clinica.id, usuarioId: usuario.id, ...l, valor: l.valor }
    })
  }
  console.log('✅ Lançamentos criados:', lancamentos.length)

  console.log('\n🎉 Banco populado com sucesso!')
  console.log('   Login: paloma@finestai.com.br')
  console.log('   Senha: Paloma@2026')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
