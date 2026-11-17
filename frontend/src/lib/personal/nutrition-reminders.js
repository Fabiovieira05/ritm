import { isoOf } from '../format.js'
import { mealsForDate } from './meal-plan.js'

const DAY_COUNT = 7
const FIRST_ID = 461000
const LAST_ID = FIRST_ID + 119
export const reminderDefaults = { meals: false, water: false, bedtime: '23:00', leadHours: 2, mlPerKg: 30 }

export function activeMealPlan(state, requested) {
  const plans = (state.nutrition?.mealPlans || []).filter(plan => !plan.deletedAt)
  return plans.find(plan => plan.id === requested)
    || plans.find(plan => plan.id === state.activeMealPlanId)
    || plans.reduce((latest, plan) => !latest || plan.updatedAt > latest.updatedAt ? plan : latest, null)
}

function minutes(time) {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time || '')) return null
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}
export const reminderClock = value => [Math.floor(value / 60), value % 60].map(n => String(n).padStart(2, '0')).join(':')

export function waterSchedule(state) {
  const prefs = { ...reminderDefaults, ...state.nutritionReminders }
  const latest = (state.bodyweight || []).at(-1)
  const kg = Number(latest?.w) * (state.unit === 'lb' ? 0.45359237 : 1)
  const factor = Number(prefs.mlPerKg)
  const daily = Math.round(kg * factor)
  const bedtime = minutes(prefs.bedtime)
  if (!Number.isFinite(daily) || daily <= 0 || factor < 10 || factor > 60 || bedtime === null) return []
  const lead = Number(prefs.leadHours) === 3 ? 180 : 120
  const final = Math.min(1439, bedtime - lead + (bedtime < 360 ? 1440 : 0))
  const second = Math.min(18 * 60, final - 120)
  const first = Math.max(0, Math.min(12 * 60, second - 120))
  return [first, second, final].map((minute, index) => ({ minute, target: Math.round(daily * (index + 1) / 3) }))
}

export function buildNutritionReminders(state, now = new Date(), translate = value => value) {
  const prefs = { ...reminderDefaults, ...state.nutritionReminders }
  const plan = prefs.meals ? activeMealPlan(state) : null
  const water = prefs.water ? waterSchedule(state) : []
  const notifications = []
  for (let offset = 0; offset < DAY_COUNT; offset++) {
    const day = new Date(now)
    day.setDate(day.getDate() + offset)
    const date = isoOf(day)
    const entries = []
    if (plan) {
      const recorded = new Set((state.nutrition?.meals || [])
        .filter(meal => !meal.deletedAt && meal.date === date && meal.planId === plan.id).map(meal => meal.planMealId))
      for (const meal of mealsForDate(plan, date)) {
        const minute = minutes(meal.time)
        if (minute === null || recorded.has(meal.id)) continue
        entries.push({ minute, title: meal.name, body: translate('View meal quantities'), extra: { kind: 'ritm-meal', date, planId: plan.id, mealId: meal.id, dayId: meal.dayId } })
      }
    }
    for (const goal of water) {
      const body = translate('Cumulative water goal by {0}: {1} ml', reminderClock(goal.minute), goal.target)
      entries.push({ minute: goal.minute, title: translate('Water reminder'), body, extra: { kind: 'ritm-water', date } })
    }
    for (const { minute, ...entry } of entries) {
      const at = new Date(day)
      at.setHours(0, minute, 0, 0)
      if (at <= now) continue
      notifications.push({ ...entry, schedule: { at, allowWhileIdle: true } })
    }
  }
  return notifications.sort((a, b) => a.schedule.at - b.schedule.at)
    .slice(0, LAST_ID - FIRST_ID + 1).map((entry, index) => ({ ...entry, id: FIRST_ID + index }))
}

export function nutritionReminderRoute(extra) {
  if (extra?.kind !== 'ritm-meal' && extra?.kind !== 'ritm-water') return null
  if (extra.kind === 'ritm-water') return '/nutrition?water=1'
  const query = new URLSearchParams({ view: 'plan' })
  for (const key of ['date', 'planId', 'mealId', 'dayId']) {
    if (typeof extra[key] === 'string') query.set(key, extra[key])
  }
  return '/nutrition?' + query
}

let queue = Promise.resolve()
let fingerprint
export function syncNutritionReminders(plugin, state, translate, interactive = false) {
  const run = queue.then(async () => {
    const notifications = buildNutritionReminders(state, new Date(), translate)
    const prefs = state.nutritionReminders
    const enabled = prefs?.meals || prefs?.water
    const key = JSON.stringify(notifications)
    if (key === fingerprint && !interactive) return true
    if (enabled) {
      let permission = await plugin.checkPermissions()
      if (permission.display !== 'granted' && interactive) permission = await plugin.requestPermissions()
      if (permission.display !== 'granted') return false
    }
    const pending = (await plugin.getPending()).notifications.filter(({ id }) => id >= FIRST_ID && id <= LAST_ID)
    if (pending.length) await plugin.cancel({ notifications: pending.map(({ id }) => ({ id })) })
    fingerprint = undefined
    if (notifications.length) await plugin.schedule({ notifications })
    fingerprint = key
    return true
  })
  queue = run.catch(() => {})
  return run
}
