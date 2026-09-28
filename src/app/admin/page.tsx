import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminPage() {
  const isAuth = await isAdminAuthenticated();
  if (isAuth) redirect("/admin/blog");
  redirect("/admin/login");
}
