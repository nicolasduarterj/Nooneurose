import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { X } from "lucide-react";

export default function CharacterFilters() {
    return (
        <div className="flex flex-col justify-between gap-3">
            <div>
                <div className="flex flex-row items-center gap-4">
                    <p>Filtros:</p>
                    <Badge className="bg-tertiary text-neutral/80 gap-1">
                        Edição global
                        <X />
                    </Badge>
                </div>
            </div>
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="text-neutral/80 bg-tertiary hover:bg-tertiary/80 cursor-pointer">Selecionar filtros</Button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        className="w-fit bg-tertiary text-neutral border border-neutral/50">
                        <div>
                            <div className="flex flex-row gap-2 p-2 items-center">
                                <Checkbox className="data-checked:bg-tertiary/40 data-checked:border-neutral/50" />
                                <span>Edição global</span>
                            </div>
                            <div className="flex flex-row gap-2 p-2 items-center">
                                <Checkbox className="data-checked:bg-tertiary/40 data-checked:border-neutral/50" />
                                <span>Edição restrita</span>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}