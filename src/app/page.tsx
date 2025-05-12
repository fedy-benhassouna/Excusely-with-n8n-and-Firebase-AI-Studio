"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateExcuse } from "@/ai/flows/generate-excuse"; // Correct path based on user files

const formSchema = z.object({
  context: z.string().min(10, {
    message: "Please provide a bit more context (at least 10 characters).",
  }).max(500, {
    message: "Context cannot exceed 500 characters.",
  }),
});

export default function ExcuselyPage() {
  const [generatedExcuse, setGeneratedExcuse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      context: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedExcuse(""); // Clear previous excuse

    try {
      const result = await generateExcuse({ context: values.context });
      if (result && result.excuse) {
        setGeneratedExcuse(result.excuse);
        toast({
          title: "Excuse Generated!",
          description: "Your masterpiece is ready.",
        });
      } else {
        throw new Error("Received an empty excuse from the AI.");
      }
    } catch (error) {
      console.error("Error generating excuse:", error);
      let errorMessage = "Failed to generate excuse. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setGeneratedExcuse(`Error: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong.",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <Wand2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Excusely</CardTitle>
          <CardDescription className="text-muted-foreground">
            Craft the perfect alibi for any situation. Just provide the context, and let us handle the rest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">The Situation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I need to skip a meeting because my cat is planning world domination..."
                        className="min-h-[120px] resize-none text-base shadow-sm focus:ring-primary"
                        {...field}
                        aria-label="Situation context input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6 shadow-md hover:shadow-lg transition-shadow duration-200" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Excuse
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        { (isLoading || generatedExcuse) && (
          <CardFooter className="mt-6">
            <div className="w-full space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Your Custom Excuse:</h3>
              {isLoading && !generatedExcuse && (
                <div className="p-4 border border-dashed rounded-md bg-muted/50 text-muted-foreground min-h-[80px] flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Conjuring up something brilliant...
                </div>
              )}
              {generatedExcuse && (
                 <div className={`p-4 border rounded-md text-base ${generatedExcuse.startsWith("Error:") ? 'bg-destructive/10 border-destructive text-destructive-foreground' : 'bg-secondary text-secondary-foreground'} min-h-[80px] whitespace-pre-wrap shadow-inner`}>
                  {generatedExcuse}
                </div>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </main>
  );
}
