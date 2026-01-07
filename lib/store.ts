import axios from "axios";
import { transportApi } from "./api";
import { getStations } from "./subtes";

// This is a server-side store example using the Singleton pattern.
// It allows you to initialize data once when the server starts and share it across the app.

export interface Station {
    id: string;
    name: string;
}

export interface SubteLine {
    linea: string;
    direccion: number;
    estaciones: Station[];
    descripcion: string;
}

export interface GlobalState {
    mappedData: SubteLine[];
    isInitialized: boolean;
}

// Define the interface for the global object to prevent TS errors
declare global {
    var __APP_STORE__: GlobalState | undefined;
}



// Mock initialization function
// Replace this with your actual logic (e.g., fetching from DB, reading files, etc.)
const initializeData = async (): Promise<SubteLine[]> => {
    console.log("-----------------------------------------");
    console.log("🚀 Initializing Application Data...");

    const estaciones = await getStations()

    console.log("✅ Data Initialized:", estaciones);
    console.log("-----------------------------------------");

    return estaciones;
};

// Singleton getter
export const getGlobalStore = async (): Promise<GlobalState> => {
    // Check if store already exists (useful for hot repalcement in dev)
    if (!globalThis.__APP_STORE__) {
        const mappedData = await initializeData();

        globalThis.__APP_STORE__ = {
            mappedData,
            isInitialized: true,
        };
    }
    return globalThis.__APP_STORE__!;
};

// Helper to access data directly
export const getMappedData = async () => {
    return (await getGlobalStore()).mappedData;
}
