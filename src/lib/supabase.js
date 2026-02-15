import { createClient } from '@supabase/supabase-js'

// إعدادات Supabase - استبدل هذه القيم بقيمك من Supabase Dashboard أو أنشئ ملف .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// إنشاء Supabase client فقط إذا كانت القيم صالحة (URL يبدأ بـ http:// أو https://)
const isValidUrl = (url) => typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// دوال مساعدة للتعامل مع البيانات

// جلب الإعدادات من Supabase
export const getSettings = async () => {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      console.error('Error fetching settings:', error)
      return null
    }

    return data ? data.data : null
  } catch (error) {
    console.error('Error in getSettings:', error)
    return null
  }
}

// حفظ الإعدادات في Supabase
export const saveSettings = async (settings) => {
  if (!supabase) return false
  try {
    const { data, error } = await supabase
      .from('settings')
      .upsert({
        id: 1,
        data: settings,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving settings:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in saveSettings:', error)
    return false
  }
}

// حفظ بيانات المستخدم
export const saveUserData = async (userData) => {
  if (!supabase) return false
  try {
    const { data, error } = await supabase
      .from('user_data')
      .insert({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        timestamp: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving user data:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in saveUserData:', error)
    return false
  }
}

// حفظ بيانات الجائزة الفائزة
export const saveWinData = async (winData) => {
  if (!supabase) return false
  try {
    const { data, error } = await supabase
      .from('wins')
      .insert({
        name: winData.name,
        email: winData.email,
        phone: winData.phone,
        prize: winData.prize,
        coupon_code: winData.couponCode,
        timestamp: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving win data:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in saveWinData:', error)
    return false
  }
}

// جلب جميع بيانات المستخدمين
export const getAllUserData = async () => {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching user data:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllUserData:', error)
    return []
  }
}

// جلب جميع الجوائز الفائزة
export const getAllWins = async () => {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('wins')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching wins:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllWins:', error)
    return []
  }
}
