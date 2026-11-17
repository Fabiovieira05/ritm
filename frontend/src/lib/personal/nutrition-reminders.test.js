import { expect, it } from 'vitest'
import { parseMealPlan } from './meal-plan.js'
import { buildNutritionReminders, nutritionReminderRoute, waterSchedule } from './nutrition-reminders.js'

const meal = (id, name, time) => ({ id, name, time, items: [] })
const plan = (id, days) => parseMealPlan(JSON.stringify({ format: 'opengym-personal-meal-plan', formatVersion: 1, id, name: id, days }))

it('uses the active plan, dated exceptions, and exact meal destinations', () => {
  const primary = plan('primary', [{ weekday: 0, meals: [meal('usual', 'Lunch', '13:00'), meal('unscheduled', 'Snack', null)] },
    { date: '2026-11-17', meals: [meal('exception', 'Special lunch', '14:30')] }])
  const other = plan('other', [{ weekday: 0, meals: [meal('other', 'Other lunch', '12:00')] }])
  const state = { activeMealPlanId: primary.id, nutritionReminders: { meals: true }, nutrition: { mealPlans: [other, primary] } }
  const now = new Date(2026, 10, 17, 12)
  const scheduled = buildNutritionReminders(state, now)
  expect(scheduled.map(entry => entry.title)).toEqual(['Special lunch', ...Array(6).fill('Lunch')])
  expect(scheduled[0].schedule.at).toEqual(new Date(2026, 10, 17, 14, 30))
  expect(nutritionReminderRoute(scheduled[0].extra)).toContain('planId=primary&mealId=exception&dayId=')
  state.nutrition.meals = [{ date: '2026-11-17', planId: primary.id, planMealId: 'exception' }]
  expect(buildNutritionReminders(state, now)).toHaveLength(6)
  expect(nutritionReminderRoute({ kind: 'workout' })).toBeNull()
})

it('converts pounds, rounds cumulative thirds and moves reminders earlier for sleep', () => {
  const state = { unit: 'lb', bodyweight: [{ w: 176.37 }], nutritionReminders: { bedtime: '23:00', mlPerKg: 30 } }
  expect(waterSchedule(state)).toEqual([{ minute: 720, target: 800 }, { minute: 1080, target: 1600 }, { minute: 1260, target: 2400 }])
  state.nutritionReminders = { bedtime: '21:00', leadHours: 3 }
  expect(waterSchedule(state).map(goal => goal.minute)).toEqual([720, 960, 1080])
  state.nutritionReminders = { bedtime: '00:30', leadHours: 2 }
  expect(waterSchedule(state).at(-1).minute).toBe(1350)
  expect(waterSchedule({ bodyweight: [] })).toEqual([])
})
