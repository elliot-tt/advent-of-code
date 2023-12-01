import {readFileSync, PathLike} from "node:fs"

export function readLines(path: PathLike) :string[] {
   return readFileSync(path).toString('utf-8').split("\n")
}