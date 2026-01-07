import { getMappedData, SubteLine, Station } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { getSubwayStatus } from "@/lib/subtes";
import { MapModal } from "@/components/MapModal";
import Image from "next/image";

export default async function LineaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const globalData = await getMappedData();

    const subwayStatus = await getSubwayStatus(id);

    const [lineData] = globalData.filter((item: SubteLine) => item.linea === id);

    if (!lineData) {
        return (
            <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
                <h1 className="text-2xl font-bold">Línea no encontrada</h1>
                <Button asChild variant="ghost" className="mt-4">
                    <a href="/">← Volver al inicio</a>
                </Button>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
            <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
                <Button asChild variant="ghost">
                    <a href="/">← Volver</a>
                </Button>

                <MapModal line={id}>
                    <Button variant="outline">Ver mapa</Button>
                </MapModal>
            </div>
            <div className="w-full max-w-4xl flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <h1 className="text-6xl font-bold text-primary">Línea {id}</h1>
                </div>
            </div>

            <section className="space-y-8 py-4">
                {subwayStatus.map((alert: any, i: number) => (
                    <div key={i} className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-md" role="alert">
                        <p className="text-yellow-700 dark:text-yellow-300">{alert.alert.descriptionText}</p>
                    </div>
                ))}
            </section>
            <div className="w-full max-w-4xl space-y-8">

                <div className="p-6 border rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">Seleccione la estación</h2>
                    <div className="flex flex-wrap gap-2">
                        {lineData.estaciones.map((estacion: Station, i: number) => (
                            <Button key={i} asChild className="px-8 py-4 bg-muted rounded-full text-lg h-auto hover:bg-primary hover:text-primary-foreground" variant="ghost">
                                <a href={`/linea/${id}/estacion/${estacion.name}`}>
                                    {estacion.name}
                                </a>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>


        </main>
    );
}
