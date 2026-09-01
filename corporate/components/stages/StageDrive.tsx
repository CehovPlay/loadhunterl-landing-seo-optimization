"use client"

import { BLOCKS } from "@/content/home"
import { PRODUCTS_WITH_STATUS } from "@/content/registry"
import { RoadStage } from "../scene/RoadStage"
import { DriverProof } from "../proofs/DriverProof"

/**
 * Stage 03.
 *
 * It used to take the wide layout because the phone and the dispatch view sit
 * side by side and needed the room. Since the road went to a 4/8 split the
 * proof column is ~850px, which holds both, and the stop keeps the same shape
 * as the other four - a stop that breaks the rhythm reads as a mistake rather
 * than as emphasis.
 */
export function StageDrive({ active }: { active: boolean }) {
  return (
    <RoadStage
      block={BLOCKS.three}
      of="05"
      active={active}
      product="huntdrive"
      statuses={PRODUCTS_WITH_STATUS[2].statuses}
    >
      <DriverProof onInteract={() => {}} />
    </RoadStage>
  )
}
