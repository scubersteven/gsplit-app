"use client"

import * as React from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { TIERS, getTotalPoints, getProgressToNextTier, getTierFromPoints } from "@/lib/gamification"

// Point earning breakdown
const pointsBreakdown = [
  { label: "Your score = base points", example: "86% = 86 pts" },
  { label: "First pour today", value: "+10 pts" },
  { label: "Score 90%+", value: "+20 bonus" },
  { label: "7-day streak", value: "+100 bonus" },
  { label: "Share to Instagram", value: "+10 pts" },
  { label: "Survey complete", value: "+5 pts" },
]

interface MasteryLevelsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatPoints(points: number) {
  return points.toLocaleString()
}

export function MasteryLevelsModal({ open, onOpenChange }: MasteryLevelsModalProps) {
  const [howPointsOpen, setHowPointsOpen] = React.useState(false)
  
  const totalPoints = getTotalPoints()
  const currentTier = getTierFromPoints(totalPoints)
  const currentIndex = TIERS.findIndex(t => t.name === currentTier.name)
  const nextTier = currentIndex < TIERS.length - 1 ? TIERS[currentIndex + 1] : null
  const progress = getProgressToNextTier(totalPoints)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[70vh] max-w-sm flex-col border-0 bg-[#FFF8E7] p-0 shadow-2xl mx-4 mt-16 rounded-xl"
        showCloseButton={false}
      >
        {/* Header */}
        <DialogHeader className="flex shrink-0 flex-row items-center justify-between px-6 pt-6">
          <DialogTitle className="font-serif text-3xl font-bold text-[#1A1A1A]">Mastery Levels</DialogTitle>
          <DialogClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#F7D447] focus:ring-offset-2">
            <X className="h-5 w-5 text-[#1A1A1A]" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6">
          {/* Current Level Card */}
          <div className="rounded-xl bg-[#2A2A2A] p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{currentTier.icon}</span>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-bold text-[#FFF8E7]">{currentTier.name}</h3>
                <p className="text-sm italic text-[#9CA3AF]">{currentTier.tagline}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#3A3A3A]">
                <div
                  className="h-full rounded-full bg-[#F7D447] transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-sans text-[#FFF8E7]">
                  {formatPoints(progress.current)} / {formatPoints(progress.total)} pts
                </span>
                {nextTier && (
                  <span className="flex items-center gap-1.5 text-[#F7D447]">
                    Next: <span>{nextTier.icon}</span> {nextTier.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* How Points Work + Tier List Card */}
          <div className="rounded-xl bg-[#2A2A2A]">
            {/* How Points Work - Collapsible */}
            <Collapsible open={howPointsOpen} onOpenChange={setHowPointsOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-4 text-left">
                <span className="font-sans text-base font-semibold text-[#FFF8E7]">How Points Work</span>
                {howPointsOpen ? (
                  <ChevronUp className="h-5 w-5 text-[#FFF8E7]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#FFF8E7]" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-[#3A3A3A] px-5 py-4">
                  <ul className="space-y-2 text-sm text-[#FFF8E7]">
                    {pointsBreakdown.map((item, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span>
                          {item.label}
                          {item.example && <span className="ml-1 text-[#9CA3AF]">({item.example})</span>}
                        </span>
                        {item.value && <span className="text-[#F7D447]">{item.value}</span>}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 border-t border-[#3A3A3A] pt-3 text-sm text-[#9CA3AF]">
                    Daily limit: 1,000 points max
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Divider */}
            <div className="border-t border-[#3A3A3A]" />

            {/* Tier Levels */}
            <div className="px-5 py-4">
              <h4 className="mb-4 font-sans text-base font-semibold text-[#FFF8E7]">Tier Levels</h4>
              <div className="space-y-1">
                {TIERS.map((tier, index) => {
                  const isCurrentTier = index === currentIndex

                  return (
                    <div
                      key={tier.name}
                      className={cn(
                        "relative flex items-start gap-4 rounded-lg px-4 py-3 transition-colors",
                        isCurrentTier && "bg-[#252525]",
                      )}
                    >
                      {/* Gold left border for current tier */}
                      {isCurrentTier && (
                        <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-[#F7D447]" />
                      )}

                      <span className="mt-0.5 text-xl">{tier.icon}</span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <h5 className="font-serif text-base font-bold text-[#FFF8E7]">{tier.name}</h5>
                          {isCurrentTier && (
                            <span className="rounded-md border border-[#F7D447]/30 bg-[#F7D447]/10 px-2 py-0.5 text-xs font-medium text-[#F7D447]">
                              Your level
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#9CA3AF]">
                          {formatPoints(tier.minPoints)} →{" "}
                          {tier.maxPoints === Infinity ? "∞" : formatPoints(tier.maxPoints)}
                        </p>
                        <p className="text-sm italic text-[#9CA3AF]">{tier.tagline}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}