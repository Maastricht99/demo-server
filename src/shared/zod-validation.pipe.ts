import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { z, ZodError } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {

    constructor(
        private readonly schema: z.ZodType<any>
    ) {}

    transform(value: any, metadata: ArgumentMetadata) {
        try {

            this.schema.parse(value);
            return value;
            
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                throw new BadRequestException(err.errors)
            }

            throw new Error("Bad Request");
        }
    }
}