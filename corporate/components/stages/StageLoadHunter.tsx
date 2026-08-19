"use client"

import { useState } from "react"
import { BLOCKS, PRODUCTS } from "@/content/home"
import { Block } from "../Block"
import { BoardProof } from "../proofs/BoardProof"

/**
 * Stage 01. The wrapper exists for one reason: the tab opens each block's CTA
 * "after interaction OR after half the block is seen", and only the proof knows
 * about the interaction half of that.
 */
export function StageLoadHunter() {
  const [interacted, setInteracted] = useState(false)
  return (
    <Block
      block={BLOCKS.one}
      product="loadhunter"
      statuses={PRODUCTS[0].statuses}
      interacted={interacted}
    >
      <BoardProof onInteract={() => setInteracted(true)} />
    </Block>
  )
}
