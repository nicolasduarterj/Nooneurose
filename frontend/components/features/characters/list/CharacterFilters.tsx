"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { Search, SlidersHorizontal } from "lucide-react";

export type CharacterFiltersState = {
    characterName: string;
    isGloballyChangeableSelected: boolean;
    isPrivatelyChangeableSelected: boolean;
};

type CharacterFiltersProps = {
    value: CharacterFiltersState;
    isLoading?: boolean;
    onChange: (newValue: CharacterFiltersState) => void;
    onSearch: () => Promise<void> | void;
};

export default function CharacterFilters({ value, isLoading, onChange, onSearch }: CharacterFiltersProps) {
    return (
        <div className="flex flex-col justify-between gap-3">
            <div className="flex w-full max-w-xl gap-2">
                <Input
                    name="characterName"
                    value={value.characterName}
                    onChange={(event) => onChange({ ...value, characterName: event.target.value })}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            onSearch();
                        }
                    }}
                    className="bg-tertiary/10 border-2 border-primary/30 rounded-lg text-md text-neutral/50 focus-visible:outline-primary focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                    placeholder="Buscar personagem..."
                />
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                disabled={isLoading}
                                className="shrink-0 bg-primary/50 text-neutral/80 hover:bg-primary/70 cursor-pointer">
                                <SlidersHorizontal />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="start"
                            className="w-fit bg-tertiary text-neutral border border-neutral/50">
                            <div>
                                <div className="flex flex-row gap-2 p-2 items-center">
                                    <Checkbox
                                        checked={value.isGloballyChangeableSelected}
                                        onCheckedChange={(checked) => onChange({ ...value, isGloballyChangeableSelected: !!checked })}
                                        className="data-checked:bg-tertiary/40 data-checked:border-neutral/50"
                                    />
                                    <span>Edição global</span>
                                </div>
                                <div className="flex flex-row gap-2 p-2 items-center">
                                    <Checkbox
                                        checked={value.isPrivatelyChangeableSelected}
                                        onCheckedChange={(checked) => onChange({ ...value, isPrivatelyChangeableSelected: !!checked })}
                                        className="data-checked:bg-tertiary/40 data-checked:border-neutral/50"
                                    />
                                    <span>Edição restrita</span>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                </div>
                <Button
                    type="button"
                    onClick={onSearch}
                    disabled={isLoading}
                    className="shrink-0 bg-primary/50 text-neutral/80 hover:bg-primary/70 cursor-pointer"
                >
                    <Search className="size-4" />
                </Button>
            </div>
            <div>
                <div className="flex flex-row items-center gap-4">
                    <p>Filtros:</p>
                    {value.isGloballyChangeableSelected && (
                        <Badge className="bg-tertiary text-neutral/80 gap-1">
                            Edição global
                        </Badge>
                    )}
                    {value.isPrivatelyChangeableSelected && (
                        <Badge className="bg-tertiary text-neutral/80 gap-1">
                            Edição restrita
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    )
}