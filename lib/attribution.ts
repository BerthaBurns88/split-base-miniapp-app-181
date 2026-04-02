import { Attribution } from 'ox/erc8021'
import type { Hex } from 'viem'

export const BASE_BUILDER_CODE = 'bc_b82fyz4e' as const
export const BASE_DATA_SUFFIX_FALLBACK =
  '0x62635f62383266797a34650b0080218021802180218021802180218021' as Hex

const generatedDataSuffix = (() => {
  try {
    return Attribution.toDataSuffix({ codes: [BASE_BUILDER_CODE] })
  } catch {
    return BASE_DATA_SUFFIX_FALLBACK
  }
})()

export const BASE_DATA_SUFFIX =
  generatedDataSuffix === BASE_DATA_SUFFIX_FALLBACK
    ? generatedDataSuffix
    : (generatedDataSuffix as Hex)

export const withBaseBuilderDataSuffix = <const T extends { dataSuffix?: Hex }>(
  parameters: T,
): T & { dataSuffix: Hex } => ({
  ...parameters,
  dataSuffix: BASE_DATA_SUFFIX,
})

export const withBaseBuilderSendCalls = <const T extends { capabilities?: Record<string, unknown> }>(
  parameters: T,
) => ({
  ...parameters,
  capabilities: {
    ...parameters.capabilities,
    dataSuffix: {
      value: BASE_DATA_SUFFIX,
      optional: true,
    },
  },
})
