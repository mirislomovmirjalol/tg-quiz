import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useId } from "react";


export default function Home() {
  return (
    <div className="container mx-auto p-4 max-w-2xl pt-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">JAI</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Создать викторину</CardTitle>
          <CardDescription>Выберите тему и уровень сложности для создания викторины</CardDescription>
        </CardHeader>
        <CardContent>
          <QuizForm />
        </CardContent>
      </Card>
    </div>
  );
}


function QuizForm() {
  const id = useId()

  return (
    <Form action={async (formData) => {
      "use server"
      const topic = formData.get("topic");
      const difficulty = formData.get("difficulty");

      if (!topic || !difficulty) {
        return;
      }

      const encodedTopic = encodeURIComponent(topic.toString());
      const encodedDifficulty = encodeURIComponent(difficulty.toString());

      redirect(`/quiz?topic=${encodedTopic}&difficulty=${encodedDifficulty}`);
    }}>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="topic">Тема</Label>
          <Input
            type="text"
            name="topic"
            id="topic"
            placeholder="Введите тему (например, История, Наука, Математика)"
            required
          />
        </div>

        {/* use radio cards instead of select */}
        <div className="grid gap-2">
          <Label htmlFor="difficulty">Сложность</Label>
          <RadioGroup className="grid-cols-3" defaultValue="easy" name="difficulty">
            <div className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem id={`${id}-1`} value="easy" className="sr-only" />
              <label
                htmlFor={`${id}-1`}
                className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
              >
                Легкий
              </label>
            </div>
            <div className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem id={`${id}-2`} value="medium" className="sr-only" />
              <label
                htmlFor={`${id}-2`}
                className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
              >
                Средний
              </label>
            </div>
            <div className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem id={`${id}-3`} value="hard" className="sr-only" />
              <label
                htmlFor={`${id}-3`}
                className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
              >
                Сложный
              </label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" size="lg" className="w-full">Создать викторину</Button>
      </div>
    </Form>
  )
}