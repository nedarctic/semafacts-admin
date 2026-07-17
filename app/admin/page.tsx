import { BreadCrumb } from "@/components/breadcrumb";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <BreadCrumb currentPage="Dashboard" />

      <div>
          <h1 className="text-2xl">Dashboard</h1>
      </div>
    </div>
  )
}
