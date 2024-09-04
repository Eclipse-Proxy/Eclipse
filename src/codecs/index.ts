import { plain } from "./plain.ts";
import { xor } from "./xor.ts";
import { base64 } from "./base64.ts";
import { hex } from "./hex.ts";
import { comp } from "./comp.ts";

self.__eclipse$codecs = { plain, xor, base64, hex, comp };
