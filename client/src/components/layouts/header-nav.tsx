import { memo } from "react";
import TransparentOnScroll from "../common/transparent-on-scroll";
import { USER_ROLE } from "@/enums/model";
import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import LogOutBtn from "../common/log-out-btn";
import ThemeToogle from "../common/theme-toogle";
import { ROUTES } from "@/constants/navigation";

export interface HeaderNavProps {
  role: USER_ROLE;
  name: string;
}

function HeaderNav({ role, name }: HeaderNavProps) {
  return (
    <TransparentOnScroll
      as="header"
      data-testid="header"
      id="header"
      className="fixed top-0 shadow-lg w-full z-999"
    >
      <nav className="flex items-center space-x-4 lg:space-x-6">
        {ROUTES.filter(
          ({ show }) => (typeof show === "boolean" && show) || show === role
        ).map(({ href, label, icon }) => (
          <Link
            href={href}
            key={label}
            className="text-sm font-medium transition-colors hover:text-primary"
            prefetch
          >
            <Button variant="ghost" className="flex items-center">
              {icon}
              {label}
            </Button>
          </Link>
        ))}
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{name ?? "user"}</span>
        </div>
        <ThemeToogle className="border-none" />
        <LogOutBtn />
      </nav>
    </TransparentOnScroll>
  );
}

export default memo(HeaderNav);
