import { describe, expect, it } from "vitest"

import { resolveOnboardingStatus } from "../../convex/lib/onboarding"

describe("resolveOnboardingStatus", () => {
  it("returns default onboarding flags for a new user", () => {
    expect(resolveOnboardingStatus(null)).toEqual({
      needsStarterTagsSetup: true,
      starterTagsSetupCompletedAt: undefined,
      mainOnboardingCompletedAt: undefined,
      advancedSearchOnboardingCompletedAt: undefined,
      categoryColors: {},
    })
  })

  it("preserves onboarding and starter tag completion state independently", () => {
    expect(
      resolveOnboardingStatus({
        starterTagsSetupCompletedAt: 10,
        mainOnboardingCompletedAt: 20,
        advancedSearchOnboardingCompletedAt: 30,
        starterTagCategoryColors: { themes: "#abcdef" },
      }),
    ).toEqual({
      needsStarterTagsSetup: false,
      starterTagsSetupCompletedAt: 10,
      mainOnboardingCompletedAt: 20,
      advancedSearchOnboardingCompletedAt: 30,
      categoryColors: { themes: "#abcdef" },
    })
  })
})
