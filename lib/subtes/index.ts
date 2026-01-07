import { transportApi, SUBTE_CLIENT_ID, SUBTE_CLIENT_SECRET } from "./../api";

export async function getSubwayStatus(line: string = "") {
    try {
        const url = `/subtes/serviceAlerts`;
        const { data } = await transportApi.get(url, {
            params: { client_id: SUBTE_CLIENT_ID, client_secret: SUBTE_CLIENT_SECRET, json: 1 },

        });

        const feed = data;

        // Convert key-value pairs to a clean object if needed, or just return the entities
        const alerts = feed.entity.filter((e: any) => e.id.endsWith("Linea" + line)).map((entity: any) => {
            if (entity.alert) {
                return {
                    id: entity.id,
                    alert: {
                        headerText: entity.alert.header_text?.translation?.[0]?.text,
                        descriptionText: entity.alert.description_text?.translation?.[0]?.text,
                        informedEntity: entity.alert.informed_entity
                    }
                };
            }
            return null;
        }).filter(Boolean);

        return alerts;

    } catch (error) {
        console.log("Error getting subway status:", error);
        return [];
    }
}

export async function getStations() {
    const url = `/subtes/forecastGTFS`;
    console.log(`🚀 Getting stations... --> ${SUBTE_CLIENT_ID} ${SUBTE_CLIENT_SECRET}`);

    const { data: datos } = await transportApi.get(url, { params: { client_id: SUBTE_CLIENT_ID, client_secret: SUBTE_CLIENT_SECRET } });

    const estaciones = datos.Entity.map((e: any) => ({
        linea: e.Linea.Route_Id.split("Linea")[1],
        direccion: e.Linea.Direction_ID,
        estaciones: e.Linea.Estaciones.map((e: any) => ({
            id: e.stop_id,
            name: e.stop_name
        })),
    })).map((e: any) => ({
        ...e,
        descripcion: `Desde ${e.estaciones[0].name} hasta ${e.estaciones[e.estaciones.length - 1].name
            }`,
    }));

    return estaciones
}

export type StationStatus = {
    destino: string;
    llegada_estimada: string;
    minutos: number;
    delay: string;
}

export async function getStationStatus(line: string, station_name: string): Promise<StationStatus[]> {
    const url = `/subtes/forecastGTFS`;

    const {
        data,
    } = await transportApi.get(url, { params: { client_id: SUBTE_CLIENT_ID, client_secret: SUBTE_CLIENT_SECRET } });

    const trenes = data.Entity.filter((e: any) => e.Linea.Route_Id.endsWith(line));
    let predicciones: any = [];
    const estaciones = await getStations();

    const decodedStationName = decodeURIComponent(station_name);

    trenes.forEach((tren: any) => {
        const estacion = tren.Linea.Estaciones.find(
            (s: any) => s.stop_name.toLowerCase() === decodedStationName.toLowerCase()
        );

        const [estacionBuscada] = estaciones.filter(
            (e: any) => e.linea === line && e.direccion === tren.Linea.Direction_ID
        );

        if (estacion) {
            const ahora = Math.floor(Date.now() / 1000);
            const tiempoLlegada = estacion.arrival.time;
            const minutosFaltantes = Math.ceil((tiempoLlegada - ahora) / 60);

            if (minutosFaltantes >= 0) {
                predicciones.push({
                    destino: estacionBuscada.descripcion,
                    llegada_estimada: new Date(tiempoLlegada * 1000).toLocaleTimeString(),
                    minutos: minutosFaltantes,
                    delay: estacion.arrival.delay / 60 + " minutos",
                });
            }
        }
    });

    return predicciones.sort((a: any, b: any) => a.minutos - b.minutos);
}
