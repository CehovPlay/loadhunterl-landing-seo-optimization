"use client"

import { BLOCKS } from "@/content/home"
import { PRODUCTS_WITH_STATUS } from "@/content/registry"
import { RoadStage } from "../scene/RoadStage"
import { DispatchProof } from "../proofs/DispatchProof"

export function StageTms({ active }: { active: boolean }) {
  return (
    <RoadStage
      block={BLOCKS.two}
      of="05"
      active={active}
      product="hunttms"
      statuses={PRODUCTS_WITH_STATUS[1].statuses}
    >
      <DispatchProof onInteract={() => {}} />
    </RoadStage>
  )
}
