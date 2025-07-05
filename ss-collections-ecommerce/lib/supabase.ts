// Dummy Supabase client to prevent import errors during migration
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
      }),
      order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
      limit: (count: number) => Promise.resolve({ data: [], error: null }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ error: null }),
    }),
  }),
}
