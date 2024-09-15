import { CheckCircle2, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { InOrbiIcon } from './in-orbit-icon'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { OutlineButton } from './ui/outline-button'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from '../http/get-summary'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import ptBR from 'dayjs/locale/pt-br'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale(ptBR)

export function Summary() {
const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60, // 60 segundos
})
if (!data) {
    return null
}

const firstDayOfWeek = dayjs()
    .tz('America/Sao_Paulo')
    .startOf('week')
    .format('DD MMMM')
const lastDayOfWeek = dayjs()
    .tz('America/Sao_Paulo')
    .endOf('week')
    .format('DD MMMM')

  const completedPercentage = Math.round((data.completed * 100) / data.total)

return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
        <InOrbiIcon />
        <samp className="text-lg font-semibold">
            {firstDayOfWeek} - {lastDayOfWeek}
        </samp>
        </div>
        <DialogTrigger asChild>
        <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
        </Button>
        </DialogTrigger>
    </div>

    <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
        <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>
    </div>

    <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>
        {' '}
        Você completou{' '}
        <span className="text-zinc-100"> {data?.completed} </span>de {''}
        <samp className="text-zinc-100">{data?.total}</samp> metas nessa
        semana.{' '}
        </span>
        <span> {completedPercentage}%</span>
    </div>
    <Separator />

    <div className="flex flex-wrap gap-3">
        <OutlineButton>
        <Plus className=" size-4 text-zinc-600" />
        Meditar
        </OutlineButton>
        <OutlineButton>
        <Plus className=" size-4 text-zinc-600" />
        Comer de manha cedo
        </OutlineButton>
        <OutlineButton>
        <Plus className=" size-4 text-zinc-600" />
        Meditar
        </OutlineButton>
    </div>

    <div className=" flex flex-col gap-6">
        <h2 className="text-xl font-medium"> Sua semana </h2>
        
        {data.goalsPerDay && Object.entries(data.goalsPerDay).map(([date, goals]) => {
          const weekDay = dayjs(date).format('dddd')
          const formattedDate = dayjs(date).format('D[ de ] MMMM')
          return (
            <div key={date} className="flex flex-col gap-4">
            <h3 className="font-medium">
                <span className='capitalize'> {weekDay} </span>
                <span className="text-zinc-400 text-xs">({formattedDate})</span>
            </h3>

            <ul className="flex flex-col gap-3">
          {goals.map((goal: goals) => { 
          const time = dayjs(goal.completedAt).format('YYYY-MM-DD')

        return (
          <li key={goal.id} className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-pink-500" />
            <span className="text-sm text-zinc-400">
              Você completou "{goal.description}" às {time}
            </span>
          </li>
                                )
              })}
            </ul>
            </div>
        )
        })}
    </div>
    </div>
)
}
