import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.companyId) {
    redirect("/login");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    companyId: session.user.companyId
  };
}
