"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapModalProps {
    children: React.ReactNode;
    line: string;
}

export function MapModal({ children, line }: MapModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
    }, [isOpen]);

    const handleZoomIn = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setScale((prev) => Math.min(prev + 0.5, 4));
    };

    const handleZoomOut = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setScale((prev) => Math.max(prev - 0.5, 1));
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            e.preventDefault();
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <>
            <div onClick={() => setIsOpen(true)}>{children}</div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200">
                    <div className="relative w-full max-w-4xl bg-card rounded-lg shadow-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[80vh]">
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-background/50 hover:bg-background rounded-full"
                                onClick={handleZoomOut}
                                disabled={scale <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-background/50 hover:bg-background rounded-full"
                                onClick={handleZoomIn}
                                disabled={scale >= 4}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-background/50 hover:bg-background rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>

                        <div
                            ref={containerRef}
                            className="relative flex-1 w-full bg-white overflow-hidden cursor-grab active:cursor-grabbing"
                            onWheel={handleWheel}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <div
                                className="relative w-full h-full origin-center"
                                style={{
                                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                                }}
                            >
                                <Image
                                    src={`/linea-${line.toUpperCase()}.png`}
                                    alt="Mapa de Subtes"
                                    fill
                                    className="object-contain"
                                    draggable={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={() => setIsOpen(false)}
                    />
                </div>
            )}
        </>
    );
}
