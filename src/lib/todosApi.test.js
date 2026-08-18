import { describe, expect, it, vi } from 'vitest'
import { createTodosApi } from './todosApi'

function createClientStub(responses = {}) {
  const calls = {}
  const ok = (data) => ({ data, error: null })
  const client = {
    from: vi.fn((table) => {
      calls.table = table
      return {
        select: vi.fn(() => ({
          order: vi.fn(async (column, options) => {
            calls.order = [column, options]
            return responses.list ?? ok([])
          }),
          eq: vi.fn((column, value) => ({
            maybeSingle: vi.fn(async () => {
              calls.getFilter = [column, value]
              return responses.get ?? ok(null)
            }),
          })),
        })),
        insert: vi.fn((values) => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => {
              calls.insert = values
              return responses.create ?? ok(null)
            }),
          })),
        })),
        update: vi.fn((values) => ({
          eq: vi.fn((column, value) => ({
            select: vi.fn(() => ({
              maybeSingle: vi.fn(async () => {
                calls.update = values
                calls.updateFilter = [column, value]
                return responses.update ?? ok(null)
              }),
            })),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn((column, value) => {
            calls.clearFilter = [column, value]
            const builder = {
              select: vi.fn(() => ({
              maybeSingle: vi.fn(async () => {
                calls.deleteFilter = [column, value]
                return responses.delete ?? ok(null)
              }),
              })),
              then: (resolve, reject) => Promise.resolve(responses.clear ?? ok(null)).then(resolve, reject),
            }
            return builder
          }),
        })),
      }
    }),
  }
  return { client, calls }
}

const databaseTodo = {
  id: 'todo-id',
  title: '테스트',
  description: '설명',
  status: 'active',
  created_at: '2026-08-16T00:00:00.000Z',
  updated_at: '2026-08-16T00:00:00.000Z',
}

describe('todosApi', () => {
  it('Supabase 목록을 최신 등록순으로 조회하고 화면 형태로 변환한다', async () => {
    const { client, calls } = createClientStub({ list: { data: [databaseTodo], error: null } })

    const todos = await createTodosApi(client).listTodos()

    expect(client.from).toHaveBeenCalledWith('todos')
    expect(calls.order).toEqual(['created_at', { ascending: false }])
    expect(todos[0]).toEqual({
      id: 'todo-id',
      title: '테스트',
      description: '설명',
      status: 'active',
      createdAt: databaseTodo.created_at,
      updatedAt: databaseTodo.updated_at,
    })
  })

  it('등록, 상세 조회, 수정, 삭제 CRUD 흐름을 처리한다', async () => {
    const updatedRow = { ...databaseTodo, title: '수정됨', status: 'completed' }
    const { client, calls } = createClientStub({
      get: { data: databaseTodo, error: null },
      create: { data: databaseTodo, error: null },
      update: { data: updatedRow, error: null },
      delete: { data: { id: databaseTodo.id }, error: null },
    })
    const api = createTodosApi(client)

    const created = await api.createTodo({ title: '테스트', description: '설명', status: 'active' })
    expect(calls.insert).toEqual({ title: '테스트', description: '설명', status: 'active' })
    expect((await api.getTodo(databaseTodo.id)).id).toBe(databaseTodo.id)

    const updated = await api.updateTodo(databaseTodo.id, { title: '수정됨', status: 'completed' })
    expect(updated).toMatchObject({ title: '수정됨', status: 'completed' })
    expect(calls.updateFilter).toEqual(['id', databaseTodo.id])

    await expect(api.deleteTodo(databaseTodo.id)).resolves.toBe(databaseTodo.id)
    expect(calls.deleteFilter).toEqual(['id', databaseTodo.id])
  })

  it('없는 할 일을 수정하거나 삭제하면 사용자용 오류를 낸다', async () => {
    const { client } = createClientStub()
    const api = createTodosApi(client)

    await expect(api.updateTodo('missing', { title: '없음' })).rejects.toThrow('찾지 못했습니다')
    await expect(api.deleteTodo('missing')).rejects.toThrow('찾지 못했습니다')
  })

  it('전체 초기화는 로그인 사용자의 소유 행으로 범위를 제한한다', async () => {
    const { client, calls } = createClientStub()
    const api = createTodosApi(client)

    await expect(api.clearTodos('user-1')).resolves.toBeUndefined()
    expect(calls.clearFilter).toEqual(['user_id', 'user-1'])
    await expect(api.clearTodos()).rejects.toThrow('로그인 정보를 확인하지 못했습니다.')
  })

  it('Supabase 내부 오류 대신 사용자용 메시지를 전달한다', async () => {
    const { client } = createClientStub({ list: { data: null, error: { message: '연결 실패' } } })
    await expect(createTodosApi(client).listTodos()).rejects.toThrow('할 일 데이터를 불러오지 못했습니다.')
  })
})
