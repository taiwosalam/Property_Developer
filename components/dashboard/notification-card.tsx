"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function NotificationCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[16px]">
          <h3 className="font-medium">Recent {}</h3>
          <Link href="" className="text-[#4F5E71] flex items-center">
            <p>See all</p>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/empty/avatar.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-text-primary">
              Olivia Martin
            </p>
            <p className="text-sm text-muted-foreground">
              olivia.martin@email.com
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/empty/avatar.png" alt="Avatar" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-text-primary">Jackson Lee</p>
            <p className="text-sm text-muted-foreground">
              jackson.lee@email.com
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/empty/avatar.png" alt="Avatar" />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-text-primary">
              Isabella Nguyen
            </p>
            <p className="text-sm text-muted-foreground">
              isabella.nguyen@email.com
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/empty/avatar.png" alt="Avatar" />
            <AvatarFallback>WK</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-text-primary">William Kim</p>
            <p className="text-sm text-muted-foreground">will@email.com</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/empty/avatar.png" alt="Avatar" />
            <AvatarFallback>SD</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium text-text-primary">Sofia Davis</p>
            <p className="text-sm text-muted-foreground">
              sofia.davis@email.com
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
