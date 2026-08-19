"use client"

import { useState } from "react"
import { BLOCKS, PRODUCTS } from "@/content/home"
import { Block } from "../Block"
import { DriverProof } from "../proofs/DriverProof"

/** Stage 03. Two panels side by side need the wide layout to stay side by side. */
export function StageDrive() {
  const [interacted, setInteracted] = useState(false)
  return (
    <Block
      block={BLOCKS.three}
      product="huntdrive"
      statuses={PRODUCTS[2].statuses}
      layout="wide"
      interacted={interacted}
    >
      <DriverProof onInteract={() => setInteracted(true)} />
    </Block>
  )
}
