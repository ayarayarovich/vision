import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster />
      <Outlet />
      <Button className="bottom-1 left-1 fixed" asChild type="button" size="sm" variant="link">
        <a href="https://github.com/ayarayarovich" target="_blank">
          ayarayarovich
        </a>
      </Button>
    </>
  ),
});
