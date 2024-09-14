import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  BarChartBig,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function NavMenu() {
  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <Link className="flex flex-row" href="/dashboard">
            <BarChartBig className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
           <Link className="flex flex-row" href="/quiz/new">
          <Plus className="mr-2 h-4 w-4" />
          <span>New Quiz</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
           <Link className="flex flex-row" href="/billing">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
        <Link className="flex flex-row" href="/settings">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Invite users</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                <span>Email</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Message</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>More...</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Link href="https://github.com/benshandd/StudySmart" className="flex flex-row" target="_blank">
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
      <Link href="mailto:benjaminshand101@gmail.com" className="flex flex-row">
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>Support</span>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
