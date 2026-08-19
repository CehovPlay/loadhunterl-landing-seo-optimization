"use client"

import { useState } from "react"
import { BLOCKS, PRODUCTS } from "@/content/home"
import { Block } from "../Block"
import { DispatchProof } from "../proofs/DispatchProof"

/** Stage 02. The board needs the page width, so the copy sits above it. */
export function StageTms() {
  const [interacted, setInteracted] = useState(false)
  return (
    <Block
      block={BLOCKS.two}
      product="hunttms"
      statuses={PRODUCTS[1].statuses}
      mirror
      interacted={interacted}
    >
      <DispatchProof onInteract={() => setInteracted(true)} />
    </Block>
  )
}
