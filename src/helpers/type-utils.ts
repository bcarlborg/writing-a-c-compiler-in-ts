import { CompilerStage } from "./constants";
import { CompilerError } from "./logging";

/**
 * Declare that a value must be `never`. Use this to enforce that all cases in
 * a union type are handled.
 *
 * Example:
 * ```
 * type Thing = 'a' | 'b' | 'c'
 *
 * function handleThing(thing: Thing) {
 *   if (thing === 'a') {
 *     doThing()
 *     return
 *   }
 *   if (thing === 'b' || thing === 'c') {
 *     doOtherThing()
 *     return
 *   }
 *
 *   // Here type of `thing` has been narrowed to never.
 *   // But, if a new type of Thing is introduced,
 *   // the narrowed type will no longer be never, causing a
 *   // compiler error here.
 *   unreachable(thing)
 * }
 * ```
 */
export function unreachable(
  never: never,
  stage: CompilerStage,
  message: string
): never {
  if (message) {
    throw new CompilerError(stage, message);
  }

  let stringified = "(unknown)";
  try {
    try {
      stringified = JSON.stringify(never) ?? "undefined";
    } catch (error) {
      stringified = String(never);
      const jsonErrorMessage =
        error instanceof Error ? error.message : undefined;
      if (jsonErrorMessage) {
        stringified += ` (Not serializable: ${jsonErrorMessage})`;
      }
    }
  } catch {}

  throw new CompilerError(
    stage,
    `Expected value to never occur: ${stringified}`
  );
}
