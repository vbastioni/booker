import { Prisma } from "@prisma/client";
import { IsNumberString, IsOptional } from "class-validator";

export class FindBuyerParams {
    @IsOptional()
    name?: string;

    @IsOptional()
    company?: string;

    @IsOptional()
    @IsNumberString()
    size?: string;

    @IsOptional()
    @IsNumberString()
    offset?: string;
}

export function buildArgs(params: FindBuyerParams) {
    const args: Prisma.BuyerFindManyArgs = {};

    if (params.name || params.company) {
        args.where = ["name", "company"].reduce((acc, cur) => {
            const value = params[cur];
            if (!value) {
                return acc;
            }

            switch (cur) {
                case "name":
                case "company":
                    return { ...acc, [cur]: params[cur] };
                // return { ...acc, [cur]: insensitiveStringFilter(params[cur]) }
                default:
                    throw new Error(`unhandled type for ${cur} (${value})`);
            }
        }, {} as Prisma.BuyerWhereInput);
    }

    if (params.offset !== undefined) {
        args.skip = parseInt(params.offset);
    }

    if (params.size !== undefined) {
        args.take = parseInt(params.size);
    }

    return args;
}
