import { Prisma } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, MinLength, ValidateIf } from "class-validator";

import { argToInt } from "../../_helpers/transformers/transformer";


export class FindBuyerParamsDTO {
    @IsOptional()
    @IsNotEmpty()
    name?: string;
    
    @IsNotEmpty()
    @ValidateIf((o) => o.name === undefined)
    company?: string;

    @IsOptional()
    @IsNumber()
    @Transform(argToInt)
    size?: number;

    @IsOptional()
    @IsNumber()
    @Transform(argToInt)
    offset?: number;
}

export function buildArgs(params: FindBuyerParamsDTO) {
    const args: Prisma.BuyerFindManyArgs = {};

    if (params.name || params.company) {
        args.where = ["name", "company"].reduce((acc, cur) => {
            const value = params[cur];
            if (!value) {
                return acc;
            }
            return { ...acc, [cur]: params[cur] };
        }, {} as Prisma.BuyerWhereInput);
    }

    if (params.offset !== undefined) {
        args.skip = params.offset;
    }

    if (params.size !== undefined) {
        args.take = params.size;
    }

    return args;
}
