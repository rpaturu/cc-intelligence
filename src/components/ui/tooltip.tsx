"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  variant?: "default" | "error"
}) {
  const isError = variant === "error";
  
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-lg shadow-lg",
          isError 
            ? "bg-gray-800 text-white border border-gray-600 px-3 py-2" 
            : "bg-primary text-primary-foreground px-3 py-1.5 text-xs text-balance",
          className,
        )}
        {...props}
      >
        {isError && (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-4 h-4 bg-orange-500 rounded text-white text-[11px] font-bold leading-none">
              !
            </div>
            <span className="text-sm font-medium">{children}</span>
          </div>
        )}
        {!isError && children}
        <TooltipPrimitive.Arrow 
          className={cn(
            "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]",
            isError
              ? "bg-gray-900 fill-gray-900 border border-gray-700"
              : "bg-primary fill-primary"
          )} 
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
