"use client"

import { BLOCKS } from "@/content/home"
import { PRODUCTS_WITH_STATUS } from "@/content/registry"
import { CommandProof } from "@/components/proofs/CommandProof"
import { PayProof } from "@/components/proofs/PayProof"
import { StageDrive } from "@/components/stages/StageDrive"
import { StageLoadHunter } from "@/components/stages/StageLoadHunter"
import { StageTms } from "@/components/stages/StageTms"
import { FreightRoute } from "./FreightRoute"
import { RoadStage } from "./RoadStage"

/**
 * The five stops, composed.
 *
 * It exists because `FreightRoute` hands the active stop down as a render
 * function, and a function cannot cross the server/client boundary - the page
 * is a server component. Putting the composition here keeps the page free of
 * "use client" and keeps the road's five stops in one readable list.
 */
export function Road() {
  return (
    <FreightRoute
      anchors={[
        BLOCKS.one.id,
        BLOCKS.two.id,
        BLOCKS.three.id,
        BLOCKS.four.id,
        BLOCKS.five.id,
      ]}
    >
      {(active) => (
        <>
          <StageLoadHunter active={active === 0} />
          <StageTms active={active === 1} />
          <StageDrive active={active === 2} />

          <RoadStage
            block={BLOCKS.four}
            of="05"
            product="huntpay"
            statuses={PRODUCTS_WITH_STATUS[3].statuses}
            active={active === 3}
          >
            <PayProof />
          </RoadStage>

          <RoadStage
            block={BLOCKS.five}
            of="05"
            product="huntos"
            statuses={PRODUCTS_WITH_STATUS[4].statuses}
            active={active === 4}
          >
            <CommandProof />
          </RoadStage>
        </>
      )}
    </FreightRoute>
  )
}
