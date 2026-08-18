import { getSupabaseClient } from './supabaseClient'

const normalizeTodo = (todo) => todo && ({
  id: todo.id,
  title: todo.title,
  description: todo.description ?? '',
  status: todo.status === 'completed' ? 'completed' : 'active',
  createdAt: todo.created_at,
  updatedAt: todo.updated_at,
})

const toDatabaseValues = (values) => ({
  ...(values.title !== undefined && { title: values.title }),
  ...(values.description !== undefined && { description: values.description }),
  ...(values.status !== undefined && { status: values.status }),
})

function throwQueryError(error, fallbackMessage) {
  if (!error) return
  throw new Error(fallbackMessage, { cause: error })
}

export function createTodosApi(client = null) {
  const getClient = () => client ?? getSupabaseClient()

  return {
    async listTodos() {
      const { data, error } = await getClient()
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      throwQueryError(error, '할 일 데이터를 불러오지 못했습니다.')
      return (data ?? []).map(normalizeTodo)
    },

    async getTodo(id) {
      const { data, error } = await getClient()
        .from('todos')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      throwQueryError(error, '할 일을 불러오지 못했습니다.')
      return normalizeTodo(data)
    },

    async createTodo(values) {
      const { data, error } = await getClient()
        .from('todos')
        .insert(toDatabaseValues(values))
        .select('*')
        .single()

      throwQueryError(error, '할 일을 저장하지 못했습니다.')
      return normalizeTodo(data)
    },

    async updateTodo(id, values) {
      const { data, error } = await getClient()
        .from('todos')
        .update({
          ...toDatabaseValues(values),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .maybeSingle()

      throwQueryError(error, '할 일을 수정하지 못했습니다.')
      if (!data) throw new Error('수정할 할 일을 찾지 못했습니다.')
      return normalizeTodo(data)
    },

    async deleteTodo(id) {
      const { data, error } = await getClient()
        .from('todos')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle()

      throwQueryError(error, '할 일을 삭제하지 못했습니다.')
      if (!data) throw new Error('삭제할 할 일을 찾지 못했습니다.')
      return id
    },

    async clearTodos(userId) {
      if (!userId) throw new Error('로그인 정보를 확인하지 못했습니다.')
      const { error } = await getClient()
        .from('todos')
        .delete()
        .eq('user_id', userId)

      throwQueryError(error, '내 할 일을 초기화하지 못했습니다.')
    },
  }
}

export const todosApi = createTodosApi()
