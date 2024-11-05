import { YearMonthForm } from "./ui";
import { YearMonthProvider } from "./context/year-month-context";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-yellow-50">
      <YearMonthProvider>
        <YearMonthForm />
      </YearMonthProvider>
    </main>
  );
}
