import type { ConfigProviderProps } from 'ant-design-vue'
import { adminTokens } from '@/theme/tokens'

export const adminAntdTheme: NonNullable<ConfigProviderProps['theme']> = {
  token: {
    colorPrimary: adminTokens.colorPrimary,
    colorInfo: '#2f54eb',
    colorLink: adminTokens.colorPrimary,
    colorText: adminTokens.colorText,
    colorTextSecondary: adminTokens.colorTextSecondary,
    colorBgLayout: adminTokens.colorBg,
    colorBgContainer: adminTokens.colorSurface,
    colorBorder: '#e4e8f2',
    colorBorderSecondary: '#eef1f8',
    borderRadius: adminTokens.radius,
    fontFamily: adminTokens.fontFamily,
    fontSize: 14,
    controlHeight: 36,
  },
}
