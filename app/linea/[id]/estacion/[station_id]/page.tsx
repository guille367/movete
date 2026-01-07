import { getGlobalStore, Station, SubteLine } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { getStationStatus, StationStatus } from "@/lib/subtes";

import { MapModal } from "@/components/MapModal";

export default async function LineaPageEstacion({
    params,
}: {
    params: Promise<{ id: string; station_id: string }>;
}) {
    const { id, station_id } = await params;
    const store = await getGlobalStore();

    // Find the line
    const lineData = store.mappedData.filter(
        (l) => l.linea === id
    );

    if (!lineData || lineData.length === 0) {
        return <div>Line not found</div>;
    }

    // Find the station
    // Note: station_id comes from the URL, so it's a string.
    // Ensure we match correctly against the station ID in the store.
    const station = lineData;

    if (!station || station.length === 0) {
        return (
            <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
                <h1 className="text-2xl font-bold">Estación no encontrada</h1>
                <Button asChild variant="ghost" className="mt-4">
                    <a href={`/linea/${id}`}>← Volver a la línea {id}</a>
                </Button>
            </main>
        );
    }

    const status = await getStationStatus(id, station_id);

    return (
        <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
            <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
                <Button asChild variant="ghost">
                    <a href={`/linea/${id}`}>← Volver a la línea {id}</a>
                </Button>

                <MapModal line={id}>
                    <Button variant="outline">Ver mapa</Button>
                </MapModal>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-primary">{station[0].linea}</h1>
            <p className="text-xl text-muted-foreground">Línea {id}</p>
            {status.map((s: StationStatus) => (
                <div key={s.destino} className="w-full max-w-4xl mt-6 p-6 border rounded-xl bg-card shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Hacia {s.destino}</h2>
                            <p className="text-lg text-muted-foreground mt-1">Próximo arribo programado en:</p>
                        </div>

                        <div className="flex flex-col items-start md:items-end">
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-primary">{s.minutos}</span>
                                <span className="text-xl font-bold text-muted-foreground">min</span>
                            </div>
                            <p className="text-lg font-medium text-muted-foreground">Llegada: <b className="font-bold text-primary">{s.llegada_estimada}</b></p>
                        </div>
                    </div>
                </div>
            ))}
        </main>
    );
}
