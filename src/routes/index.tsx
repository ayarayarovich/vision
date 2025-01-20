import { createFileRoute, Navigate } from "@tanstack/react-router";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import ReactHowler from "react-howler";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const navigate = Route.useNavigate();
  // useGSAP(() => {
  //   const tl = gsap.timeline();
  //   tl.to("[data-s1]", { opacity: 1 });
  //   tl.to("[data-s1]", { opacity: 0 }, "+=1");

  //   tl.to("[data-s2]", { opacity: 1 });
  //   tl.to("[data-s2]", { opacity: 0 }, "+=1");

  //   tl.to("[data-s3]", { opacity: 1 });
  //   tl.to("[data-s3]", { opacity: 0 }, "+=1");

  //   tl.to("[data-s4]", { opacity: 1 });
  //   tl.to("[data-s4]", { opacity: 0 }, "+=1");

  //   tl.to("[data-s5]", { opacity: 1 });
  // }, []);

  return (
    <Navigate to="/app" />
    // <div className="relative *:absolute *:inset-0">
    //   <ReactHowler src="/krab.mp3" playing html5 />
    //   <div data-s1 className="h-screen flex flex-col gap-4 items-center justify-center opacity-0">
    //     <h1 className="text-5xl font-bold">Наталья Юрьевна!</h1>
    //   </div>
    //   <div data-s2 className="h-screen flex flex-col gap-4 items-center justify-center opacity-0">
    //     <h1 className="text-5xl font-bold">Я опоздал чуток со сдачей</h1>
    //   </div>
    //   <div data-s3 className="h-screen flex flex-col gap-4 items-center justify-center opacity-0">
    //     <h1 className="text-5xl font-bold">Но хочется 4 :)</h1>
    //   </div>
    //   <div data-s4 className="h-screen flex flex-col gap-4 items-center justify-center opacity-0">
    //     <h1 className="text-5xl font-bold">Проверьте пожалуйста работу</h1>
    //   </div>
    //   <div data-s5 className="h-screen flex flex-col gap-4 items-center justify-center opacity-0">
    //     <img src="/hom.webp" className="w-[50vmin] rounded-xl h-[40vmin] object-center" alt="" />
    //     <Button
    //       variant="outline"
    //       size="lg"
    //       type="button"
    //       onClick={() => {
    //         navigate({ to: "/app" });
    //       }}
    //     >
    //       Начать
    //     </Button>
    //   </div>
    // </div>
  );
}
