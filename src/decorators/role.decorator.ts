import { SetMetadata } from "@nestjs/common";
import { ROLE } from "src/types/types";

export const Roles = (...roles: ROLE[]) => SetMetadata('roles', roles)