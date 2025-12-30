"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

import { createBabyAction } from "@/server/baby.actions";
import { createBabySchema, type CreateBabySchemaInput } from "@/server/baby.schemas";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export function BabyOnboardingForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<CreateBabySchemaInput>({
    resolver: zodResolver(createBabySchema),
    defaultValues: {
      name: "",
      birthDate: "",
    },
    mode: "onBlur",
  });

  function onSubmit(values: CreateBabySchemaInput) {
    startTransition(async () => {
      await createBabyAction(values);
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <Card className="mx-auto w-full max-w-md border-zinc-200">
      <CardHeader>
        <CardTitle>Vamos começar</CardTitle>
        <CardDescription>Cadastre o primeiro bebê para gerar vacinas e desafios.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Maria" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de nascimento</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-zinc-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(`${field.value}T00:00:00.000Z`), "dd/MM/yyyy") : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(`${field.value}T00:00:00.000Z`) : undefined}
                          onSelect={(date) => {
                            if (!date) return;
                            const yyyy = String(date.getFullYear());
                            const mm = String(date.getMonth() + 1).padStart(2, "0");
                            const dd = String(date.getDate()).padStart(2, "0");
                            field.onChange(`${yyyy}-${mm}-${dd}`);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gênero</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="grid grid-cols-2 gap-3"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <label className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2">
                        <RadioGroupItem value="girl" />
                        <span className="text-sm text-zinc-900">Menina</span>
                      </label>
                      <label className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2">
                        <RadioGroupItem value="boy" />
                        <span className="text-sm text-zinc-900">Menino</span>
                      </label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Salvando..." : "Criar bebê"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
