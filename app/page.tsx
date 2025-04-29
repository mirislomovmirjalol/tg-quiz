import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto p-4 max-w-2xl pt-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">BrainBoost Quiz</h1>
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

        <div className="grid gap-2">
          <Label htmlFor="difficulty">Сложность</Label>
          <Select name="difficulty" required>
            <SelectTrigger className="w-full" id="difficulty">
              <SelectValue placeholder="Выберите сложность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Легко</SelectItem>
              <SelectItem value="medium">Средне</SelectItem>
              <SelectItem value="hard">Сложно</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="lg" className="w-full">Создать викторину</Button>
      </div>
    </Form>
  )
}