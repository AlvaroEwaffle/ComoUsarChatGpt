export interface SessionData {
    id: string
    valueProp: string
    serviceSteps: {
      title: string
      description: string
      prompt: string
    }[]
    isPaid: boolean
  }
  