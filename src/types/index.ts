export type Clinica = {
  id: string
  nome: string
  cnpj: string | null
  responsavel: string | null
  plano: 'ESSENCIAL' | 'PROFISSIONAL' | 'CLINICA'
}

export type Usuario = {
  id: string
  clinicaId: string
  nome: string
  email: string
  role: 'ADMIN' | 'PROFISSIONAL' | 'VISUALIZADOR'
}

export type Paciente = {
  id: string
  clinicaId: string
  nome: string
  cpf: string | null
  dataNasc: Date | null
  telefone: string | null
  email: string | null
  alergias: string | null
  obs: string | null
  ativo: boolean
  criadoEm: Date
}

export type Lancamento = {
  id: string
  clinicaId: string
  tipo: 'entrada' | 'saida'
  valor: number
  descricao: string
  categoria: string
  conta: string
  procedimento: string | null
  obs: string | null
  data: Date
  criadoEm: Date
}

export type Evolucao = {
  id: string
  clinicaId: string
  pacienteId: string
  paciente?: Paciente
  procedimento: string
  data: Date
  produto: string | null
  lote: string | null
  unidades: number | null
  simetria: string | null
  intercorrencias: string
  criadoEm: Date
}

export type Session = {
  usuarioId: string
  clinicaId: string
  email: string
  nome: string
  role: string
}
