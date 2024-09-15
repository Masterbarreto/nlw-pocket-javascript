

type SummaryResponse = {
    completed: number;
    total: number;
    goalsPerDay: Record<string,{
      id: string,
      title: string,
      completedstringt: string,
}>;
}

export async function getSummary(): Promise<SummaryResponse> {
    const response = await fetch('http://localhost:333/summary')
    const data = await response.json()
    return data.summary
}