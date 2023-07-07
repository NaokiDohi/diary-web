export type StripeSubscription = {
  id: string
  current_period_end: number
  current_period_start: number
  default_payment_method: {
    card: {
      last4: string
    }
  }
  plan: {
    id: string
    nickname: string
    amount: number
    currency: string
  }
  status: string
}

export interface StripeSubscriptionStatus {
  [index: string]: string
}
