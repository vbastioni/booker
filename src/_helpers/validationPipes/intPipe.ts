import { HttpStatus, ParseBoolPipe, ParseIntPipe } from "@nestjs/common";

export const intPipe = new ParseIntPipe({
    errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
});
