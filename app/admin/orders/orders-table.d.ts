import { ReactElement } from 'react'

export interface OrdersTableProps {
  orders: any[]
  orderStatuses: readonly string[]
  statusColors: Record<string, string>
  updateOrderStatusAction: (formData: FormData) => Promise<void>
}

export function OrdersTable(props: OrdersTableProps): ReactElement 