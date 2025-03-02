import { USER_ROLE } from "@/enums/model";
import { Home, Plus, ClipboardList } from "lucide-react";
import type { ReactNode } from "react";

export interface IRoutes {
  href: string;
  label: string;
  icon: ReactNode;
  show: boolean | USER_ROLE;
}

export const ROUTES = [
  {
    href: "/",
    label: "Dashboard",
    icon: <Home className="mr-2 h-4 w-4" />,
    show: true,
  },
  {
    href: "/new",
    label: "Create Work Order",
    icon: <Plus className="mr-2 h-4 w-4" />,
    show: USER_ROLE.PRODUCT_MANAGER,
  },
];
