import { z } from "zod";

export const ObjectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "You must supply a valid MongoDB ObjectID");

export const DiscordSnowflake = z
  .string()
  .regex(/^[0-9]{7,}$/i, "You must supply a valid Snowflake");
