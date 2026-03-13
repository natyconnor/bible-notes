interface UserSettingsStatusInput {
  starterTagsSetupCompletedAt?: number
  mainOnboardingCompletedAt?: number
  advancedSearchOnboardingCompletedAt?: number
  starterTagCategoryColors?: Record<string, string>
}

export interface OnboardingStatus {
  needsStarterTagsSetup: boolean
  starterTagsSetupCompletedAt?: number
  mainOnboardingCompletedAt?: number
  advancedSearchOnboardingCompletedAt?: number
  categoryColors: Record<string, string>
}

export function resolveOnboardingStatus(
  settings: UserSettingsStatusInput | null | undefined,
): OnboardingStatus {
  return {
    needsStarterTagsSetup: settings?.starterTagsSetupCompletedAt === undefined,
    starterTagsSetupCompletedAt: settings?.starterTagsSetupCompletedAt,
    mainOnboardingCompletedAt: settings?.mainOnboardingCompletedAt,
    advancedSearchOnboardingCompletedAt:
      settings?.advancedSearchOnboardingCompletedAt,
    categoryColors: settings?.starterTagCategoryColors ?? {},
  }
}
