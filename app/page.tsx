import { getMappedData, SubteLine } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { getSubwayStatus } from "@/lib/subtes";

const LINE_COLORS: Record<string, string> = {
  A: "#009BDB", // Light Blue
  B: "#E10419", // Red
  C: "#006CB5", // Blue
  D: "#009B3A", // Green
  E: "#7F187F", // Purple
  H: "#FFDB00", // Yellow
};

export default async function Home() {
  // 1. Fetch data from the server-side store
  // Since this is a Server Component, this runs on the server.
  const globalData = await getMappedData();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <h1 className="text-4xl font-bold mb-12">Subtes</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-lg">
        {Array.from(new Set(globalData.map((item: SubteLine) => item.linea))).sort().map((linea: unknown) => {
          const lineStr = linea as string;
          // Determine text color: Black for Yellow (H), White for everything else
          const textColor = lineStr === "H" ? "#000000" : "#FFFFFF";
          const bgColor = LINE_COLORS[lineStr] || "#333333";

          return (
            <Button
              key={lineStr}
              asChild
              className="h-32 w-32 rounded-full text-6xl font-black hover:scale-105 transition-transform shadow-lg mx-auto"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                border: "none"
              }}
            >
              <a href={`/linea/${lineStr}`}>{lineStr}</a>
            </Button>
          );
        })}
      </div>
    </main>
  );
}
