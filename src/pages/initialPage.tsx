import { columns, type Payment } from "@/components/payments/columns";
import { DataTable } from "@/components/payments/data-table";

export function InitialPage() {
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <p>teste</p>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
