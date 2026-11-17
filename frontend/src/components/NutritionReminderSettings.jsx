import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { MOBILE } from '../lib/mobile.js'
import { t } from '../lib/i18n.js'
import { Switch } from './ui.jsx'
import { reminderDefaults, waterSchedule, reminderClock } from '../lib/personal/nutrition-reminders.js'
import { refreshNutritionReminders } from '../lib/personal/use-nutrition-reminders.js'

export default function NutritionReminderSettings({ open }) {
  const state = useStore(store => store.S)
  const prefs = { ...reminderDefaults, ...state.nutritionReminders }
  const [failed, setFailed] = useState(false)
  const goals = waterSchedule(state)
  const [factor, setFactor] = useState(String(prefs.mlPerKg))
  const save = patch => useStore.getState().update(state => {
    state.nutritionReminders = { ...reminderDefaults, ...state.nutritionReminders, ...patch }
  })
  const toggle = async (key, enabled) => {
    setFailed(false)
    save({ [key]: enabled })
    if (enabled) setFailed(!(await refreshNutritionReminders(useStore.getState().S, true)))
  }

  return <details className="card personal-stack ritm-nutrition-reminders" open={open || undefined}>
    <summary>{t('Nutrition reminders')}</summary>
    {MOBILE && <label className="row between">
      <span>{t('Meal reminders')}</span>
      <Switch aria-label={t('Meal reminders')} checked={prefs.meals} onChange={on => toggle('meals', on)} />
    </label>}
    {MOBILE && <label className="row between">
      <span>{t('Water reminder')}</span>
      <Switch aria-label={t('Water reminder')} checked={prefs.water} onChange={on => toggle('water', on)} />
    </label>}
    {failed && <p role="status" className="small">{t('Check Android notification permission')}</p>}
    <h3>{t('Estimated daily water goal')}</h3>
    <p className="small muted">{t('Adjust the estimate for your routine. The reminders are cumulative goals.')}</p>
    <div className="ritm-water-options">
      <label>{t('Water per kg (ml)')}<input className="field" type="number" min="10" max="60" step="1" value={factor}
        onChange={event => {
          const value = event.target.value
          setFactor(value)
          if (Number.isInteger(Number(value)) && Number(value) >= 10 && Number(value) <= 60) save({ mlPerKg: Number(value) })
        }} onBlur={() => setFactor(String(useStore.getState().S.nutritionReminders?.mlPerKg ?? reminderDefaults.mlPerKg))} /></label>
      <label>{t('Bedtime')}<input className="field" type="time" value={prefs.bedtime}
        onChange={event => { if (event.target.value) save({ bedtime: event.target.value }) }} /></label>
      <label>{t('Last reminder before bed')}<select className="field" value={prefs.leadHours}
        onChange={event => save({ leadHours: Number(event.target.value) })}>
        <option value="2">2 h</option><option value="3">3 h</option>
      </select></label>
    </div>
    {goals.length ? <ul className="small">{goals.map(goal => <li key={goal.minute}>{t('Cumulative water goal by {0}: {1} ml', reminderClock(goal.minute), goal.target)}</li>)}</ul>
      : <p className="small muted">{t('Log your weight on Home to calculate a water goal.')}</p>}
  </details>
}
