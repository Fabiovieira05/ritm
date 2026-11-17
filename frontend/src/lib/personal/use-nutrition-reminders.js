import { useEffect, useRef } from 'react'
import { isAndroid } from '../mobile.js'
import { t } from '../i18n-core.js'
import { nutritionReminderRoute, syncNutritionReminders } from './nutrition-reminders.js'

async function notificationPlugin() {
  if (!(await isAndroid())) return null
  return (await import('@capacitor/local-notifications')).LocalNotifications
}

export async function refreshNutritionReminders(state, interactive = false) {
  try {
    const plugin = await notificationPlugin()
    return !!plugin && await syncNutritionReminders(plugin, state, t, interactive)
  } catch { return false }
}

export function useNutritionReminders(ready, state, navigate, languageVersion) {
  const current = useRef({ state, navigate })
  current.current = { state, navigate }
  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => void refreshNutritionReminders(current.current.state), 250)
    return () => clearTimeout(timer)
  }, [ready, state.nutritionReminders, state.activeMealPlanId, state.nutrition?.mealPlans,
    state.nutrition?.meals, state.bodyweight, state.unit, languageVersion]) // Schedule inputs only.

  useEffect(() => {
    if (!ready) return
    const onVisible = () => {
      if (!document.hidden) void refreshNutritionReminders(current.current.state)
    }
    document.addEventListener('visibilitychange', onVisible)
    let live = true
    let handle
    notificationPlugin().then(async plugin => {
      if (!live || !plugin) return
      const listener = await plugin.addListener('localNotificationActionPerformed', event => {
        const route = nutritionReminderRoute(event.notification?.extra)
        if (live && route) current.current.navigate(route)
      })
      if (live) handle = listener
      else await listener.remove()
    }).catch(() => {})
    return () => { live = false; document.removeEventListener('visibilitychange', onVisible); void handle?.remove() }
  }, [ready])
}
