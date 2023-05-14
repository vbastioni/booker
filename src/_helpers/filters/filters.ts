import { Prisma } from "@prisma/client";

export function insensitiveStringFilter(value: string): Prisma.StringFilter {
    return {
        mode: "insensitive",
        equals: value,
    };
}
