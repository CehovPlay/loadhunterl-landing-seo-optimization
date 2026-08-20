"use client"

import { BLOCKS } from "@/content/home"
import { PRODUCTS_WITH_STATUS } from "@/content/registry"
import { RoadStage } from "../scene/RoadStage"
import { BoardProof } from "../proofs/BoardProof"

/**
 * Stage 01. The wrapper exists for one reason: the tab opens each block's CTA
 * "after interaction OR after half the block is seen", and only the proof knows
 * about the interaction half of that.
 */
export function StageLoadHunter({ active }: { active: boolean }) {
  return (
    <RoadStage
      block={BLOCKS.one}
      of="05"
      active={active}
      product="loadhunter"
      statuses={PRODUCTS_WITH_STATUS[0].statuses}
    >
      <BoardProof onInteract={() => {}} />
    </RoadStage>
  )
}
