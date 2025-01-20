import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { FileSearch, Maximize, Minus, Plus, WandSparkles, XIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FileUploader } from "@/components/file-uploader";
import { toast } from "sonner";
import { yandexVisionAxios } from "@/axios";
import { toBase64 } from "@/lib/utils";
import { useState } from "react";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

const appWindow = getCurrentWindow();

const schema = z.object({
  images: z.array(z.instanceof(File)).length(1, "Нужно изображение бланка"),
});

type Schema = z.infer<typeof schema>;

interface Result {
  img: string;
  data: string;
}

function RouteComponent() {
  const [results, setResults] = useState<Result[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      images: [],
    },
  });

  const handleSubmit = form.handleSubmit(async (vals) => {
    const img = vals.images[0];

    const base64 = await toBase64(img);

    const response = await yandexVisionAxios.post("/ocr/v1/recognizeText", {
      mimeType: img.type.replace("image/", "").toUpperCase(),
      languageCodes: ["ru"],
      model: "handwritten",
      content: base64,
    });

    const fullText: string | undefined = response.data.result.textAnnotation.fullText;
    if (!fullText) {
      toast.error("Не удалось распознать бланк");
      return;
    }

    const cleaned = fullText
      .split(/\s+/)
      .map((v) => v.trim())
      .filter(Boolean)
      .join(" ");

    const objectUrl = URL.createObjectURL(img);

    setResults((old) => [{ img: objectUrl, data: cleaned }, ...old]);
    setHistoryOpen(true);
  });

  return (
    <div className="flex flex-col items-stretch h-screen overflow-hidden">
      <div data-tauri-drag-region className="flex gap-1 items-center p-1">
        <div className="grow"></div>
        <Button size="icon" type="button" onClick={() => appWindow.minimize()}>
          <Minus />
        </Button>
        <Button size="icon" type="button" onClick={() => appWindow.toggleMaximize()}>
          <Maximize />
        </Button>
        <Button size="icon" type="button" onClick={() => appWindow.close()}>
          <XIcon />
        </Button>
      </div>

      <div className="grow flex flex-col items-center justify-center">
        <div className="container p-4">
          <div className="flex items-center mb-8 gap-4">
            <div className="flex-1"></div>
            <h1 className="text-2xl font-bold text-center">Загрузите заполненный бланк для распознования</h1>
            <div className="flex-1 flex items-center justify-end">
              <Drawer open={historyOpen} onOpenChange={setHistoryOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline">История распознаваний</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full pb-8 container">
                    <DrawerHeader className="mb-8">
                      <DrawerTitle className="text-center">История распознаваний</DrawerTitle>
                      <DrawerDescription className="text-center">
                        Здесь все те бланки, которые уже были распознаны ранее
                      </DrawerDescription>
                    </DrawerHeader>
                    {results.length > 0 ? (
                      <ScrollArea className="pb-4 h-[70vh]">
                        {results.map((v, idx) => (
                          <Card className="mb-2 last-of-type:mb-0" key={v.data + idx}>
                            <CardContent className="flex pt-6 gap-4 items-center">
                              <div className="shrink-0 grow-0">
                                <img
                                  src={v.img}
                                  alt=""
                                  className="size-16 object-center object-cover border rounded-lg"
                                />
                              </div>
                              <div className="flex-1 text-wrap">{v.data}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </ScrollArea>
                    ) : (
                      <div className="flex h-[70vh] flex-col gap-4 items-center justify-center">
                        <FileSearch className="text-4xl" />
                        <div className="text-xl">Тут пока пусто</div>
                      </div>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          <FormProvider {...form}>
            <Form onSubmit={handleSubmit as never} className="flex w-full flex-col gap-6">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <div className="space-y-6">
                    <FormItem className="w-full">
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          maxFileCount={1}
                          maxSize={4 * 1024 * 1024}
                          disabled={form.formState.isSubmitting || form.formState.isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="w-fit mx-auto"
                disabled={form.formState.isSubmitting || form.formState.isLoading}
              >
                <WandSparkles />
                Распознать
              </Button>
            </Form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
