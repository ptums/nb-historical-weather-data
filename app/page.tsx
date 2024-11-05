import { WeatherTable, YearMonthForm } from "./ui";
import { YearMonthProvider } from "./context/year-month-context";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-yellow-50">
      <YearMonthProvider>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <YearMonthForm />
          <WeatherTable />
        </div>
      </YearMonthProvider>
    </main>
  );
}
